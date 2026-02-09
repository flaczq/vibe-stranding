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
  const isLoadingSession = status === "loading";
  const [theme, setThemeState] = React.useState<'light' | 'dark' | 'stranding'>('dark');
  const [language, setLangState] = React.useState<Language>('en');
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = React.useState(false);

  // Load profile data when session changes
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        setIsProfileLoading(true);
        try {
          const { getUserProfile } = await import('./actions');
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  // Load settings
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('vibe-theme') as 'light' | 'dark' | 'stranding';
    const savedLang = localStorage.getItem('vibe-lang') as Language;
    if (savedTheme) {
      setThemeState(savedTheme);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
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

    // Combine session data with separately fetched profile data
    const basicUser = {
      id: session.user.id,
      username: session.user.name || "Viber",
      email: session.user.email,
      role: session.user.role || "USER",
    };

    if (!userProfile) {
      return {
        ...basicUser,
        avatar: "🦊",
        xp: 0,
        level: 1,
        achievements: [],
        completedChallenges: [],
        currentStreak: 0,
        longestStreak: 0,
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      } as User;
    }

    return {
      ...basicUser,
      username: userProfile.username || basicUser.username,
      avatar: userProfile.avatar || "🦊",
      xp: userProfile.xp || 0,
      level: userProfile.level || 1,
      achievements: userProfile.achievements || [],
      completedChallenges: userProfile.completedChallenges || [],
      currentStreak: userProfile.currentStreak || 0,
      longestStreak: 0,
      joinedAt: userProfile.joinedAt || new Date().toISOString(),
      lastActiveAt: userProfile.lastActiveAt || new Date().toISOString(),
    } as User;
  }, [session, userProfile]);

  const isLoading = isLoadingSession || (!!session?.user && !userProfile && isProfileLoading);

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
    // Avoid using update(updates) to prevent cookie bloat
    // In a real app, this should call a server action to update the DB
    // then refresh the local userProfile state.
    if (session?.user?.id) {
      const { getUserProfile } = await import('./actions');
      const updatedProfile = await getUserProfile(session.user.id);
      if (updatedProfile) setUserProfile(updatedProfile);
    }
  };

  const addXP = async (amount: number) => {
    if (!session?.user?.id) return;
    // XP updates are now managed via server actions plus local profile refresh
    // to keep the session cookie lean and avoid 494 errors
    const { getUserProfile } = await import('./actions');
    const updatedProfile = await getUserProfile(session.user.id);
    if (updatedProfile) setUserProfile(updatedProfile);
  };

  const updateAvatar = async (newAvatar: string) => {
    if (!session?.user?.id) return { success: false, error: 'Not authenticated' };

    const { updateUserAvatar, getUserProfile } = await import('./actions');
    const result = await updateUserAvatar(session.user.id, newAvatar);

    if (result.success) {
      // Refresh local profile state immediately
      const updatedProfile = await getUserProfile(session.user.id);
      if (updatedProfile) setUserProfile(updatedProfile);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const unlockAchievement = async (achievementId: string) => {
    // TODO: Implement server action
  };

  const completeChallenge = async (challengeId: string, xpEarned: number) => {
    if (!session?.user?.id) return;
    const { updateXpProgress, getUserProfile } = await import('./actions');
    const result = await updateXpProgress(session.user.id, xpEarned, challengeId);
    if (result.success) {
      // Refresh local profile state immediately
      const updatedProfile = await getUserProfile(session.user.id);
      if (updatedProfile) setUserProfile(updatedProfile);
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
