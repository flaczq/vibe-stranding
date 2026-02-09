'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    username: string;
    avatar: string;
    xp: number;
    level: number;
}

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    currentUserId?: string;
    title?: string;
}

export function Leaderboard({ entries, title = 'Leaderboard' }: LeaderboardProps) {
    const topThree = entries.slice(0, 3);
    const others = entries.slice(3);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="text-yellow-400" size={24} />;
            case 2:
                return <Medal className="text-gray-300" size={24} />;
            case 3:
                return <Award className="text-amber-600" size={24} />;
            default:
                return <span className="text-foreground-muted font-bold w-6 text-center">{rank}</span>;
        }
    };

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return 'border-yellow-400/50 bg-yellow-400/10 shadow-lg shadow-yellow-400/5';
            case 2: return 'border-gray-300/50 bg-gray-300/10';
            case 3: return 'border-amber-600/50 bg-amber-600/10';
            default: return 'border-surface-light hover:border-primary/30';
        }
    };

    return (
        <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-xp" size={24} />
                {title}
            </h2>

            {/* Podium Section */}
            <div className="flex items-end justify-center gap-2 mb-8 mt-4">
                {/* 2nd Place */}
                {topThree[1] && (
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-3xl mb-1">{topThree[1].avatar}</div>
                        <div className="w-16 h-20 bg-gray-300/20 border-t-2 border-gray-300/50 rounded-t-lg flex flex-col items-center justify-start pt-2">
                            <span className="font-bold text-gray-300">2</span>
                            <Medal size={16} className="text-gray-300" />
                        </div>
                        <p className="text-[10px] font-bold mt-1 truncate w-16 text-center">{topThree[1].username}</p>
                    </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <motion.div
                            className="text-4xl mb-1"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            👑
                        </motion.div>
                        <div className="text-3xl mb-1">{topThree[0].avatar}</div>
                        <div className="w-20 h-28 bg-yellow-400/20 border-t-4 border-yellow-400 rounded-t-lg flex flex-col items-center justify-start pt-2 shadow-lg shadow-yellow-400/10">
                            <span className="font-bold text-yellow-400 text-xl">1</span>
                            <Trophy size={20} className="text-yellow-400" />
                        </div>
                        <p className="text-xs font-bold mt-1 truncate w-20 text-center text-primary">{topThree[0].username}</p>
                    </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="text-3xl mb-1">{topThree[2].avatar}</div>
                        <div className="w-16 h-16 bg-amber-600/20 border-t-2 border-amber-600/50 rounded-t-lg flex flex-col items-center justify-start pt-2">
                            <span className="font-bold text-amber-600">3</span>
                            <Award size={16} className="text-amber-600" />
                        </div>
                        <p className="text-[10px] font-bold mt-1 truncate w-16 text-center">{topThree[2].username}</p>
                    </motion.div>
                )}
            </div>

            <div className="space-y-3">
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.username}
                        className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${getRankStyle(entry.rank)}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.4 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                    >
                        {/* Rank */}
                        <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>

                        {/* Avatar */}
                        <div className="text-2xl">{entry.avatar}</div>

                        {/* Username & Level */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{entry.username}</p>
                            <p className="text-[10px] text-foreground-muted uppercase tracking-wider">Level {entry.level}</p>
                        </div>

                        {/* XP */}
                        <div className="text-right">
                            <p className="font-bold text-xp text-sm">{entry.xp.toLocaleString('en-US')}</p>
                            <p className="text-[10px] text-foreground-muted uppercase">XP</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Mock data generator
export function generateMockLeaderboard(): LeaderboardEntry[] {
    const mockUsers = [
        { username: 'CodeMaster', avatar: '🦊', xp: 8500, level: 5 },
        { username: 'VibeQueen', avatar: '👸', xp: 7200, level: 5 },
        { username: 'PromptWizard', avatar: '🧙', xp: 5800, level: 4 },
        { username: 'AIWhisperer', avatar: '🤖', xp: 4200, level: 4 },
        { username: 'BugSlayer', avatar: '🐛', xp: 3100, level: 3 },
        { username: 'NightCoder', avatar: '🦉', xp: 2800, level: 3 },
        { username: 'SpeedRunner', avatar: '⚡', xp: 2200, level: 2 },
        { username: 'NewVibe', avatar: '🌱', xp: 800, level: 2 },
    ];

    return mockUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
    }));
}
