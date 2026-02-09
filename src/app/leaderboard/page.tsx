'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/ui/Navbar';
import { Leaderboard } from '@/components/game/Leaderboard';
import { getLeaderboard } from '@/lib/actions';
import { Trophy, TrendingUp, Calendar, Award } from 'lucide-react';

export default function LeaderboardPage() {
    const { user, isLoading, t, language } = useAuth();
    const router = useRouter();
    const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await getLeaderboard();
            setAllTimeLeaderboard(data);
        };
        fetchLeaderboard();
    }, []);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-4xl animate-pulse">🏆</div>
            </div>
        );
    }

    // Weekly leaderboard (shuffled mock data for now, or could be fetched)
    const weeklyLeaderboard = [...allTimeLeaderboard]
        .sort(() => Math.random() - 0.5)
        .map((e, i) => ({ ...e, rank: i + 1, xp: Math.floor(e.xp * 0.1) }));

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />

            <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="inline-block text-6xl mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🏆
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {t.leaderboard.title}
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        {t.leaderboard.subtitle}
                    </p>
                </motion.div>

                {/* Your Rank Summary */}
                <motion.div
                    className="glass-card p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">{user.avatar}</div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.username}</h2>
                                <p className="text-foreground-muted">{t.profile.level} {user.level}</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-foreground-muted text-sm">{t.leaderboard.allTimeRank}</p>
                                <p className="text-3xl font-bold text-xp">
                                    #{allTimeLeaderboard.find(e => e.username === user.username)?.rank || '?'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-foreground-muted text-sm">{t.leaderboard.totalXP}</p>
                                <p className="text-3xl font-bold text-primary">
                                    {user.xp.toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US')}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-foreground-muted text-sm">{t.leaderboard.challenges}</p>
                                <p className="text-3xl font-bold text-success">
                                    {user.completedChallenges.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Leaderboard Tabs */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* All Time */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="text-xp" size={24} />
                            <h2 className="text-xl font-bold">{t.leaderboard.allTimeTitle}</h2>
                        </div>
                        <Leaderboard entries={allTimeLeaderboard} title="" />
                    </motion.div>

                    {/* Weekly */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="text-secondary" size={24} />
                            <h2 className="text-xl font-bold">{t.leaderboard.weeklyTitle}</h2>
                        </div>
                        <Leaderboard entries={weeklyLeaderboard} title="" />
                    </motion.div>
                </div>

                {/* Motivational footer */}
                <motion.div
                    className="mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="glass-card p-6 inline-block">
                        <TrendingUp className="mx-auto text-success mb-2" size={32} />
                        <p className="text-foreground-muted">
                            {t.leaderboard.motivation}
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
