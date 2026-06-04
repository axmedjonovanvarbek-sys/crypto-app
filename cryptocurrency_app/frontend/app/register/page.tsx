"use client";

import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t, language } = useLanguage();
  const { setSession } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(language === 'uz' ? 'Parollar mos kelmayapti' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(language === 'uz' ? 'Parol kamida 6 belgidan iborat bo\'lishi kerak' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://crypto-app-mn9g.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSession(data);
        setSuccess(language === 'uz' ? 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!' : 'Registration successful!');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setError(data.message || (language === 'uz' ? 'Ro\'yxatdan o\'tishda xatolik' : 'Registration failed'));
      }
    } catch (err) {
      setError(language === 'uz' ? 'Serverda xatolik yuz berdi' : 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-text">
          {language === 'uz' ? 'Yangi hisob yaratish' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          {language === 'uz' ? 'Yoki' : 'Or'}{' '}
          <Link href="/login" className="font-medium text-primary hover:text-blue-400 transition-colors">
            {language === 'uz' ? 'kirish' : 'sign in to your account'}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-border">
          {error && (
            <div className="mb-4 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted">
                {language === 'uz' ? 'Ism' : 'Full Name'}
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text placeholder-muted transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted">
                {t('auth', 'email')}
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text placeholder-muted transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted">
                {t('auth', 'password')}
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text placeholder-muted transition-colors"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted">
                {language === 'uz' ? 'Parolni tasdiqlash' : 'Confirm Password'}
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-text placeholder-muted transition-colors"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (language === 'uz' ? 'Ro\'yxatdan o\'tilmoqda...' : 'Registering...') : (language === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Sign up')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
