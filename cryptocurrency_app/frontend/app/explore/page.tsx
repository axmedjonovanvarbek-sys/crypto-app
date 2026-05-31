"use client";

import { useSocket } from '@/contexts/SocketContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Filter, Star } from 'lucide-react';

export default function Explore() {
  const { cryptoData } = useSocket();
  const { t } = useLanguage();
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [updatingCoinId, setUpdatingCoinId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchWatchlist = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setWatchlistIds(data);
        }
      } catch {
        setWatchlistIds([]);
      }
    };

    fetchWatchlist();
  }, [token]);

  const toggleWatchlist = async (coinId: string) => {
    if (!token || updatingCoinId) return;

    const isAdded = watchlistIds.includes(coinId);
    setUpdatingCoinId(coinId);

    try {
      const res = await fetch(
        isAdded
          ? `http://localhost:5000/api/auth/watchlist/${coinId}`
          : 'http://localhost:5000/api/auth/watchlist',
        {
          method: isAdded ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: isAdded ? undefined : JSON.stringify({ coinId }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setWatchlistIds(data);
      }
    } finally {
      setUpdatingCoinId(null);
    }
  };

  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredData = cryptoData.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">{t('explore', 'title')}</h1>
          <p className="text-muted">{t('explore', 'subtitle')}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input 
              type="text" 
              placeholder={t('nav', 'search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-panel border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text placeholder-muted w-full md:w-64"
            />
          </div>
          <button className="p-3 bg-panel border border-border rounded-2xl hover:bg-panelHover transition-colors">
            <Filter className="w-5 h-5 text-text" />
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-panel border-b border-border">
                <th className="p-4 font-medium text-muted">{t('explore', 'asset')}</th>
                <th className="p-4 font-medium text-muted">{t('explore', 'price')}</th>
                <th className="p-4 font-medium text-muted">{t('explore', 'change24h')}</th>
                <th className="p-4 font-medium text-muted hidden md:table-cell">{t('explore', 'marketCap')}</th>
                <th className="p-4 font-medium text-muted hidden lg:table-cell">{t('explore', 'volume24h')}</th>
                <th className="p-4 font-medium text-muted text-center">{t('explore', 'aiTrend')}</th>
                <th className="p-4 font-medium text-muted text-center">{t('explore', 'watch')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((coin) => {
                const isPositive = coin.price_change_percentage_24h >= 0;
                const isBullish = coin.ai_analysis?.trend.includes('Bullish');
                const isWatched = watchlistIds.includes(coin.id);
                
                return (
                  <tr key={coin.id} className="border-b border-border hover:bg-panelHover transition-colors group cursor-pointer">
                    <td className="p-4">
                      <Link href={`/coin/${coin.id}`} className="flex items-center space-x-3">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-bold text-text">{coin.name}</p>
                          <p className="text-xs text-muted uppercase">{coin.symbol}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4 font-medium text-text">
                      ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-text">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-text">
                      ${coin.total_volume.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full ${isBullish ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                         {coin.ai_analysis?.trend || 'Neutral'}
                       </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleWatchlist(coin.id)}
                        disabled={updatingCoinId === coin.id}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                          isWatched
                            ? 'border-yellow-500/40 bg-yellow-500/15 text-yellow-500'
                            : 'border-border bg-panel text-muted hover:border-yellow-500/40 hover:text-yellow-500'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                        title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <Star className={`h-5 w-5 ${isWatched ? 'fill-yellow-500' : ''}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-muted">
              No cryptocurrencies found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
