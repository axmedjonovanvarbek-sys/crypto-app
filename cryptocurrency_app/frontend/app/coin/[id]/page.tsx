"use client";

import { useSocket } from '@/contexts/SocketContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AIPredictionLabel from '@/components/coin/AIPredictionLabel';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import DataSourceBreakdown from '@/components/coin/DataSourceBreakdown';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CoinDetail({ params }: { params: { id: string } }) {
  const { cryptoData } = useSocket();
  const { t } = useLanguage();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe] = useState('1');
  
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const coin = cryptoData.find(c => c.id === params.id);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchHistory = async () => {
      setHistory([]);
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`http://localhost:5000/api/crypto/history/${params.id}?days=${timeframe}`, { signal });
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        const data = await res.json();
        if (data.prices && data.prices.length > 0) {
          const formatted = data.prices.map((item: any) => ({
            time: new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: item[1]
          }));
          setHistory(formatted);
        } else {
          setError(true);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted for', params.id);
          return;
        }
        console.error("Failed to load history", err);
        setError(true);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    
    if (params.id) {
      fetchHistory();
    }

    return () => {
      abortController.abort();
    };
  }, [params.id, timeframe, retryCount]);

  if (!coin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="space-y-6 pb-12">
      <Link href="/" className="inline-flex items-center text-muted hover:text-text transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> {t('coinDetail', 'back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full shadow-lg" />
              <div>
                <h1 className="text-3xl font-bold text-text">{coin.name}</h1>
                <span className="bg-panel px-3 py-1 rounded-full text-sm font-medium text-text border border-border">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-muted text-sm mb-1">{t('coinDetail', 'currentPrice')}</p>
              <div className="flex items-end space-x-3">
                <h2 className="text-4xl font-bold text-text">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</h2>
                <div className={`flex items-center px-2 py-1 rounded-lg text-sm font-bold ${isPositive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted">{t('coinDetail', 'marketCap')}</span>
                <span className="font-medium text-text">${coin.market_cap.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('coinDetail', 'volume24h')}</span>
                <span className="font-medium text-text">${coin.total_volume.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('coinDetail', 'supply')}</span>
                <span className="font-medium text-text">{coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <AIPredictionLabel analysis={coin.ai_analysis} />
          {coin.source_breakdown && (
            <DataSourceBreakdown 
              sources={coin.source_breakdown} 
              finalPrice={coin.current_price} 
            />
          )}
        </div>

        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" /> {t('coinDetail', 'priceHistory')}
            </h2>
            <span className="px-3 py-1 text-sm font-medium rounded-md bg-primary text-white shadow-md">
              24 soat
            </span>
          </div>
          
          <div className="h-[500px]">
            {loading ? (
               <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-4 bg-panel rounded w-3/4"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-panel rounded col-span-2"></div>
                          <div className="h-2 bg-panel rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-panel rounded"></div>
                      </div>
                    </div>
                  </div>
               </div>
            ) : error ? (
               <div className="flex flex-col items-center justify-center h-full text-muted">
                  <Activity className="w-10 h-10 mb-3 opacity-50" />
                  <p className="text-sm">Ma&apos;lumotlarni yuklashda xatolik</p>
                  <button 
                    onClick={() => setRetryCount(c => c + 1)} 
                    className="mt-3 text-xs text-primary hover:underline"
                  >
                    Qayta urinish
                  </button>
               </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={history}
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} minTickGap={30} />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    tick={{fill: 'var(--text-muted)', fontSize: 12}} 
                    axisLine={false} 
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    labelStyle={{ color: 'var(--text-muted)', marginBottom: '8px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, t('explore', 'price')]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPositive ? '#10B981' : '#EF4444'} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
