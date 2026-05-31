"use client";

import { Bell, Search, User, Sun, Moon, Globe, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between glass-panel mx-6 mt-4 rounded-3xl border-border relative z-50">
      <div className="flex-1"></div>

      <div className="flex items-center space-x-4 ml-4">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'uz' : 'en')}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-panel border border-border text-muted hover:text-text hover:border-primary/40 transition-all"
          title={language === 'en' ? "O'zbekchaga o'tish" : 'Switch to English'}
        >
          <Globe className="w-4 h-4" />
          <span className="font-bold text-xs uppercase tracking-wider">{language === 'en' ? '🇺🇸 EN' : '🇺🇿 UZ'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-panel border border-border text-muted hover:text-text hover:border-primary/40 transition-all"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>


        {/* User Profile or Sign In */}
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-panel border border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="font-medium text-sm text-text hidden sm:block">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 transition-all"
              title={language === 'uz' ? 'Chiqish' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-primary/20"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:block">{t('nav', 'signIn')}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
