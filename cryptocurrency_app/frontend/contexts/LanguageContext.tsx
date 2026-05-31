"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language } from '../locales/translations';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: keyof typeof translations['en'], key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'uz')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (section: keyof typeof translations['en'], key: string): string => {
    const sectionData = translations[language][section] as any;
    if (sectionData && sectionData[key]) {
      return sectionData[key];
    }
    // Fallback to English if translation is missing
    const enSectionData = translations['en'][section] as any;
    if (enSectionData && enSectionData[key]) {
      return enSectionData[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
