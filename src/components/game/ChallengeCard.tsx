'use client';

import { motion } from 'framer-motion';
import { Challenge, CATEGORY_INFO, getLevelInfo } from '@/lib/game-data';
import { Clock, Star, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

interface ChallengeCardProps {
    challenge: Challenge;
    completed?: boolean;
    locked?: boolean;
}

export function ChallengeCard({ challenge, completed = false, locked = false }: ChallengeCardProps) {
    const { t, language } = useAuth();
    const categoryInfo = CATEGORY_INFO[challenge.category];
    const levelInfo = getLevelInfo(challenge.difficulty);
    const categoryName = (t.categories as any)[challenge.category] || categoryInfo.name;
    const localizedChallenge = (t.challenges as any)[challenge.id];
    const title = localizedChallenge?.title || challenge.title;
    const description = localizedChallenge?.description || challenge.description;

    const cardContent = (
        <motion.div
            className={`glass-card p-5 relative overflow-hidden group cursor-pointer ${locked ? 'opacity-50' : ''
                } ${completed ? 'border-success/50' : ''}`}
            whileHover={locked ? {} : { scale: 1.02, y: -5 }}
            whileTap={locked ? {} : { scale: 0.98 }}
        >
            {/* Glow effect on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle at center, ${categoryInfo.color}20, transparent 70%)`,
                }}
            />

            {/* Completed badge */}
            {completed && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Check size={18} className="text-background" />
                </div>
            )}

            {/* Locked overlay */}
            {locked && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                    <span className="text-2xl">🔒</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${categoryInfo.color}30` }}
                >
                    {categoryInfo.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-foreground-muted text-sm line-clamp-2">
                        {description}
                    </p>
                    <p className="text-sm mt-1" style={{ color: categoryInfo.color }}>
                        {categoryName}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Difficulty */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={i < challenge.difficulty ? 'text-xp fill-xp' : 'text-surface-light'}
                            />
                        ))}
                    </div>

                    {/* Time limit */}
                    {challenge.timeLimit && (
                        <div className="flex items-center gap-1 text-warning">
                            <Clock size={14} />
                            <span className="text-xs">{Math.floor(challenge.timeLimit / 60)}m</span>
                        </div>
                    )}
                </div>

                {/* XP Reward */}
                <div className="flex items-center gap-2">
                    <span className="badge badge-xp">+{challenge.xpReward} XP</span>
                    <ChevronRight size={18} className="text-foreground-muted group-hover:text-primary transition-colors" />
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
                {challenge.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-surface-light text-foreground-muted"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
        </motion.div>
    );

    if (locked) {
        return cardContent;
    }

    return (
        <Link href={`/learn/${challenge.difficulty}/${challenge.id}`}>
            {cardContent}
        </Link>
    );
}
