'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Swords, Trophy, User, LogOut, Menu, X, Sun, Moon, Globe, Skull } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { MiniXPBar } from '@/components/game/XPBar';
import { Avatar } from '@/components/ui/Avatar';
import { useState, useEffect } from 'react';

export function Navbar() {
    const { user, logout, theme, setTheme, language, setLanguage, t } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { href: '/dashboard', icon: Home, label: t.nav.dashboard },
        { href: '/learn', icon: BookOpen, label: t.nav.learn },
        { href: '/compete', icon: Swords, label: t.nav.compete },
        { href: '/leaderboard', icon: Trophy, label: t.nav.leaderboard },
        { href: '/profile', icon: User, label: t.nav.profile },
    ];

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 glass-card rounded-none border-t-0 border-x-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl">🎮</span>
                        <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {t.appName}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                                            ? 'bg-primary/20 text-primary'
                                            : 'text-foreground-muted hover:text-foreground hover:bg-surface-light'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <item.icon size={18} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side - XP & User */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center bg-surface-light rounded-full p-1">
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:bg-surface"
                            >
                                <Globe size={14} className="text-primary" />
                                {language.toUpperCase()}
                            </button>
                            <div className="w-[1px] h-4 bg-surface mx-1" />
                            <button
                                onClick={() => {
                                    const themes: ('stranding' | 'dark' | 'light')[] = ['stranding', 'dark', 'light'];
                                    const currentIndex = themes.indexOf(theme);
                                    const nextIndex = (currentIndex + 1) % themes.length;
                                    setTheme(themes[nextIndex]);
                                }}
                                className="p-1.5 rounded-full hover:bg-surface transition-colors"
                            >
                                {!mounted ? <Sun size={16} /> : (theme === 'stranding' ? <Skull size={16} className="text-primary" /> : theme === 'dark' ? <Moon size={16} className="text-xp" /> : <Sun size={16} className="text-primary" />)}
                            </button>
                        </div>

                        <MiniXPBar />
                        <div className="flex items-center gap-2">
                            <Avatar src={user.avatar} alt={user.username} size="sm" />
                            <span className="font-medium text-sm">{user.username}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-foreground-muted hover:text-danger transition-colors"
                            title={t.nav.logout}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-foreground-muted"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <motion.div
                    className="md:hidden glass-card border-t-0 rounded-t-none"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <div className="px-4 py-4 space-y-2">
                        {/* User info */}
                        <div className="flex items-center gap-3 pb-3 border-b border-surface-light">
                            <Avatar src={user.avatar} alt={user.username} size="lg" border />
                            <div>
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-sm text-xp">{user.xp} XP</p>
                            </div>
                        </div>

                        {/* Settings toggles */}
                        <div className="flex items-center justify-between p-2 bg-surface-light rounded-xl">
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-surface"
                            >
                                <Globe size={16} className="text-primary" />
                                {language === 'en' ? 'Polski' : 'English'}
                            </button>
                            <button
                                onClick={() => {
                                    const themes: ('stranding' | 'dark' | 'light')[] = ['stranding', 'dark', 'light'];
                                    const currentIndex = themes.indexOf(theme);
                                    const nextIndex = (currentIndex + 1) % themes.length;
                                    setTheme(themes[nextIndex]);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-surface min-w-[130px]"
                            >
                                {theme === 'stranding' ? (
                                    <>
                                        <Skull size={16} className="text-primary" />
                                        Stranding
                                    </>
                                ) : theme === 'dark' ? (
                                    <>
                                        <Moon size={16} className="text-xp" />
                                        {language === 'pl' ? 'Ciemny' : 'Dark'}
                                    </>
                                ) : (
                                    <>
                                        <Sun size={16} className="text-primary" />
                                        {language === 'pl' ? 'Jasny' : 'Light'}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Nav items */}
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive
                                            ? 'bg-primary/20 text-primary'
                                            : 'text-foreground-muted hover:bg-surface-light'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Logout */}
                        <button
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-danger/10 w-full"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">{t.nav.logout}</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
