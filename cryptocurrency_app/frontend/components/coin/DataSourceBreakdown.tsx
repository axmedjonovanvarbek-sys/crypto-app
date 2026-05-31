import { ShieldCheck, Database, CheckCircle2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Source {
  name: string;
  price: number;
  url?: string;
}

interface DataSourceBreakdownProps {
  sources: Source[];
  finalPrice: number;
}

export default function DataSourceBreakdown({ sources, finalPrice }: DataSourceBreakdownProps) {
  const { t } = useLanguage();
  
  if (!sources || sources.length === 0) return null;

  return (
    <div className="glass-panel p-6 mt-6">
      <div className="flex items-center space-x-2 mb-4">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-text">{t('verification', 'title')}</h3>
      </div>
      <p className="text-sm text-muted mb-4">
        {t('verification', 'subtitle')} <span className="font-bold text-primary">{sources.length}</span> {t('verification', 'subtitleEnd')}
      </p>
      
      <div className="space-y-3">
        {sources.map((source, idx) => {
          const isSelected = source.price === finalPrice;
          return (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-border bg-panel'}`}>
              <a href={source.url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:text-primary transition-colors group">
                <Database className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted group-hover:text-primary'}`} />
                <span className="font-medium text-text group-hover:text-primary flex items-center transition-colors">
                  {source.name}
                  {source.url && <ExternalLink className="w-3 h-3 ml-1.5 opacity-50 group-hover:opacity-100" />}
                </span>
              </a>
              <div className="flex items-center space-x-3">
                <span className="font-bold text-text">${source.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-xl flex items-start space-x-3">
        <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
        <div>
          <p className="text-sm font-bold text-success">{t('verification', 'chosenPrice')} ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
          <p className="text-xs text-success/80 mt-1">{t('verification', 'chosenDesc')}</p>
        </div>
      </div>
    </div>
  );
}
