'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Rocket } from 'lucide-react';
import { useAuth, AVATARS } from '@/lib/auth';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(AVATARS[0]);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup, user, t, language } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const getPasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const strengthColors = ['#ef4444', '#f59e0b', '#22c55e', '#10b981'];
    const strengthLabels = language === 'pl'
        ? ['Słabe', 'Niezłe', 'Dobre', 'Silne']
        : ['Weak', 'Fair', 'Good', 'Strong'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(language === 'pl' ? 'Hasła nie pasują' : 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError(language === 'pl' ? 'Hasło musi mieć co najmniej 6 znaków' : 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const result = await signup(username, email, password, avatar);

        if (result.success) {
            // Use window.location.href for a full reload to ensure session is picked up
            window.location.href = '/dashboard';
        } else {
            setError(result.error || (language === 'pl' ? 'Rejestracja nieudana' : 'Signup failed'));
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative z-10">
            {/* The global InteractiveBackground is at -z-10 */}

            <motion.div
                className="glass-card p-8 w-full max-w-md glow-secondary"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <motion.div
                        className="inline-block text-6xl mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {avatar}
                    </motion.div>
                    <h1 className="text-3xl font-bold text-glow-secondary mb-2">{t.auth.signupTitle}</h1>
                    <p className="text-foreground-muted">{t.auth.signupSubtitle}</p>
                </div>

                {/* Avatar Selection */}
                <div className="mb-6">
                    <p className="text-sm text-foreground-muted mb-3 text-center">{language === 'pl' ? 'Wybierz swój awatar' : 'Choose your avatar'}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {AVATARS.map((av) => (
                            <motion.button
                                key={av}
                                type="button"
                                onClick={() => setAvatar(av)}
                                className={`text-3xl p-2 rounded-xl transition-all ${avatar === av
                                    ? 'bg-primary/30 ring-2 ring-primary'
                                    : 'bg-surface hover:bg-surface-light'
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {av}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder={t.auth.username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-game with-icon"
                            required
                            minLength={3}
                            maxLength={20}
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="email"
                            placeholder={t.auth.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Password strength */}
                    {password && (
                        <div className="space-y-2">
                            <div className="flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-1 flex-1 rounded-full transition-all duration-300"
                                        style={{
                                            backgroundColor: i < passwordStrength ? strengthColors[passwordStrength - 1] : 'var(--surface-light)',
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-center" style={{ color: strengthColors[passwordStrength - 1] || 'var(--danger)' }}>
                                {password.length > 0 && (passwordStrength === 0 ? (language === 'pl' ? 'Zbyt słabe' : 'Too weak') : strengthLabels[passwordStrength - 1])}
                            </p>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t.auth.confirmPassword}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`input-game with-icon ${confirmPassword && password !== confirmPassword ? 'border-danger' : ''
                                }`}
                            required
                        />
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
                                <Rocket size={20} />
                                {t.auth.signupBtn}
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-foreground-muted">
                        {t.auth.hasAccount}
                        <Link href="/login" className="text-secondary hover:text-primary transition-colors font-semibold">
                            {t.auth.reconnect}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
