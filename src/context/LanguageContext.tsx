import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language, Direction, TranslationDictionary } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  lang: Language;
  dir: Direction;
  isRTL: boolean;
  dict: TranslationDictionary;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (keyPath: string, fallback?: string) => string;
  formatPath: (path: string, targetLang?: Language) => string;
  switchRouteLanguage: (targetLang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(pathname: string): Language {
  // 1. Check URL path
  if (pathname.startsWith('/ar') || pathname === '/ar') {
    return 'ar';
  }
  if (pathname.startsWith('/en') || pathname === '/en') {
    return 'en';
  }

  // 2. Check localStorage
  try {
    const saved = localStorage.getItem('deysla_lang');
    if (saved === 'en' || saved === 'ar') {
      return saved;
    }
  } catch {
    // localStorage may be disabled or blocked in private mode
  }

  // 3. Check browser language (fallback to 'en' by default)
  if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('ar')) {
    return 'ar';
  }

  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage(location.pathname));

  // Sync state if user navigates to /ar or /en routes directly
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/ar') && language !== 'ar') {
      setLanguageState('ar');
    } else if (path.startsWith('/en') && language !== 'en') {
      setLanguageState('en');
    }
  }, [location.pathname, language]);

  const dir: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = dir === 'rtl';

  // Apply HTML document attributes immediately
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (isRTL) {
        document.documentElement.classList.add('rtl');
        document.documentElement.classList.remove('ltr');
      } else {
        document.documentElement.classList.add('ltr');
        document.documentElement.classList.remove('rtl');
      }

      // Update meta title and description for SEO
      const dict = TRANSLATIONS[language];
      document.title = dict.meta.siteTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', dict.meta.siteDescription);
      }
    }
  }, [language, dir, isRTL]);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('deysla_lang', newLang);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLang: Language = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  }, [language, setLanguage]);

  // Format a path to include the current (or specified) language prefix
  const formatPath = useCallback(
    (path: string, targetLang?: Language): string => {
      const activeLang = targetLang || language;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;

      // If it already has /en or /ar prefix, swap it
      if (cleanPath.startsWith('/en/') || cleanPath === '/en') {
        const withoutPrefix = cleanPath.replace(/^\/en/, '');
        return `/${activeLang}${withoutPrefix || ''}`;
      }
      if (cleanPath.startsWith('/ar/') || cleanPath === '/ar') {
        const withoutPrefix = cleanPath.replace(/^\/ar/, '');
        return `/${activeLang}${withoutPrefix || ''}`;
      }

      return `/${activeLang}${cleanPath === '/' ? '' : cleanPath}`;
    },
    [language]
  );

  // Switch language while staying on the exact same page / query parameters
  const switchRouteLanguage = useCallback(
    (newLang: Language) => {
      setLanguage(newLang);
      const currentPath = location.pathname;
      const newPath = formatPath(currentPath, newLang);
      const search = location.search;
      const hash = location.hash;
      navigate(`${newPath}${search}${hash}`, { replace: true });
    },
    [location.pathname, location.search, location.hash, formatPath, navigate, setLanguage]
  );

  const dict = useMemo(() => TRANSLATIONS[language], [language]);

  // Dot-notation translation resolver
  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const keys = keyPath.split('.');
      let current: any = dict;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          return fallback || keyPath;
        }
      }
      return typeof current === 'string' ? current : fallback || keyPath;
    },
    [dict]
  );

  const value = useMemo(
    () => ({
      language,
      lang: language,
      dir,
      isRTL,
      dict,
      setLanguage,
      toggleLanguage,
      t,
      formatPath,
      switchRouteLanguage,
    }),
    [language, dir, isRTL, dict, setLanguage, toggleLanguage, t, formatPath, switchRouteLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
