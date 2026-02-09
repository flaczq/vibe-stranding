'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/ui/Navbar';
import { XPBar } from '@/components/game/XPBar';
import { ChallengeCard } from '@/components/game/ChallengeCard';
import { Leaderboard, generateMockLeaderboard } from '@/components/game/Leaderboard';
import { Avatar } from '@/components/ui/Avatar';
import { LEVELS, CHALLENGES, ACHIEVEMENTS, getLevelInfo, seededShuffle, type Challenge } from '@/lib/game-data';
import { getLeaderboard } from '@/lib/actions';
import { BookOpen, Swords, Trophy, Flame, Target, Zap, Sparkles } from 'lucide-react';

export default function DashboardPage() {
    const { user, isLoading, theme, t, language } = useAuth();
    const router = useRouter();
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await getLeaderboard();
            setLeaderboardData(data);
        };
        fetchLeaderboard();
    }, []);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="text-4xl animate-pulse">{theme === 'stranding' ? '🕸️' : '🎮'}</div>
            </div>
        );
    }

    const levelInfo = getLevelInfo(user.level);
    const availableChallenges = CHALLENGES.filter(c => c.difficulty <= user.level);
    const recentChallenges = seededShuffle(availableChallenges, user.id).slice(0, 3);
    const unlockedAchievements = ACHIEVEMENTS.filter(a => user.achievements.includes(a.id));

    // Stats cards data
    const stats = [
        {
            icon: Target,
            label: t.dashboard.stats.challenges,
            value: user.completedChallenges.length,
            color: '#22c55e',
            subtext: t.dashboard.stats.completed
        },
        {
            icon: Flame,
            label: t.dashboard.stats.streak,
            value: user.currentStreak,
            color: '#f59e0b',
            subtext: t.dashboard.stats.days
        },
        {
            icon: Trophy,
            label: t.dashboard.stats.achievements,
            value: unlockedAchievements.length,
            color: '#8b5cf6',
            subtext: `${t.dashboard.stats.of} ${ACHIEVEMENTS.length}`
        },
        {
            icon: Zap,
            label: t.dashboard.stats.totalXp,
            value: user.xp,
            color: '#06b6d4',
            subtext: t.dashboard.stats.earned
        },
    ];

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />

            <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
                {/* Welcome Section */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {theme === 'stranding' ? t.dashboard.stillBreathing : t.dashboard.welcome}
                        <span className="text-primary">{user.username}</span>!
                        <span className="inline-flex items-center ml-2 translate-y-1">
                            <Avatar
                                src={user.avatar}
                                alt={user.username}
                                size="md"
                                border
                            />
                        </span>
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        {theme === 'stranding'
                            ? `${t.dashboard.networkStatus}: ${(t.levels as any)[Object.keys(t.levels)[user.level - 1]] || levelInfo.name} • ${levelInfo.description}`
                            : `${levelInfo.icon} ${(t.levels as any)[Object.keys(t.levels)[user.level - 1]] || levelInfo.name} • ${levelInfo.description}`}
                    </p>
                </motion.div>

                {/* XP Bar */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <XPBar />
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="glass-card p-5 group hover:scale-105 transition-transform cursor-default"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <stat.icon size={24} style={{ color: stat.color }} />
                                <span className="text-foreground-muted text-sm">{stat.label}</span>
                            </div>
                            <p className="text-3xl font-bold" style={{ color: stat.color }}>
                                {stat.value.toLocaleString('en-US')}
                            </p>
                            <p className="text-xs text-foreground-muted">{stat.subtext}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Actions */}
                        <motion.div
                            className="grid sm:grid-cols-2 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Link href="/learn">
                                <motion.div
                                    className="glass-card p-6 flex items-center gap-4 group cursor-pointer border-l-4 border-primary"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                        <BookOpen size={28} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                            {theme === 'stranding' ? t.dashboard.actions.searchStrands : t.dashboard.actions.continue}
                                        </h3>
                                        <p className="text-foreground-muted text-sm">
                                            {CHALLENGES.length - user.completedChallenges.length} {theme === 'stranding' ? t.dashboard.actions.connections : t.dashboard.actions.challengesLeft}
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>

                            <Link href="/compete">
                                <motion.div
                                    className="glass-card p-6 flex items-center gap-4 group cursor-pointer border-l-4 border-secondary"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                                        <Swords size={28} className="text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-secondary transition-colors">
                                            {t.dashboard.actions.competition}
                                        </h3>
                                        <p className="text-foreground-muted text-sm">
                                            {t.dashboard.actions.testSkills}
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Pro Vibe Coding Tips */}
                        <motion.div
                            className="glass-card p-6 relative overflow-hidden"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-primary animate-pulse" />
                                {theme === 'stranding' ? t.dashboard.tips.survivalTitle : t.dashboard.tips.title}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-3 bg-surface rounded-lg border border-surface-light hover:border-primary/50 transition-colors cursor-default">
                                    <p className="font-bold text-sm text-primary mb-1">{t.dashboard.tips.tip1}</p>
                                    <p className="text-xs text-foreground-muted">{t.dashboard.tips.tip1Desc}</p>
                                </div>
                                <div className="p-3 bg-surface rounded-lg border border-surface-light hover:border-secondary/50 transition-colors cursor-default">
                                    <p className="font-bold text-sm text-secondary mb-1">{t.dashboard.tips.tip2}</p>
                                    <p className="text-xs text-foreground-muted">{t.dashboard.tips.tip2Desc}</p>
                                </div>
                                <div className="p-3 bg-surface rounded-lg border border-surface-light hover:border-success/50 transition-colors cursor-default">
                                    <p className="font-bold text-sm text-success mb-1">{t.dashboard.tips.tip3}</p>
                                    <p className="text-xs text-foreground-muted">{t.dashboard.tips.tip3Desc}</p>
                                </div>
                                <div className="p-3 bg-surface rounded-lg border border-surface-light hover:border-xp/50 transition-colors cursor-default">
                                    <p className="font-bold text-sm text-xp mb-1">{t.dashboard.tips.tip4}</p>
                                    <p className="text-xs text-foreground-muted">{t.dashboard.tips.tip4Desc}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* Daily Quest */}
                            <motion.div
                                className="glass-card p-6 border-l-4 border-warning relative overflow-hidden group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {(() => {
                                    const isContextDone = user.completedChallenges.includes('prompt-basics-2');
                                    const isBasicsDone = user.completedChallenges.includes('prompt-basics-1');

                                    const quest = !isBasicsDone
                                        ? { id: 'prompt-basics-1', title: 'First steps!', desc: 'Complete "Your First Prompt" to start your journey.', target: '/learn/1/prompt-basics-1' }
                                        : !isContextDone
                                            ? { id: 'prompt-basics-2', title: 'Context is King!', desc: 'Complete the context challenge to earn bonus XP.', target: '/learn/1/prompt-basics-2' }
                                            : { id: 'prompt-basics-3', title: 'Break it Down!', desc: 'Master prompt decomposition for complex tasks.', target: '/learn/1/prompt-basics-3' };

                                    return (
                                        <>
                                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Flame size={80} />
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="p-2 bg-warning/20 rounded-lg text-warning">
                                                    <Flame size={20} />
                                                </div>
                                                <h2 className="text-xl font-bold">{t.dashboard.quest.title}</h2>
                                            </div>
                                            <p className="text-foreground font-semibold mb-2">{(t.dashboard.tips as any)[quest.id.replace('prompt-basics-', 'questTitle')] || (quest.id === 'prompt-basics-1' ? t.dashboard.tips.firstSteps : quest.id === 'prompt-basics-2' ? t.dashboard.tips.contextKing : t.dashboard.tips.breakDown)}</p>
                                            <p className="text-sm text-foreground-muted mb-4">{(t.dashboard.tips as any)[quest.id.replace('prompt-basics-', 'questDesc')] || (quest.id === 'prompt-basics-1' ? t.dashboard.tips.firstStepsDesc : quest.id === 'prompt-basics-2' ? t.dashboard.tips.contextKingDesc : t.dashboard.tips.breakDownDesc)}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="badge badge-xp">+100 Bonus XP</div>
                                                <Link href={quest.target}>
                                                    <div className="text-primary text-sm font-bold hover:underline cursor-pointer">
                                                        {theme === 'stranding' ? t.dashboard.quest.enterStorm : t.dashboard.quest.accept}
                                                    </div>
                                                </Link>
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>

                            {/* Vibe Status (Category Progress) */}
                            <motion.div
                                className="glass-card p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Zap size={20} className="text-secondary" />
                                    {t.dashboard.sections.vibeStatus}
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { label: t.categories.prompting, color: '#8b5cf6', category: 'prompting' },
                                        { label: t.categories.debugging, color: '#ef4444', category: 'debugging' },
                                        { label: t.categories.building, color: '#22c55e', category: 'building' },
                                    ].map((cat) => {
                                        const categoryChallenges = CHALLENGES.filter(c => c.category === cat.category);
                                        const completed = categoryChallenges.filter(c => user.completedChallenges.includes(c.id)).length;
                                        const percentage = categoryChallenges.length > 0
                                            ? Math.round((completed / categoryChallenges.length) * 100)
                                            : 0;

                                        return (
                                            <div key={cat.label}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-foreground-muted">{cat.label}</span>
                                                    <span className="font-bold">{percentage}%</span>
                                                </div>
                                                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full"
                                                        style={{ backgroundColor: cat.color }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 1, delay: 0.7 }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Recommended Challenges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{t.dashboard.sections.recommended}</h2>
                                <Link href="/learn" className="text-primary hover:text-secondary transition-colors text-sm">
                                    {t.common.viewAll} →
                                </Link>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recentChallenges.map((challenge: Challenge, index: number) => (
                                    <motion.div
                                        key={challenge.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <ChallengeCard
                                            challenge={challenge}
                                            completed={user.completedChallenges.includes(challenge.id)}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Level Progress */}
                        <motion.div
                            className="glass-card p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{t.dashboard.sections.yourJourney}</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success animate-ping" />
                                    <span className="text-xs text-foreground-muted uppercase tracking-widest font-bold">{t.common.vibePulse}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                {LEVELS.map((level, index) => {
                                    const isUnlocked = user.level >= level.id;
                                    const isCurrent = user.level === level.id;

                                    return (
                                        <div key={level.id} className="flex items-center shrink-0">
                                            <motion.div
                                                className={`flex flex-col items-center min-w-[100px] p-4 rounded-xl transition-all ${isCurrent
                                                    ? 'bg-primary/20 ring-2 ring-primary shadow-lg shadow-primary/20'
                                                    : isUnlocked
                                                        ? 'bg-surface-light border border-surface-light'
                                                        : 'opacity-40 grayscale'
                                                    }`}
                                                whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                                            >
                                                <span className="text-4xl mb-2">{level.icon}</span>
                                                <span className="text-sm font-bold" style={{ color: level.color }}>
                                                    {(t.levels as any)[Object.keys(t.levels)[index]] || level.name}
                                                </span>
                                                {isCurrent && (
                                                    <span className="text-[10px] bg-primary text-background px-2 py-0.5 rounded-full font-bold mt-2 uppercase tracking-tight">{t.common.active}</span>
                                                )}
                                            </motion.div>
                                            {index < LEVELS.length - 1 && (
                                                <div
                                                    className={`w-12 h-1 mx-2 rounded-full ${user.level > level.id ? 'bg-primary' : 'bg-surface-light'
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        {/* Leaderboard */}
                        <Leaderboard entries={leaderboardData.slice(0, 5)} title="Top Vibers" />

                        {/* Recent Achievements */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Trophy className="text-xp" size={20} />
                                    {t.profile.achievements}
                                </h2>
                                <Link href="/profile" className="text-primary text-sm hover:text-secondary">
                                    {t.common.viewAll} →
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {unlockedAchievements.slice(0, 6).map((achievement) => (
                                    <motion.div
                                        key={achievement.id}
                                        className="text-2xl p-2 bg-surface rounded-lg"
                                        title={achievement.name}
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                    >
                                        {achievement.icon}
                                    </motion.div>
                                ))}
                                {unlockedAchievements.length > 6 && (
                                    <div className="text-sm text-foreground-muted flex items-center px-2">
                                        +{unlockedAchievements.length - 6} {t.common.more}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
