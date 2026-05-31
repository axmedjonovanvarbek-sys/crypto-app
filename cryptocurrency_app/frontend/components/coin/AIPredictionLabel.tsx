"use client";

import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIPredictionLabelProps {
  analysis?: {
    trend: string;
    suggestion: string;
    previous_price: number;
    present_price: number;
    predicted_future_price: number;
    volatility: string;
  };
}

export default function AIPredictionLabel({ analysis }: AIPredictionLabelProps) {
  const { t } = useLanguage();

  if (!analysis) return null;

  const isBullish = analysis.trend.includes('Bullish');
  const Icon = isBullish ? TrendingUp : TrendingDown;
  const colorClass = isBullish ? 'text-success bg-success/10' : 'text-danger bg-danger/10';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-primary via-secondary to-transparent"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
      
      <div className="relative bg-surface p-6 rounded-[23px] h-full">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {t('coinDetail', 'aiIntelligence')}
            </h3>
            <p className="text-xs text-muted">{t('coinDetail', 'poweredBy')}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-muted text-sm">{t('coinDetail', 'trend')}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${colorClass}`}>
              <Icon className="w-3 h-3 mr-1" /> {analysis.trend}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted text-sm">{t('coinDetail', 'action')}</span>
            <span className="px-3 py-1 rounded-full bg-panel text-text border border-border text-xs font-bold uppercase tracking-wider">
              {analysis.suggestion}
            </span>
          </div>

          <div className="pt-4 border-t border-border space-y-4">
            <h4 className="text-sm font-semibold text-text flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-primary" /> {t('coinDetail', 'trajectory')}
            </h4>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-panel border border-border rounded-xl p-2">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1">{t('coinDetail', 'prev24h')}</p>
                <p className="font-mono text-sm text-text">${analysis.previous_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
              </div>
              <div className="bg-primary/20 border border-primary/30 rounded-xl p-2 relative">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                <p className="text-[10px] text-primary uppercase tracking-wider mb-1">{t('coinDetail', 'present')}</p>
                <p className="font-mono text-sm font-bold text-text">${analysis.present_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
              </div>
              <div className={`rounded-xl p-2 border ${isBullish ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
                <p className={`text-[10px] uppercase tracking-wider mb-1 ${isBullish ? 'text-success' : 'text-danger'}`}>{t('coinDetail', 'predicted')}</p>
                <p className={`font-mono text-sm font-bold ${isBullish ? 'text-success' : 'text-danger'}`}>${analysis.predicted_future_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
