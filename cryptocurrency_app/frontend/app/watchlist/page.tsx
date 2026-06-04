"use client";

import { useSocket } from '@/contexts/SocketContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Star, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Watchlist() {
  const { cryptoData } = useSocket();
  const { t } = useLanguage();
  const { token } = useAuth();
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [removingCoinId, setRemovingCoinId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchWatchlist = async () => {
      setLoadingWatchlist(true);

      try {
        const res = await fetch('https://crypto-app-mn9g.onrender.com/api/auth/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setWatchlistIds(data);
        }
      } finally {
        setLoadingWatchlist(false);
      }
    };

    fetchWatchlist();
  }, [token]);

  const removeFromWatchlist = async (coinId: string) => {
    if (!token || removingCoinId) return;

    setRemovingCoinId(coinId);

    try {
      const res = await fetch(`https://crypto-app-mn9g.onrender.com/api/auth/watchlist/${coinId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setWatchlistIds(data);
      }
    } finally {
      setRemovingCoinId(null);
    }
  };
  
  if (!cryptoData || cryptoData.length === 0 || loadingWatchlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const watchlistData = cryptoData.filter(coin => watchlistIds.includes(coin.id));

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center text-text">
          <Star className="w-8 h-8 mr-3 text-yellow-500 fill-yellow-500/20" /> {t('watchlist', 'title')}
        </h1>
        <p className="text-muted">{t('watchlist', 'subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {watchlistData.map((coin, index) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={coin.id} 
              className="glass-panel p-6 flex flex-col justify-between hover:border-primary/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-text">{coin.name}</h3>
                    <p className="text-sm text-muted">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromWatchlist(coin.id)}
                  disabled={removingCoinId === coin.id}
                  className="p-2 hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5 text-danger" />
                </button>
              </div>

              <Link href={`/coin/${coin.id}`}>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-text mb-2">${coin.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                  <div className={`flex items-center gap-2 text-sm font-medium ${ isPositive ? 'text-success' : 'text-danger'}`}>
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% {t('common', 'in24h')}
                  </div>
                </div>
              </Link>

              {coin.market_cap && (
                <div className="text-xs text-muted">
                  {t('common', 'marketCap')}: ${(coin.market_cap / 1e9).toFixed(2)}B
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {watchlistData.length === 0 && (
        <div className="glass-panel p-12 text-center border border-border/50">
          <p className="text-muted mb-4">{t('watchlist', 'empty')}</p>
          <Link href="/explore" className="text-primary hover:underline font-medium">
            {t('watchlist', 'addCoins')}
          </Link>
        </div>
      )}
    </div>
  );
}
