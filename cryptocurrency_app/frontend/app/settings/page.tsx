"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sun, Moon, Globe, Shield, Bell, Palette, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const isUz = language === 'uz';

  return (
    <div className="space-y-8 pb-12 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">
          {isUz ? 'Sozlamalar' : 'Settings'}
        </h1>
        <p className="text-muted">
          {isUz ? 'Ilovangizni o\'zingizga moslang.' : 'Customize your experience.'}
        </p>
      </div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <h2 className="text-lg font-bold text-text flex items-center mb-6">
          <Palette className="w-5 h-5 mr-3 text-primary" />
          {isUz ? 'Ko\'rinish' : 'Appearance'}
        </h2>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-panel rounded-xl border border-border">
                <Monitor className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="font-medium text-text">{isUz ? 'Mavzu rejimi' : 'Theme Mode'}</p>
                <p className="text-sm text-muted">
                  {isUz
                    ? (theme === 'dark' ? 'Tungi rejim faol' : 'Kunduzgi rejim faol')
                    : (theme === 'dark' ? 'Dark mode is active' : 'Light mode is active')}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-16 h-8 rounded-full bg-panel border border-border transition-colors flex items-center px-1"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-secondary translate-x-0'
                    : 'bg-primary translate-x-8'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <h2 className="text-lg font-bold text-text flex items-center mb-6">
          <Globe className="w-5 h-5 mr-3 text-primary" />
          {isUz ? 'Til' : 'Language'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
              language === 'en'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-panel hover:border-primary/40'
            }`}
          >
            <span className="text-3xl mb-2 block">🇺🇸</span>
            <p className="font-bold text-text">English</p>
            <p className="text-xs text-muted">United States</p>
          </button>
          <button
            onClick={() => setLanguage('uz')}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
              language === 'uz'
                ? 'border-primary bg-primary/10'
                : 'border-border bg-panel hover:border-primary/40'
            }`}
          >
            <span className="text-3xl mb-2 block">🇺🇿</span>
            <p className="font-bold text-text">O'zbekcha</p>
            <p className="text-xs text-muted">O'zbekiston</p>
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <h2 className="text-lg font-bold text-text flex items-center mb-6">
          <Bell className="w-5 h-5 mr-3 text-primary" />
          {isUz ? 'Bildirishnomalar' : 'Notifications'}
        </h2>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">{isUz ? 'Narx o\'zgarishi' : 'Price Alerts'}</p>
              <p className="text-sm text-muted">{isUz ? 'Narx keskin o\'zgarganda xabar olish' : 'Get notified on major price changes'}</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">{isUz ? 'Yangiliklar' : 'News Updates'}</p>
              <p className="text-sm text-muted">{isUz ? 'Muhim kripto yangiliklari' : 'Important crypto news alerts'}</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">{isUz ? 'Portfel hisoboti' : 'Portfolio Report'}</p>
              <p className="text-sm text-muted">{isUz ? 'Haftalik portfel tahlili' : 'Weekly portfolio summary'}</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-primary rounded" />
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <h2 className="text-lg font-bold text-text flex items-center mb-6">
          <Shield className="w-5 h-5 mr-3 text-primary" />
          {isUz ? 'Xavfsizlik' : 'Security'}
        </h2>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">{isUz ? 'Ikki bosqichli autentifikatsiya' : 'Two-Factor Authentication'}</p>
              <p className="text-sm text-muted">{isUz ? 'Qo\'shimcha xavfsizlik darajasi' : 'Add extra layer of security'}</p>
            </div>
            <button className="px-4 py-2 bg-panel border border-border text-text text-sm font-medium rounded-xl hover:bg-panelHover transition-colors">
              {isUz ? 'Yoqish' : 'Enable'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-text">{isUz ? 'Parolni o\'zgartirish' : 'Change Password'}</p>
              <p className="text-sm text-muted">{isUz ? 'Hisobingiz parolini yangilang' : 'Update your account password'}</p>
            </div>
            <button className="px-4 py-2 bg-panel border border-border text-text text-sm font-medium rounded-xl hover:bg-panelHover transition-colors">
              {isUz ? 'O\'zgartirish' : 'Change'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
