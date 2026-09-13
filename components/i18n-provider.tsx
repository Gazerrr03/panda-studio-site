'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { getSiteCopy, type Locale } from '@/content/i18n';
import { getStudioContent, type StudioContent } from '@/content/studio';

const LOCALE_STORAGE_KEY = 'panda-studio-locale';
const LOCALE_CHANGE_EVENT = 'panda-studio-locale-change';

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'zh';

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return storedLocale === 'en' ? 'en' : 'zh';
}

function subscribeToLocale(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onChange);
  };
}

function getServerLocale(): Locale {
  return 'zh';
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: ReturnType<typeof getSiteCopy>;
  studio: StudioContent;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getStoredLocale,
    getServerLocale,
  );
  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  const copy = useMemo(() => getSiteCopy(locale), [locale]);
  const studio = useMemo(() => getStudioContent(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = copy.metadata.title;
  }, [copy.metadata.title, locale]);

  const value = useMemo(
    () => ({ locale, setLocale, copy, studio }),
    [copy, locale, setLocale, studio],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}
