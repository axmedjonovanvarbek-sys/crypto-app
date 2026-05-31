"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Plus, Trash2 } from 'lucide-react';
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
        const res = await fetch('http://localhost:5000/api/auth/portfolio', {
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
      const res = await fetch('http://localhost:5000/api/auth/portfolio', {
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
      const res = await fetch(`http://localhost:5000/api/auth/portfolio/${coinId}`, {
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
        <h1 className="mb-2 flex items-center text-3xl font-bold text-text">
          <Briefcase className="mr-3 h-8 w-8 text-secondary" /> {t('portfolio', 'title')}
        </h1>
        <p className="text-muted">{t('portfolio', 'subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel relative overflow-hidden p-8 xl:col-span-2"
        >
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <DollarSign className="h-32 w-32 text-primary" />
          </div>
          <p className="mb-2 font-medium text-muted">{t('portfolio', 'totalBalance')}</p>
          <h2 className="mb-4 text-5xl font-bold text-text">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${isTotalProfitPositive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
            {isTotalProfitPositive ? <TrendingUp className="mr-2 h-4 w-4" /> : <TrendingDown className="mr-2 h-4 w-4" />}
            {isTotalProfitPositive ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={saveHolding}
          className="glass-panel space-y-4 p-6"
        >
          <h2 className="flex items-center text-lg font-bold text-text">
            <Plus className="mr-2 h-5 w-5 text-primary" />
            {isUz ? 'Aktiv qo\'shish' : 'Add Holding'}
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">{isUz ? 'Token' : 'Token'}</label>
            <select
              value={selectedCoinId}
              onChange={(event) => setSelectedCoinId(event.target.value)}
              className="w-full rounded-xl border border-border bg-panel px-3 py-3 text-sm text-text outline-none focus:border-primary"
            >
              {cryptoData.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">{isUz ? 'Miqdor' : 'Amount'}</label>
            <input
              type="number"
              min="0"
              step="any"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-xl border border-border bg-panel px-3 py-3 text-sm text-text outline-none focus:border-primary"
              placeholder="0.5"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              {isUz ? 'Sotib olingan narx (ixtiyoriy)' : 'Buy price (optional)'}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={buyPrice}
              onChange={(event) => setBuyPrice(event.target.value)}
              className="w-full rounded-xl border border-border bg-panel px-3 py-3 text-sm text-text outline-none focus:border-primary"
              placeholder="50000"
            />
          </div>

          {error && <p className="text-sm font-medium text-danger">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="mr-2 h-4 w-4" />
            {saving ? (isUz ? 'Saqlanmoqda...' : 'Saving...') : (isUz ? 'Saqlash' : 'Save')}
          </button>
        </motion.form>
      </div>

      <div className="glass-panel mt-8 overflow-hidden rounded-2xl">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold text-text">{t('portfolio', 'yourAssets')}</h2>
        </div>

        {holdingsWithCurrentData.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto mb-4 h-16 w-16 text-muted" />
            <h2 className="text-xl font-bold text-text">
              {isUz ? 'Portfelingiz hali bo\'sh' : 'Your portfolio is empty'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted">
              {isUz
                ? 'Boshlash uchun yuqoridagi forma orqali token va miqdorni kiriting.'
                : 'Use the form above to add a token and the amount you own.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-panel">
                  <th className="p-4 font-medium text-muted">{t('portfolio', 'asset')}</th>
                  <th className="p-4 font-medium text-muted">{t('portfolio', 'balance')}</th>
                  <th className="p-4 font-medium text-muted">{t('portfolio', 'price')}</th>
                  <th className="p-4 text-right font-medium text-muted">{t('portfolio', 'profitLoss')}</th>
                  <th className="p-4 text-center font-medium text-muted">{isUz ? 'Amal' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {holdingsWithCurrentData.map((holding: any) => {
                  const isPositive = holding.profit >= 0;
                  return (
                    <tr key={holding.coinId} className="border-b border-border transition-colors hover:bg-panelHover">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img src={holding.coin.image} alt={holding.coin.name} className="h-8 w-8 rounded-full" />
                          <div>
                            <p className="font-bold text-text">{holding.coin.name}</p>
                            <p className="text-xs uppercase text-muted">{holding.coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text">
                        <p className="font-bold">${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-sm text-muted">{holding.amount} {holding.coin.symbol.toUpperCase()}</p>
                      </td>
                      <td className="p-4 font-medium text-text">
                        ${holding.coin.current_price.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        {holding.hasBuyPrice ? (
                          <>
                            <p className={`font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                              {isPositive ? '+' : ''}${holding.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-sm ${isPositive ? 'text-success' : 'text-danger'}`}>
                              {isPositive ? '+' : ''}{holding.profitPercentage.toFixed(2)}%
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted">-</p>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => removeHolding(holding.coinId)}
                          disabled={removingCoinId === holding.coinId}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-danger/20 bg-danger/10 text-danger transition-colors hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
                          title={isUz ? 'O\'chirish' : 'Remove'}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
