'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/ui/Navbar';
import { XPBar } from '@/components/game/XPBar';
import { AchievementCard } from '@/components/game/AchievementPopup';
import { ACHIEVEMENTS, LEVELS, getLevelInfo, CHALLENGES, CATEGORY_INFO } from '@/lib/game-data';
import { Trophy, Target, Flame, Calendar, LogOut, Settings, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
    const { user, isLoading, logout, t, language } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-4xl animate-pulse">👤</div>
            </div>
        );
    }

    const levelInfo = getLevelInfo(user.level);
    const unlockedAchievements = ACHIEVEMENTS.filter(a => user.achievements.includes(a.id));
    const lockedAchievements = ACHIEVEMENTS.filter(a => !user.achievements.includes(a.id));

    // Calculate category stats
    const categoryStats = Object.entries(CATEGORY_INFO).map(([key, info]) => {
        const categoryChallenges = CHALLENGES.filter(c => c.category === key);
        const completed = categoryChallenges.filter(c => user.completedChallenges.includes(c.id)).length;
        return {
            ...info,
            key,
            completed,
            total: categoryChallenges.length,
        };
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    className="glass-card p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <motion.div
                            className="text-8xl p-4 rounded-full bg-surface"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                            {user.avatar}
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                            <p className="text-foreground-muted mb-2">{user.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                <span className="text-2xl">{levelInfo.icon}</span>
                                <span className="font-semibold" style={{ color: levelInfo.color }}>
                                    {(t.levels as any)[Object.keys(t.levels)[user.level - 1]] || levelInfo.name}
                                </span>
                                <span className="text-foreground-muted">• {t.profile.level} {user.level}</span>
                            </div>
                            <p className="text-sm text-foreground-muted">
                                {t.profile.memberSince} {new Date(user.joinedAt).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
                            </p>
                        </div>

                        {/* XP Bar */}
                        <div className="w-full md:w-auto">
                            <XPBar />
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="glass-card p-5 text-center">
                        <Target className="mx-auto text-success mb-2" size={28} />
                        <p className="text-2xl font-bold text-success">{user.completedChallenges.length}</p>
                        <p className="text-foreground-muted text-sm">{t.leaderboard.challenges}</p>
                    </div>
                    <div className="glass-card p-5 text-center">
                        <Trophy className="mx-auto text-xp mb-2" size={28} />
                        <p className="text-2xl font-bold text-xp">{unlockedAchievements.length}</p>
                        <p className="text-foreground-muted text-sm">{t.profile.achievements}</p>
                    </div>
                    <div className="glass-card p-5 text-center">
                        <Flame className="mx-auto text-warning mb-2" size={28} />
                        <p className="text-2xl font-bold text-warning">{user.currentStreak}</p>
                        <p className="text-foreground-muted text-sm">{t.profile.dayStreak}</p>
                    </div>
                    <div className="glass-card p-5 text-center">
                        <Calendar className="mx-auto text-primary mb-2" size={28} />
                        <p className="text-2xl font-bold text-primary">{user.longestStreak}</p>
                        <p className="text-foreground-muted text-sm">{t.profile.bestStreak}</p>
                    </div>
                </motion.div>

                {/* Category Progress */}
                <motion.div
                    className="glass-card p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-bold mb-4">{t.profile.categoryProgress}</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {categoryStats.map((cat) => (
                            <div key={cat.key} className="p-4 bg-surface rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="font-medium text-sm">{(t.categories as any)[cat.key] || cat.name}</span>
                                </div>
                                <div className="h-2 bg-surface-light rounded-full overflow-hidden mb-1">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: cat.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.completed / cat.total) * 100}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <p className="text-xs text-foreground-muted">
                                    {cat.completed}/{cat.total} {t.profile.completed}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    className="glass-card p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Trophy className="text-xp" />
                        {t.profile.achievements} ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
                    </h2>

                    {/* Unlocked */}
                    {unlockedAchievements.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm text-foreground-muted mb-3">{t.profile.unlocked}</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {unlockedAchievements.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        <AchievementCard achievement={achievement} unlocked={true} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Locked */}
                    {lockedAchievements.length > 0 && (
                        <div>
                            <h3 className="text-sm text-foreground-muted mb-3">{t.profile.locked}</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {lockedAchievements.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        <AchievementCard achievement={achievement} unlocked={false} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Actions */}
                <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-bold mb-4">{t.profile.account}</h2>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-surface-light transition-colors">
                            <div className="flex items-center gap-3">
                                <Settings size={20} className="text-foreground-muted" />
                                <span>{t.profile.settings}</span>
                            </div>
                            <ChevronRight size={18} className="text-foreground-muted" />
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                router.push('/');
                            }}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-danger/10 transition-colors text-danger"
                        >
                            <div className="flex items-center gap-3">
                                <LogOut size={20} />
                                <span>{t.profile.logout}</span>
                            </div>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
