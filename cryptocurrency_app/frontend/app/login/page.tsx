"use client";

import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const { setSession } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://crypto-app-mn9g.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSession(data, rememberMe);
        router.push('/');
      } else {
        // Translation for specific backend errors if needed, but we'll use a generic translated message or the backend message
        setError(data.message === 'Invalid email or password' ? t('auth', 'invalidCreds') : data.message);
      }
    } catch (err) {
      setError(t('auth', 'serverError'));
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
          {t('auth', 'signInToAccount')}
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          {t('auth', 'or')}{' '}
          <Link href="/register" className="font-medium text-primary hover:text-blue-400 transition-colors">
            {t('auth', 'createAccount')}
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

          <form className="space-y-6" onSubmit={handleLogin}>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-muted">
                  {t('auth', 'rememberMe')}
                </label>
              </div>
              <Link href="#" className="text-sm font-medium text-primary hover:text-blue-400 transition-colors">
                {t('auth', 'forgotPass')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? t('auth', 'loggingIn') : t('auth', 'signInBtn')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
