'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, ACHIEVEMENTS } from '@/lib/game-data';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';

interface AchievementPopupProps {
    achievementId: string | null;
    onClose: () => void;
}

export function AchievementPopup({ achievementId, onClose }: AchievementPopupProps) {
    const { t } = useAuth();
    const [achievement, setAchievement] = useState<Achievement | null>(null);

    useEffect(() => {
        if (achievementId) {
            const found = ACHIEVEMENTS.find((a) => a.id === achievementId);
            setAchievement(found || null);
        } else {
            setAchievement(null);
        }
    }, [achievementId]);

    return (
        <AnimatePresence>
            {achievement && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Popup */}
                    <motion.div
                        className="relative glass-card p-8 max-w-sm w-full text-center glow-primary"
                        initial={{ scale: 0.5, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: 50 }}
                        transition={{ type: 'spring', damping: 15 }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Confetti effect */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                            🎉
                        </div>

                        {/* Achievement icon */}
                        <motion.div
                            className="text-7xl mb-4"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                        >
                            {achievement.icon}
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="text-2xl font-bold text-glow-primary mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {t.common.unlocked}
                        </motion.h2>

                        {/* Achievement name */}
                        <motion.p
                            className="text-xl text-primary font-semibold mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {achievement.name}
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            className="text-foreground-muted mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {achievement.description}
                        </motion.p>

                        {/* XP Bonus */}
                        {achievement.xpBonus > 0 && (
                            <motion.div
                                className="badge badge-xp text-lg"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, type: 'spring' }}
                            >
                                +{achievement.xpBonus} XP
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Simple achievement card for lists
export function AchievementCard({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
    const { t } = useAuth();
    return (
        <div
            className={`glass-card p-4 flex items-center gap-4 transition-all duration-300 ${unlocked ? 'opacity-100' : 'opacity-50 grayscale'
                }`}
        >
            <div className={`text-4xl ${unlocked ? '' : 'blur-sm'}`}>
                {achievement.secret && !unlocked ? '❓' : achievement.icon}
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-foreground">
                    {achievement.secret && !unlocked ? '???' : achievement.name}
                </h3>
                <p className="text-sm text-foreground-muted">
                    {achievement.secret && !unlocked ? t.common.secretInfo : achievement.description}
                </p>
            </div>
            {unlocked && achievement.xpBonus > 0 && (
                <span className="badge badge-xp">+{achievement.xpBonus} XP</span>
            )}
            {unlocked && (
                <span className="text-success text-xl">✓</span>
            )}
        </div>
    );
}
