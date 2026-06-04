"use client";

import { useSocket } from '@/contexts/SocketContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioHolding {
  coinId: string;
  amount: number;
  buyPrice?: number;
}

export default function Portfolio() {
  const { cryptoData } = useSocket();
  const { t, language } = useLanguage();
  const { token } = useAuth();
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingCoinId, setRemovingCoinId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isUz = language === 'uz';

  useEffect(() => {
    if (!token) return;

    const fetchPortfolio = async () => {
      setLoadingPortfolio(true);

      try {
        const res = await fetch('https://crypto-app-mn9g.onrender.com/api/auth/portfolio', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setPortfolioHoldings(data);
        }
      } finally {
        setLoadingPortfolio(false);
      }
    };

    fetchPortfolio();
  }, [token]);

  useEffect(() => {
    if (!selectedCoinId && cryptoData?.length) {
      setSelectedCoinId(cryptoData[0].id);
    }
  }, [cryptoData, selectedCoinId]);

  const holdingsWithCurrentData = useMemo(() => {
    return portfolioHoldings
      .map((holding) => {
        const coin = cryptoData.find((item) => item.id === holding.coinId);
        if (!coin) return null;

        const currentValue = holding.amount * coin.current_price;
        const buyValue = holding.amount * (holding.buyPrice || 0);
        const hasBuyPrice = Boolean(holding.buyPrice && holding.buyPrice > 0);
        const profit = hasBuyPrice ? currentValue - buyValue : 0;
        const profitPercentage = hasBuyPrice && buyValue > 0 ? (profit / buyValue) * 100 : 0;

        return {
          ...holding,
          coin,
          currentValue,
          hasBuyPrice,
          profit,
          profitPercentage,
        };
      })
      .filter(Boolean);
  }, [cryptoData, portfolioHoldings]);

  const totalBalance = holdingsWithCurrentData.reduce((sum, holding: any) => sum + holding.currentValue, 0);
  const totalProfit = holdingsWithCurrentData.reduce((sum, holding: any) => sum + holding.profit, 0);
  const isTotalProfitPositive = totalProfit >= 0;

  const resetForm = () => {
    setAmount('');
    setBuyPrice('');
    if (cryptoData[0]) {
      setSelectedCoinId(cryptoData[0].id);
    }
  };

  const saveHolding = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('https://crypto-app-mn9g.onrender.com/api/auth/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coinId: selectedCoinId,
          amount,
          buyPrice,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Could not save holding');
      }

      setPortfolioHoldings(data);
      resetForm();
    } catch (err: any) {
      setError(err.message || (isUz ? 'Portfelni saqlashda xatolik' : 'Could not save portfolio'));
    } finally {
      setSaving(false);
    }
  };

  const removeHolding = async (coinId: string) => {
    if (!token || removingCoinId) return;

    setRemovingCoinId(coinId);
    setError('');

    try {
      const res = await fetch(`https://crypto-app-mn9g.onrender.com/api/auth/portfolio/${coinId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Could not remove holding');
      }

      setPortfolioHoldings(data);
    } catch (err: any) {
      setError(err.message || (isUz ? 'Aktivni o\'chirishda xatolik' : 'Could not remove holding'));
    } finally {
      setRemovingCoinId(null);
    }
  };

  if (!cryptoData || cryptoData.length === 0 || loadingPortfolio) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-text">{t('portfolio', 'title')}</h1>
        <p className="text-muted">{t('portfolio', 'subtitle')}</p>
      </div>

      {holdingsWithCurrentData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 border border-border/50"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted mb-1">{isUz ? 'Jami balans' : 'Total Balance'}</p>
              <p className="text-2xl font-bold text-text">${totalBalance.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">{isUz ? 'Jami foyda' : 'Total Profit'}</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${ isTotalProfitPositive ? 'text-success' : 'text-danger'}`}>
                  ${Math.abs(totalProfit).toFixed(2)}
                </p>
                {isTotalProfitPositive ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-danger" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">{isUz ? 'Aktivlar' : 'Assets'}</p>
              <p className="text-2xl font-bold text-text">{holdingsWithCurrentData.length}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-text">{isUz ? 'Sizning aktivlar' : 'Your Holdings'}</h2>
          {holdingsWithCurrentData.length === 0 ? (
            <div className="glass-panel p-8 text-center border border-border/50">
              <p className="text-muted mb-4">{isUz ? 'Hozircha aktivlar yoq' : 'No holdings yet'}</p>
              <Link href="/explore" className="text-primary hover:underline">
                {isUz ? 'Kriptovalyutalarni qo\'shish' : 'Add cryptocurrencies'}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {holdingsWithCurrentData.map((holding: any) => (
                <motion.div
                  key={holding.coinId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-panel p-4 border border-border/50 hover:border-primary/30 transition-colors flex justify-between items-center"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img src={holding.coin.image} alt={holding.coin.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-text">{holding.coin.name}</p>
                      <p className="text-sm text-muted">{holding.amount.toFixed(4)} {holding.coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text">${holding.currentValue.toFixed(2)}</p>
                    {holding.hasBuyPrice && (
                      <p className={`text-sm ${holding.profitPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                        {holding.profitPercentage >= 0 ? '+' : ''}{holding.profitPercentage.toFixed(2)}%
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeHolding(holding.coinId)}
                    disabled={removingCoinId === holding.coinId}
                    className="ml-4 p-2 hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5 text-danger" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-text flex items-center">
            <Plus className="w-5 h-5 mr-2" /> {isUz ? 'Aktiv qo\'shish' : 'Add Holding'}
          </h2>
          <form onSubmit={saveHolding} className="glass-panel p-6 border border-border/50 space-y-4">
            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">{isUz ? 'Kriptovalyuta' : 'Cryptocurrency'}</label>
              <select
                value={selectedCoinId}
                onChange={(e) => setSelectedCoinId(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary text-text"
              >
                {cryptoData.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">{isUz ? 'Miqdor' : 'Amount'}</label>
              <input
                type="number"
                step="0.00000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.5"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary text-text placeholder-muted"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">{isUz ? 'Sotib olingan narxi (ixtiyoriy)' : 'Buy Price (optional)'}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary text-text placeholder-muted"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !amount}
              className="w-full px-4 py-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {saving ? (isUz ? 'Saqlanyapti...' : 'Saving...') : (isUz ? 'Saqlash' : 'Save')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
