import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            credentials: {
                identifier: { label: "Identifier", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize called with keys:", Object.keys(credentials as any));
                console.log("Identifier:", (credentials as any).identifier);

                const parsedCredentials = z
                    .object({ identifier: z.string().min(3), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { identifier, password } = parsedCredentials.data;

                    if (!prisma) {
                        console.error("Prisma client not found");
                        return null;
                    }

                    // Allow login by email or name (username)
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: identifier },
                                { name: identifier }
                            ]
                        }
                    });

                    if (!user) {
                        console.error("User not found for identifier:", identifier);
                        return null;
                    }

                    if (!user.password) {
                        console.error("User has no password set (possibly oauth user):", identifier);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;

                    console.error("Password mismatch for user:", identifier);
                } else {
                    console.error("Invalid credentials format:", parsedCredentials.error.format());
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            try {
                if (token.sub && session.user) {
                    session.user.id = token.sub;
                    session.user.role = (token as any).role || "USER";
                }
            } catch (error) {
                console.error("Session callback error:", error);
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.emailVerified = (user as any).emailVerified;
            }
            return token;
        },
        ...authConfig.callbacks,
    },
});

// Extend session type
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            image?: string;
            avatar?: string;
            xp: number;
            level: number;
            role: "ADMIN" | "USER";
            emailVerified: Date | null;
            currentStreak: number;
            completedChallenges: string[];
            achievements: string[];
        }
    }
}
