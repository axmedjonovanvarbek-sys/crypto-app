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
      const res = await fetch('http://localhost:5000/api/auth/register', {
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
            {language === 'uz' ? 'mavjud hisobga kirish' : 'sign in to existing account'}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-border">

          {error && (
            <div className="mb-4 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted">
                {language === 'uz' ? 'To\'liq ism' : 'Full Name'}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 bg-panel border border-border rounded-xl py-3 text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder={language === 'uz' ? 'Ismingiz' : 'Your name'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted">
                {language === 'uz' ? 'Email manzil' : 'Email address'}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-panel border border-border rounded-xl py-3 text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted">
                {language === 'uz' ? 'Parol' : 'Password'}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-panel border border-border rounded-xl py-3 text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-muted">
                {language === 'uz' ? 'Parolni tasdiqlash' : 'Confirm Password'}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 bg-panel border border-border rounded-xl py-3 text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading
                  ? (language === 'uz' ? 'Ro\'yxatdan o\'tilmoqda...' : 'Creating account...')
                  : (language === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Create Account')}
                {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
