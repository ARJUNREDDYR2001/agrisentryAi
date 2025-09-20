'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import mr from '@/locales/mr.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';
import kn from '@/locales/kn.json';

const translations = { en, hi, mr, ta, te, kn };

type Locale = keyof typeof translations;

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (translations[browserLang]) {
      setLocale(browserLang);
    }
  }, []);

  const t = useCallback((key: string) => {
    return translations[locale][key as keyof typeof translations[Locale]] || key;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
