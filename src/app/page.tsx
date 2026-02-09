'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Zap, Users, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user, isLoading, t, theme, setTheme, language, setLanguage } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const strandingEmojis = ['🕸️', '💀', '🧛', '👹', '👺', '🛸', '🌪️', '🌑', '🕳️', '🕯️', '🦇', '👻', '🎭', '📿', '🗝️', '🗡️'];
  const defaultEmojis = ['💻', '🚀', '✨', '🎮', '⚡', '🔮', '🎯', '💡', '🏆', '🔥', '🌟', '🤖', '🧩', '🎬', '🎹', '🎨'];
  const activeEmojis = theme === 'stranding' ? strandingEmojis : defaultEmojis;

  useEffect(() => {
    setMounted(true);
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const features = [
    {
      icon: BookOpen,
      title: t.home.features.learn.title,
      description: t.home.features.learn.desc,
      color: '#8b5cf6',
    },
    {
      icon: Trophy,
      title: t.home.features.compete.title,
      description: t.home.features.compete.desc,
      color: '#f59e0b',
    },
    {
      icon: Zap,
      title: t.home.features.speed.title,
      description: t.home.features.speed.desc,
      color: '#06b6d4',
    },
    {
      icon: Users,
      title: t.home.features.community.title,
      description: t.home.features.community.desc,
      color: '#22c55e',
    },
  ];

  const levels = [
    { icon: '🌱', name: t.home.levels.sprout.name, desc: t.home.levels.sprout.desc },
    { icon: '🌿', name: t.home.levels.apprentice.name, desc: t.home.levels.apprentice.desc },
    { icon: '🌳', name: t.home.levels.developer.name, desc: t.home.levels.developer.desc },
    { icon: '⚡', name: t.home.levels.expert.name, desc: t.home.levels.expert.desc },
    { icon: '🔮', name: t.home.levels.master.name, desc: t.home.levels.master.desc },
  ];

  return (
    <div className="min-h-screen gradient-animated overflow-hidden">
      {/* Floating elements */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-10"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 13) % 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + (i % 10),
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {activeEmojis[i % activeEmojis.length]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{theme === 'stranding' ? '🕸️' : '🎮'}</span>
          <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t.appName}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-surface-light rounded-full p-1 shadow-lg border border-surface-light">
            <button
              onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
              className="px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-surface flex items-center gap-1.5"
            >
              <span className="text-primary">🌐</span>
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
              {theme === 'stranding' ? '💀' : theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>

          <Link
            href="/login"
            className="px-5 py-2 text-foreground-muted hover:text-foreground transition-colors font-medium"
          >
            {t.hero.login}
          </Link>
          <Link href="/signup">
            <motion.div
              className="btn-primary cursor-pointer inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.hero.cta}
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block text-7xl mb-6"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {theme === 'stranding' ? '🌑' : '🎮'}
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t.hero.title}
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Vibe Coding
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground-muted mb-10 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <motion.div
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.hero.cta}
                <ArrowRight size={20} />
              </motion.div>
            </Link>
            <Link href="/login">
              <motion.div
                className="btn-secondary text-lg px-8 py-4 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.hero.login}
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: '🌱', label: 'Growing Community' },
            { value: '500+', label: 'Challenges' },
            { value: '100%', label: 'Free to Play' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-foreground-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why {t.appName}?
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `${feature.color}20` }}
              >
                <feature.icon size={32} style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-foreground-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Levels Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Your Learning Journey
        </motion.h2>
        <motion.p
          className="text-foreground-muted text-center mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Progress through 5 levels of mastery
        </motion.p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {levels.map((level, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 text-center min-w-[180px]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <div className="text-5xl mb-3">{level.icon}</div>
              <h3 className="font-bold text-lg mb-1">{level.name}</h3>
              <p className="text-sm text-foreground-muted">{level.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div
          className="glass-card p-10 text-center glow-primary"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'pl' ? `Gotowy odkryć ${t.appName}?` : `Ready to Explore ${t.appName}?`}
          </h2>
          <p className="text-foreground-muted text-lg mb-8">
            {language === 'pl'
              ? 'Dołącz do naszej rosnącej społeczności i ucz się przyszłości AI. Całkowicie za darmo!'
              : 'Join our growing community and learn the future of AI. Completely free to playground and enjoy!'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {['No credit card required', 'Free starter tier', 'Instant access'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-success">
                <CheckCircle size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link href="/signup">
            <motion.div
              className="btn-primary text-xl px-10 py-5 flex items-center gap-3 mx-auto cursor-pointer max-w-max"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.auth.createAccount}
              <ArrowRight size={24} />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-light py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-lg">{t.appName}</span>
          </div>
          <p className="text-foreground-muted text-sm">
            © 2026 {t.appName}. {language === 'pl' ? 'Odkrywaj i ucz się przyszłości AI.' : 'Enjoy and learn the future of AI.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
