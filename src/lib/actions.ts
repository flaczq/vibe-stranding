'use server';

import prisma from "@/lib/prisma";
import { signIn, auth } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Resend } from 'resend';
import WelcomeEmail from "@/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function registerUser(formData: FormData) {
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const avatar = formData.get('avatar') as string;

    if (!email || !password || !username) {
        return { error: 'Missing required fields' };
    }

    if (username.length < 3 || username.length > 20) {
        return { error: 'Username must be between 3 and 20 characters' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    // Limit avatar size to prevent DB bloat/DoS (e.g. 1MB)
    if (avatar && avatar.length > 1024 * 1024) {
        return { error: 'Avatar image is too large' };
    }

    try {
        if (!prisma) {
            return { error: 'Database connection error' };
        }

        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return { error: 'Email already taken' };
        }

        const existingUsername = await prisma.user.findFirst({ where: { name: username } });
        if (existingUsername) {
            return { error: 'Username already taken' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await (prisma as any).user.create({
            data: {
                name: username,
                email,
                password: hashedPassword,
                image: avatar,
                xp: 0,
                level: 1,
                role: "USER"
            }
        });



        // Send Real Welcome Email via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                // Use the user's picked emoji in the subject if it's not a custom image (base64)
                const subjectEmoji = (avatar && !avatar.startsWith('data:')) ? avatar : '🦀';

                await resend.emails.send({
                    from: process.env.RESEND_FROM || 'Vibe Stranding <hello@notifications.zagula.dev>',
                    to: email,
                    subject: `Welcome to the Network, ${username}! ${subjectEmoji}`,
                    react: WelcomeEmail({ username }),
                });
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // We don't fail the whole registration if email fails
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Failed to create account' };
    }
}

export async function updateXpProgress(userId: string, xpEarned: number, challengeId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || (session.user.id !== userId && session.user.role !== 'ADMIN')) {
            return { error: 'Unauthorized' };
        }

        if (!prisma) {
            return { error: 'Database connection error' };
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { error: 'User not found' };

        const newXP = user.xp + xpEarned;
        // Calculate new level based on thresholds (should match game-data logic)
        let newLevel = user.level;
        if (newXP >= 7000) newLevel = 5;
        else if (newXP >= 3500) newLevel = 4;
        else if (newXP >= 1500) newLevel = 3;
        else if (newXP >= 500) newLevel = 2;

        await prisma.$transaction([
            // Update User stats
            prisma.user.update({
                where: { id: userId },
                data: {
                    xp: newXP,
                    level: newLevel,
                    lastActiveAt: new Date(),
                }
            }),
            // Log progress
            prisma.challengeProgress.upsert({
                where: {
                    userId_challengeId: {
                        userId,
                        challengeId,
                    }
                },
                update: {
                    submittedAt: new Date(),
                },
                create: {
                    userId,
                    challengeId,
                    status: "COMPLETED",
                }
            })
        ]);

        revalidatePath('/dashboard');
        revalidatePath('/learn');
        revalidatePath('/profile');

        return { success: true, newXP, newLevel };
    } catch (error) {
        console.error('XP Update error:', error);
        return { error: 'Failed to save progress' };
    }
}

export async function getLeaderboard() {
    try {
        if (!prisma) {
            return [];
        }

        const topUsers = await prisma.user.findMany({
            orderBy: {
                xp: 'desc'
            },
            take: 20,
            select: {
                name: true,
                image: true,
                xp: true,
                level: true,
            }
        });

        return topUsers.map((user, index) => ({
            rank: index + 1,
            username: user.name || "Viber",
            avatar: user.image || "🦊",
            xp: user.xp,
            level: user.level,
        }));
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return [];
    }
}

export async function getChallenge(challengeId: string) {
    try {
        if (!prisma) return null;

        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId }
        });

        return challenge;
    } catch (error) {
        console.error('Challenge fetch error:', error);
        return null;
    }
}

export async function getUserProfile(userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        // Users can view their own profile, or admins can view any profile
        // If we want public profiles, we'd remove this check but keep 'select' limited
        if (session.user.id !== userId && session.user.role !== 'ADMIN') {
            return null;
        }

        if (!prisma) return null;

        const user = await (prisma as any).user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                xp: true,
                level: true,
                role: true,
                currentStreak: true,
                progress: { select: { challengeId: true } },
                achievements: { select: { achievementId: true } }
            }
        });

        if (!user) return null;

        return {
            ...user,
            username: user.name || "Viber",
            avatar: user.image || "🦊",
            completedChallenges: user.progress?.map((p: any) => p.challengeId) || [],
            achievements: user.achievements?.map((a: any) => a.achievementId) || [],
        };
    } catch (error) {
        console.error('User profile fetch error:', error);
        return null;
    }
}

export async function getAllUsers() {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return [];
        }

        if (!prisma) return [];

        const users = await (prisma as any).user.findMany({
            orderBy: { joinedAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                xp: true,
                level: true,
                joinedAt: true,
                image: true
            }
        });

        return users;
    } catch (error) {
        console.error('Fetch users error:', error);
        return [];
    }
}

export async function deleteUser(userId: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { error: 'Unauthorized' };
        }

        if (!prisma) return { error: 'DB not available' };

        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Delete user error:', error);
        return { error: 'Failed to delete user' };
    }
}

export async function updateUserAvatar(userId: string, avatar: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || (session.user.id !== userId && session.user.role !== 'ADMIN')) {
            return { error: 'Unauthorized' };
        }

        if (!prisma) return { error: 'DB not available' };

        await prisma.user.update({
            where: { id: userId },
            data: { image: avatar }
        });

        revalidatePath('/profile');
        revalidatePath('/dashboard');
        revalidatePath('/leaderboard');

        return { success: true };
    } catch (error) {
        console.error('Update avatar error:', error);
        return { error: 'Failed to update avatar' };
    }
}
