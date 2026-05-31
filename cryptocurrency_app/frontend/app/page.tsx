"use client";

import { useSocket } from '@/contexts/SocketContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PriceChart from '@/components/charts/PriceChart';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { cryptoData } = useSocket();
  const { t } = useLanguage();

  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topGainers = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-text">{t('dashboard', 'title')}</h1>
        <p className="text-muted">{t('dashboard', 'subtitle')}</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {topGainers.map((coin, index) => {
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
                  <div className={`p-2 rounded-xl ${isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">
                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </h2>
                  <p className={`text-sm font-medium mt-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
                    {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Main Chart and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" /> {t('dashboard', 'dominance')}
            </h2>
          </div>
          <div className="h-[400px]">
            <PriceChart data={cryptoData} />
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-bold text-text mb-6">{t('dashboard', 'trending')}</h2>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {cryptoData.map((coin) => (
              <Link href={`/coin/${coin.id}`} key={coin.id}>
                <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-panelHover transition-colors">
                  <div className="flex items-center space-x-3">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-bold text-sm text-text">{coin.symbol.toUpperCase()}</p>
                      <p className="text-xs text-muted">{coin.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-text">${coin.current_price.toLocaleString()}</p>
                    <p className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-danger'}`}>
                      {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
