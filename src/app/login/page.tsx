'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, t } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(identifier, password);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative z-10">
            {/* The global InteractiveBackground is at -z-10 */}

            <motion.div
                className="glass-card p-8 w-full max-w-md glow-primary"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="inline-block text-6xl mb-4"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {user?.avatar || '🎮'}
                    </motion.div>
                    <h1 className="text-3xl font-bold text-glow-primary mb-2">{t.auth.loginTitle}</h1>
                    <p className="text-foreground-muted">{t.auth.loginSubtitle}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder={t.auth.username + " or " + t.auth.email}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="input-game with-icon"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t.auth.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-game with-icon pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            className="text-danger text-sm text-center p-3 bg-danger/10 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Sparkles size={20} />
                                {t.auth.loginBtn}
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-foreground-muted">
                        {t.auth.noAccount}
                        <Link href="/signup" className="text-primary hover:text-secondary transition-colors font-semibold">
                            {t.auth.createAccount}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
