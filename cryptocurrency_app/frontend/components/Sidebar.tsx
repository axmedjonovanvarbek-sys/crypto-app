"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, Briefcase, Star, Settings, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

const navItems = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },
  { key: 'explore', href: '/explore', icon: Compass },
  { key: 'portfolio', href: '/portfolio', icon: Briefcase },
  { key: 'watchlist', href: '/watchlist', icon: Star },
  { key: 'settings', href: '/settings', icon: Settings },
];

const adminNavItem = { key: 'admin', href: '/admin', icon: ShieldCheck };

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const visibleNavItems = isAdmin ? [...navItems, adminNavItem] : navItems;
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setNews(data.items.slice(0, 3));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <aside className="w-64 glass-panel hidden md:flex flex-col m-4 rounded-3xl border-border h-[calc(100vh-32px)] overflow-hidden">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          CryptoVision
        </span>
      </div>

      <nav className="px-4 py-6 space-y-2">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300',
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm border border-primary/20' 
                  : 'text-muted hover:bg-panelHover hover:text-text'
              )}
            >
              <item.icon className={clsx('w-5 h-5', isActive ? 'text-primary' : 'text-muted')} />
              <span className="font-medium">{t('sidebar', item.key as any)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border px-4 pb-6 overflow-y-auto hidden lg:block">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 px-2">
          {t('news', 'latest')}
        </h3>
        <div className="space-y-3">
          {news.map(item => (
            <a 
              key={item.guid || item.link} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block p-3 rounded-2xl bg-panel hover:bg-panelHover transition-colors border border-border group"
            >
              <div className="flex items-start space-x-3">
                <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-text line-clamp-2 group-hover:text-primary transition-colors leading-tight">{item.title}</h4>
                  <span className="text-[9px] text-muted mt-1 block">CoinTelegraph</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
