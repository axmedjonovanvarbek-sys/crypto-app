"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SESSION_DURATION_MS = 15 * 60 * 1000;
const SESSION_STORAGE_KEY = 'authSession';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

interface AuthSession {
  expiresAt: number;
  rememberMe: boolean;
}

interface AuthContextProps {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  setSession: (user: AuthUser, rememberMe?: boolean) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: true,
  isAdmin: false,
  setSession: () => {},
  updateUser: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setAuthSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);

    if (savedToken && savedUser && savedSession) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const parsedSession = JSON.parse(savedSession);

        if (Date.now() >= parsedSession.expiresAt) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem(SESSION_STORAGE_KEY);
          setLoading(false);
          return;
        }

        setUser({ ...parsedUser, token: savedToken });
        setToken(savedToken);
        setAuthSession(parsedSession);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session || session.rememberMe) return;

    const remainingMs = session.expiresAt - Date.now();

    if (remainingMs <= 0) {
      logout();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [session]);

  const setSession = (nextUser: AuthUser, rememberMe = false) => {
    const nextSession = {
      expiresAt: Date.now() + SESSION_DURATION_MS,
      rememberMe,
    };

    localStorage.setItem('token', nextUser.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setUser(nextUser);
    setToken(nextUser.token);
    setAuthSession(nextSession);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const nextUser = { ...currentUser, ...updates };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setAuthSession(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAdmin: user?.role === 'admin',
      setSession,
      updateUser,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
