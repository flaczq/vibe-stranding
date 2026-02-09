'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { registerUser, updateXpProgress } from './actions';
import { Language, translations } from './i18n';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  achievements: string[];
  completedChallenges: string[];
  currentStreak: number;
  longestStreak: number;
  joinedAt: string;
  lastActiveAt: string;
  role: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  theme: 'light' | 'dark' | 'stranding';
  language: Language;
  t: any;
  setTheme: (theme: 'light' | 'dark' | 'stranding') => void;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string, avatar: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateAvatar: (avatar: string) => Promise<{ success: boolean; error?: string }>;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeChallenge: (challengeId: string, xpEarned: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AVATARS = [
  '🦊', '🐱', '🐶', '🦁', '🐼', '🐨', '🐸', '🦄', '🐲', '🤖', '👾', '🎮',
  // Stranding Collection
  '🕸️', '💀', '🧛', '👹', '👺', '🛸', '🌪️', '🌑', '🕳️', '🕯️', '🦇'
];

export const calculateLevel = (xp: number): number => {
  if (xp >= 7000) return 5;
  if (xp >= 3500) return 4;
  if (xp >= 1500) return 3;
  if (xp >= 500) return 2;
  return 1;
};

export const getXPForNextLevel = (level: number): number => {
  const thresholds = [0, 500, 1500, 3500, 7000, Infinity];
  return thresholds[level] || Infinity;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const isLoading = status === "loading";
  const [theme, setThemeState] = React.useState<'light' | 'dark' | 'stranding'>('stranding');
  const [language, setLangState] = React.useState<Language>('en');

  // Load settings
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('vibe-theme') as 'light' | 'dark';
    const savedLang = localStorage.getItem('vibe-lang') as Language;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (savedLang) setLangState(savedLang);
  }, []);

  const setTheme = (newTheme: 'light' | 'dark' | 'stranding') => {
    setThemeState(newTheme);
    localStorage.setItem('vibe-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('vibe-lang', newLang);
  };

  const t = translations[language];

  const user = useMemo(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id,
      username: session.user.name || "Viber",
      email: session.user.email,
      avatar: session.user.avatar || session.user.image || "🦊",
      xp: session.user.xp || 0,
      level: session.user.level || 1,
      role: session.user.role || "USER",
      achievements: session.user.achievements || [],
      completedChallenges: session.user.completedChallenges || [],
      currentStreak: session.user.currentStreak || 0,
      longestStreak: 0,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    } as User;
  }, [session]);

  const login = async (identifier: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        let errorMsg = language === 'pl' ? 'Nieprawidłowe dane logowania' : 'Invalid email or password';
        if (result.error === 'CredentialsSignin') {
          errorMsg = language === 'pl' ? 'Nieprawidłowy e-mail lub hasło' : 'Invalid email or password';
        }
        return { success: false, error: errorMsg };
      }

      // Force a hard reload to the dashboard on success
      if (typeof window !== 'undefined') {
        window.location.href = "/dashboard";
      }
      return { success: true };
    } catch (error: any) {
      console.error("Login exception:", error);
      return { success: false, error: error.message || (language === 'pl' ? 'Wystąpił nieoczekiwany błąd' : 'An unexpected error occurred') };
    }
  };

  const signup = async (username: string, email: string, password: string, avatar: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar);

    const result = await registerUser(formData);

    if ('error' in result) {
      return { success: false, error: result.error };
    }

    return await login(email, password);
  };

  const logout = () => signOut({ callbackUrl: "/" });

  const updateUser = async (updates: Partial<User>) => {
    // This would typically be a server action to update DB
    // For now, we'll use the session update
    await update(updates);
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    // For production, XP updates should happen via challenge completion server actions
    // but if we need a manual add:
    // await updateXpProgress(user.id, amount, 'manual-add');
    await update(); // Trigger session refresh
  };

  const updateAvatar = async (avatar: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const { updateUserAvatar } = await import('./actions');
    const result = await updateUserAvatar(user.id, avatar);

    if (result.success) {
      await update({ image: avatar });
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const unlockAchievement = async (achievementId: string) => {
    // TODO: Implement server action
  };

  const completeChallenge = async (challengeId: string, xpEarned: number) => {
    if (!user) return;
    const result = await updateXpProgress(user.id, xpEarned, challengeId);
    if (result.success) {
      await update(); // Refresh session data
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        theme,
        language,
        t,
        setTheme,
        setLanguage,
        login,
        signup,
        logout,
        updateUser,
        updateAvatar,
        addXP,
        unlockAchievement,
        completeChallenge,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
