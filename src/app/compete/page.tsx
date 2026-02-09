'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/ui/Navbar';
import { CHALLENGES, CATEGORY_INFO } from '@/lib/game-data';
import { Swords, Clock, Trophy, Zap, Users, Play } from 'lucide-react';
import Link from 'next/link';

export default function CompetePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'solo' | 'versus'>('solo');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-4xl animate-pulse">⚔️</div>
            </div>
        );
    }

    const speedChallenges = CHALLENGES.filter(c => c.category === 'speed' && c.difficulty <= user.level);

    // Mock active competitions
    const activeCompetitions = [
        {
            id: '1',
            title: 'Weekly Sprint',
            description: 'Complete as many challenges as possible in 1 hour',
            participants: 234,
            endsIn: '2d 14h',
            prize: '500 XP + Speed Demon Badge',
            type: 'solo'
        },
        {
            id: '2',
            title: 'Code Golf Challenge',
            description: 'Write the shortest working solution',
            participants: 89,
            endsIn: '5d 3h',
            prize: '300 XP + Minimalist Badge',
            type: 'versus'
        },
        {
            id: '3',
            title: 'Prompt Master Tournament',
            description: 'Craft the most effective AI prompts',
            participants: 156,
            endsIn: '1d 8h',
            prize: '750 XP + Legendary Prompter Badge',
            type: 'versus'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
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
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ⚔️
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Competition Arena
                    </h1>
                    <p className="text-foreground-muted text-lg">
                        Test your skills against others and climb the ranks
                    </p>
                </motion.div>

                {/* Tab Switcher */}
                <motion.div
                    className="flex justify-center gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={() => setActiveTab('solo')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'solo'
                                ? 'bg-primary text-white glow-primary'
                                : 'bg-surface text-foreground-muted hover:bg-surface-light'
                            }`}
                    >
                        <Clock size={20} />
                        Timed Solo
                    </button>
                    <button
                        onClick={() => setActiveTab('versus')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'versus'
                                ? 'bg-secondary text-white glow-secondary'
                                : 'bg-surface text-foreground-muted hover:bg-surface-light'
                            }`}
                    >
                        <Users size={20} />
                        Head-to-Head
                    </button>
                </motion.div>

                {/* Active Competitions */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Trophy className="text-xp" />
                        Active Competitions
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeCompetitions
                            .filter(c => activeTab === 'solo' ? c.type === 'solo' : c.type === 'versus')
                            .map((competition, index) => (
                                <motion.div
                                    key={competition.id}
                                    className="glass-card p-6 group hover:glow-primary transition-all cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                            {competition.title}
                                        </h3>
                                        <span className="text-warning text-sm font-semibold">
                                            ⏰ {competition.endsIn}
                                        </span>
                                    </div>

                                    <p className="text-foreground-muted mb-4">{competition.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-foreground-muted">
                                            <Users size={16} />
                                            <span className="text-sm">{competition.participants} competing</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-xp/10 rounded-lg mb-4">
                                        <p className="text-sm text-xp font-semibold">🏆 {competition.prize}</p>
                                    </div>

                                    <button className="w-full btn-primary flex items-center justify-center gap-2">
                                        <Play size={18} />
                                        Join Competition
                                    </button>
                                </motion.div>
                            ))}
                    </div>
                </motion.div>

                {/* Speed Challenges Section */}
                {activeTab === 'solo' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Zap className="text-warning" />
                            Speed Challenges
                        </h2>
                        <p className="text-foreground-muted mb-6">
                            Race against the clock! Complete these challenges as fast as possible.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {speedChallenges.length > 0 ? (
                                speedChallenges.map((challenge, index) => {
                                    const categoryInfo = CATEGORY_INFO[challenge.category];
                                    return (
                                        <motion.div
                                            key={challenge.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <Link href={`/learn/${challenge.difficulty}/${challenge.id}`}>
                                                <motion.div
                                                    className="glass-card p-5 group cursor-pointer"
                                                    whileHover={{ scale: 1.02, y: -5 }}
                                                >
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div
                                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                                            style={{ background: `${categoryInfo.color}30` }}
                                                        >
                                                            ⚡
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold group-hover:text-warning transition-colors">
                                                                {challenge.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-warning">
                                                                <Clock size={14} />
                                                                {challenge.timeLimit ? `${Math.floor(challenge.timeLimit / 60)} min` : '5 min'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-foreground-muted text-sm mb-3 line-clamp-2">
                                                        {challenge.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="badge badge-xp">+{challenge.xpReward} XP</span>
                                                        <span className="text-primary text-sm">Start →</span>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full glass-card p-8 text-center">
                                    <p className="text-foreground-muted">
                                        Level up to unlock speed challenges! 🚀
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* VS Mode Placeholder */}
                {activeTab === 'versus' && (
                    <motion.div
                        className="glass-card p-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Swords size={64} className="mx-auto text-secondary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Head-to-Head Mode</h3>
                        <p className="text-foreground-muted mb-4">
                            Challenge other players to real-time coding battles!
                        </p>
                        <p className="text-sm text-foreground-muted">
                            Join an active competition above to compete against others.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
