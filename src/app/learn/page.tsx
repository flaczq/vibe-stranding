'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/ui/Navbar';
import { ChallengeCard } from '@/components/game/ChallengeCard';
import { LEVELS, CHALLENGES, getChallengesByLevel, getLevelInfo } from '@/lib/game-data';
import { Lock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LearnPage() {
    const { user, isLoading, theme, t, language } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-4xl animate-pulse">{theme === 'stranding' ? '🌑' : '📚'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />

            <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {theme === 'stranding' ? t.nav.network : (language === 'pl' ? 'Ścieżka Nauki 📚' : 'Learning Path 📚')}
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        {theme === 'stranding'
                            ? (language === 'pl' ? 'Połącz ponownie sieć i opanuj przyszłość AI' : 'Re-connect the network and master the future of AI')
                            : (language === 'pl' ? 'Mistrzostwo w vibe codingu od podstaw do zaawansowanych technik' : 'Master vibe coding from the basics to advanced techniques')}
                    </p>
                </motion.div>

                {/* Level sections */}
                <div className="space-y-10">
                    {LEVELS.map((level, levelIndex) => {
                        const isUnlocked = user.level >= level.id;
                        const challenges = getChallengesByLevel(level.id);
                        const completedCount = challenges.filter(c =>
                            user.completedChallenges.includes(c.id)
                        ).length;

                        return (
                            <motion.section
                                key={level.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: levelIndex * 0.1 }}
                            >
                                {/* Level Header */}
                                <div className={`glass-card p-6 mb-4 ${!isUnlocked ? 'opacity-60' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                                                style={{
                                                    background: `linear-gradient(135deg, ${level.color}30, ${level.color}10)`,
                                                    border: `2px solid ${level.color}50`
                                                }}
                                            >
                                                {level.icon}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2
                                                        className="text-2xl font-bold"
                                                        style={{ color: level.color }}
                                                    >
                                                        {language === 'pl' ? 'Poziom' : 'Level'} {level.id}: {(t.levels as any)[Object.keys(t.levels)[level.id - 1]] || level.name}
                                                    </h2>
                                                    {!isUnlocked && <Lock size={20} className="text-foreground-muted" />}
                                                </div>
                                                <p className="text-foreground-muted">{level.description}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-foreground-muted text-sm">{language === 'pl' ? 'Postęp' : 'Progress'}</p>
                                            <p className="text-xl font-bold" style={{ color: level.color }}>
                                                {isUnlocked ? `${completedCount}/${challenges.length}` : '🔒'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    {isUnlocked && (
                                        <div className="mt-4 relative">
                                            <div className="h-2 bg-surface rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ background: level.color }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                />
                                                <div className="progress-shine absolute top-0 left-0 w-full h-full" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Challenges Grid */}
                                {isUnlocked ? (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {challenges.map((challenge, index) => (
                                            <motion.div
                                                key={challenge.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                            >
                                                <ChallengeCard
                                                    challenge={challenge}
                                                    completed={user.completedChallenges.includes(challenge.id)}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass-card p-8 text-center">
                                        <Lock size={48} className="mx-auto text-foreground-muted mb-4" />
                                        <p className="text-foreground-muted mb-2">
                                            {language === 'pl'
                                                ? `Osiągnij poziom ${level.name}, aby odblokować te wyzwania`
                                                : `Reach ${level.name} to unlock these challenges`}
                                        </p>
                                        <p className="text-sm text-foreground-muted">
                                            {language === 'pl' ? 'Wymaga' : 'Requires'} {level.xpRequired.toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US')} XP
                                        </p>
                                    </div>
                                )}
                            </motion.section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
