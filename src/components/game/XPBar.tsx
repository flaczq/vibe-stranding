'use client';

import { motion } from 'framer-motion';
import { useAuth, getXPForNextLevel } from '@/lib/auth';
import { getLevelInfo, getXPProgress, LEVELS } from '@/lib/game-data';

export function XPBar() {
    const { user } = useAuth();

    if (!user) return null;

    const levelInfo = getLevelInfo(user.level);
    const progress = getXPProgress(user.xp, user.level);
    const isMaxLevel = user.level >= LEVELS.length;

    return (
        <div className="glass-card p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{levelInfo.icon}</span>
                    <div>
                        <p className="font-bold text-foreground">{levelInfo.name}</p>
                        <p className="text-xs text-foreground-muted">Level {user.level}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xp">{user.xp.toLocaleString('en-US')} XP</p>
                    {!isMaxLevel && (
                        <p className="text-xs text-foreground-muted">
                            {progress.current} / {progress.needed} to next level
                        </p>
                    )}
                </div>
            </div>

            <div className="relative h-4 bg-surface rounded-full overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${levelInfo.color}, ${LEVELS[user.level]?.color || levelInfo.color})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: isMaxLevel ? '100%' : `${progress.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>

            {isMaxLevel && (
                <p className="text-center text-xs text-primary mt-2">🎉 Max Level Achieved!</p>
            )}
        </div>
    );
}

export function MiniXPBar() {
    const { user } = useAuth();

    if (!user) return null;

    const levelInfo = getLevelInfo(user.level);
    const progress = getXPProgress(user.xp, user.level);

    return (
        <div className="flex items-center gap-3">
            <span className="text-xl">{levelInfo.icon}</span>
            <div className="flex-1 min-w-[100px]">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground-muted">Lv.{user.level}</span>
                    <span className="text-xp font-semibold">{user.xp} XP</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: levelInfo.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
}
