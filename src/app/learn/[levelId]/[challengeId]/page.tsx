'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/ui/Navbar';
import { CHALLENGES, CATEGORY_INFO, ACHIEVEMENTS } from '@/lib/game-data';
import { AchievementPopup } from '@/components/game/AchievementPopup';
import { ArrowLeft, Clock, Lightbulb, CheckCircle, Play, Send, Terminal, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { validateVibe, VibeResult } from '@/lib/vibe-validator';
import { checkChromeAI, promptChromeAI, ChromeAI } from '@/lib/chrome-ai';

// Dynamic import for Monaco Editor (client-side only)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function ChallengePage() {
    const { user, isLoading, completeChallenge, unlockAchievement, addXP, t, theme, language } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [code, setCode] = useState('');
    const [showHint, setShowHint] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);
    const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
    const [chromeAI, setChromeAI] = useState<ChromeAI>({ available: false });
    const [streamingOutput, setStreamingOutput] = useState("");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const challengeId = params?.challengeId as string;
    const challenge = CHALLENGES.find(c => c.id === challengeId);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }

        // Check for local Chrome AI
        checkChromeAI().then(setChromeAI);
    }, [user, isLoading, router]);

    useEffect(() => {
        if (challenge?.starterCode) {
            setCode(challenge.starterCode);
        }
    }, [challenge]);

    // Timer for speed challenges
    useEffect(() => {
        if (challenge?.timeLimit && !completed) {
            setTimeLeft(challenge.timeLimit);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [challenge?.timeLimit, completed]);

    const handleSubmit = async () => {
        if (!challenge || !user || code.trim().length < 5) return;

        setIsSubmitting(true);
        setVibeResult(null);
        setStreamingOutput("");

        // 1. Get Validator result (for scoring/success)
        const result = validateVibe(challenge.id, code);

        // 2. Generate Output (Real AI or Simulator)
        if (chromeAI.available) {
            try {
                // Wrap prompt for better context
                const systemPrompt = `You are a coding assistant in Vibe Stranding. 
                Task: ${challenge.title}. 
                Context: ${challenge.description}. 
                Instructions: ${challenge.instructions}.
                The user prompt is: "${code}"
                Respond with the code or fix requested. If the prompt is invalid, explain why.`;

                await promptChromeAI(systemPrompt, (text) => {
                    setStreamingOutput(text);
                });
            } catch (err) {
                console.error("Chrome AI Error:", err);
                // Fallback to static output
                simulateStreaming(result.output);
            }
        } else {
            // Simulator Mode: Stream the mock output
            await simulateStreaming(result.output);
        }

        setVibeResult(result);

        if (result.success) {
            // Mark as completed
            completeChallenge(challenge.id, challenge.xpReward);
            setCompleted(true);

            // Check for achievements
            const completedCount = user.completedChallenges.length + 1;

            if (completedCount === 1 && !user.achievements.includes('first_challenge')) {
                unlockAchievement('first_challenge');
                addXP(ACHIEVEMENTS.find(a => a.id === 'first_challenge')?.xpBonus || 0);
                setUnlockedAchievement('first_challenge');
            }

            // Speed demon achievement
            if (challenge.timeLimit && timeLeft && timeLeft > 0 && !user.achievements.includes('speed_demon')) {
                unlockAchievement('speed_demon');
                addXP(ACHIEVEMENTS.find(a => a.id === 'speed_demon')?.xpBonus || 0);
                setUnlockedAchievement('speed_demon');
            }
        }

        setIsSubmitting(false);
    };

    const simulateStreaming = async (text: string) => {
        const words = text.split(" ");
        let current = "";
        for (const word of words) {
            current += word + " ";
            setStreamingOutput(current);
            await new Promise(r => setTimeout(r, 30 + Math.random() * 50));
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-4xl animate-pulse">{theme === 'stranding' ? '🌑' : '⚡'}</div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-20 pb-10 px-4 max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">{language === 'pl' ? 'Wyzwanie nie znalezione' : 'Challenge not found'}</h1>
                    <Link href="/learn" className="text-primary">← {language === 'pl' ? 'Powrót do nauki' : 'Back to learning'}</Link>
                </main>
            </div>
        );
    }

    const categoryInfo = CATEGORY_INFO[challenge.category];

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />

            <main className="pt-20 pb-10 px-4 max-w-6xl mx-auto">
                {/* Back button */}
                <Link href="/learn">
                    <motion.div
                        className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground mb-6"
                        whileHover={{ x: -5 }}
                    >
                        <ArrowLeft size={20} />
                        {t.nav.learn}
                    </motion.div>
                </Link>

                {/* English Prompt Warning */}
                <motion.div
                    className="flex items-center gap-3 px-4 py-3 bg-secondary/10 border border-secondary/20 rounded-xl mb-6 text-secondary text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AlertCircle size={18} />
                    <p className="font-medium">{t.challenge.promptWarning}</p>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="glass-card p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                                style={{ background: `${categoryInfo.color}30` }}
                            >
                                {categoryInfo.icon}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{(t.challenges as any)[challenge.id]?.title || challenge.title}</h1>
                                <p style={{ color: categoryInfo.color }}>{(t.categories as any)[challenge.category] || categoryInfo.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Timer */}
                            {timeLeft !== null && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                                    }`}>
                                    <Clock size={20} />
                                    <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
                                </div>
                            )}

                            {/* XP Reward */}
                            <div className="badge badge-xp text-lg">+{challenge.xpReward} XP</div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Instructions Panel */}
                    <motion.div
                        className="glass-card p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Play size={20} className="text-primary" />
                            {t.nav.learn} - {t.appName}
                        </h2>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-foreground text-lg mb-4">
                                {(t.challenges as any)[challenge.id]?.description || challenge.description}
                            </p>
                            <div className="p-4 bg-surface rounded-xl border border-surface-light">
                                <p className="text-foreground-muted whitespace-pre-line">
                                    {(t.challenges as any)[challenge.id]?.instructions || challenge.instructions}
                                </p>
                            </div>
                        </div>

                        {/* Hints */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Lightbulb size={18} className="text-xp" />
                                {language === 'pl' ? 'Wskazówki' : 'Hints'}
                            </h3>
                            <div className="space-y-2">
                                {challenge.hints.map((hint, index) => (
                                    <div key={index}>
                                        <button
                                            onClick={() => setShowHint(showHint === index ? null : index)}
                                            className="w-full text-left px-4 py-2 rounded-lg bg-surface hover:bg-surface-light transition-colors"
                                        >
                                            <span className="text-xp">💡</span> {language === 'pl' ? 'Wskazówka' : 'Hint'} {index + 1}
                                            {showHint === index && (
                                                <motion.p
                                                    className="mt-2 text-foreground-muted text-sm"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                >
                                                    {hint}
                                                </motion.p>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Code Editor Panel */}
                    <motion.div
                        className="flex flex-col gap-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Sparkles size={20} className="text-primary" />
                                    {challenge.category === 'prompting' ? (language === 'pl' ? 'Twój Prompt' : 'Your Prompt') : (language === 'pl' ? 'Twój Kod' : 'Your Code')}
                                </h2>
                                <div className="text-xs text-foreground-muted px-2 py-1 bg-surface-light rounded-md">
                                    {challenge.category === 'prompting' ? (language === 'pl' ? 'Tryb Promptowania' : 'Prompting Mode') : (language === 'pl' ? 'Tryb Kodowania' : 'Coding Mode')}
                                </div>
                            </div>

                            <div className="rounded-xl overflow-hidden border-2 border-surface-light mb-4">
                                <MonacoEditor
                                    height="300px"
                                    defaultLanguage={challenge.category === 'prompting' ? 'markdown' : 'javascript'}
                                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        padding: { top: 16 },
                                        scrollBeyondLastLine: false,
                                        wordWrap: 'on',
                                    }}
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                onClick={handleSubmit}
                                disabled={isSubmitting || completed || code.trim().length < 5}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${completed
                                    ? 'bg-success text-background'
                                    : 'btn-primary'
                                    }`}
                                whileHover={!completed ? { scale: 1.02 } : {}}
                                whileTap={!completed ? { scale: 0.98 } : {}}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>{t.challenge.thinking}</span>
                                    </div>
                                ) : completed ? (
                                    <>
                                        <CheckCircle size={24} />
                                        {t.challenge.success}
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        {t.challenge.submit}
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* AI Feedback & Console */}
                        <AnimatePresence>
                            {vibeResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="space-y-6"
                                >
                                    {/* Feedback Card */}
                                    <div className={`glass-card p-5 border-l-4 ${vibeResult.success ? 'border-success' : 'border-danger'}`}>
                                        <div className="flex items-start gap-3">
                                            {vibeResult.success ?
                                                <Sparkles className="text-success shrink-0" size={24} /> :
                                                <AlertCircle className="text-danger shrink-0" size={24} />
                                            }
                                            <div>
                                                <h3 className={`font-bold mb-1 ${vibeResult.success ? 'text-success' : 'text-danger'}`}>
                                                    {vibeResult.success ? (language === 'pl' ? 'Vibe Check Zaliczony!' : 'Vibe Check Passed!') : (language === 'pl' ? 'Vibe Check Nieudany' : 'Vibe Check Failed')}
                                                </h3>
                                                <p className="text-sm text-foreground-muted">{vibeResult.feedback}</p>

                                                {/* Score meter */}
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span>Vibe Score</span>
                                                        <span>{vibeResult.score}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                                        <motion.div
                                                            className={`h-full ${vibeResult.success ? 'bg-success' : 'bg-danger'}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${vibeResult.score}%` }}
                                                            transition={{ duration: 1 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Console Output */}
                                    <div className="glass-card bg-[#0a0a16] border-surface-light p-0 overflow-hidden">
                                        <div className="bg-surface-light px-4 py-2 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Terminal size={14} className="text-primary" />
                                                <span className="text-xs font-mono uppercase tracking-wider opacity-70">
                                                    {chromeAI.available
                                                        ? (language === 'pl' ? 'Wbudowane AI Chrome' : 'Chrome Built-in AI Output')
                                                        : (language === 'pl' ? 'Lokalny Symulator AI' : 'Local AI Simulator Output')}
                                                </span>
                                            </div>
                                            {chromeAI.available && (
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                                    <span className="text-[10px] text-success font-bold uppercase tracking-tighter">Native LLM Active</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 font-mono text-sm overflow-x-auto min-h-[100px]">
                                            <pre className="text-secondary whitespace-pre-wrap">
                                                <code>{streamingOutput || vibeResult.output}</code>
                                            </pre>
                                        </div>
                                    </div>

                                    <motion.div
                                        className="text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <p className="text-success font-semibold mb-2">
                                            🎉 {language === 'pl' ? `Zdobyłeś ${challenge.xpReward} XP!` : `You've earned ${challenge.xpReward} XP!`}
                                        </p>
                                        <Link
                                            href="/learn"
                                            className="btn-secondary inline-block py-2 px-6"
                                        >
                                            {language === 'pl' ? 'Następne Wyzwanie →' : 'Next Challenge →'}
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>

            {/* Achievement Popup */}
            <AchievementPopup
                achievementId={unlockedAchievement}
                onClose={() => setUnlockedAchievement(null)}
            />
        </div>
    );
}
