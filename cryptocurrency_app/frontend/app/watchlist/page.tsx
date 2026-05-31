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
        const res = await fetch('http://localhost:5000/api/auth/watchlist', {
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
      const res = await fetch(`http://localhost:5000/api/auth/watchlist/${coinId}`, {
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
              <Link href={`/coin/${coin.id}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-bold text-text">{coin.symbol.toUpperCase()}</h3>
                      <p className="text-sm text-muted">{coin.name}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      removeFromWatchlist(coin.id);
                    }}
                    disabled={removingCoinId === coin.id}
                    className="rounded-xl border border-danger/20 bg-danger/10 p-2 text-danger transition-colors hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
                    title="Remove"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-text group-hover:text-primary transition-colors">
                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </h2>
                  <p className={`text-sm font-medium mt-2 flex items-center ${isPositive ? 'text-success' : 'text-danger'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {watchlistData.length === 0 && (
         <div className="glass-panel p-12 text-center rounded-2xl">
           <Star className="w-16 h-16 text-muted mx-auto mb-4" />
           <h2 className="text-xl font-bold text-text">{t('watchlist', 'empty')}</h2>
           <p className="text-muted mt-2">{t('watchlist', 'emptySub')}</p>
           <Link href="/explore">
             <button className="mt-6 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl transition-colors">
               {t('watchlist', 'exploreBtn')}
             </button>
           </Link>
         </div>
      )}
    </div>
  );
}
