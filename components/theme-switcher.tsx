'use client';

import { useSyncExternalStore } from 'react';
import { useI18n } from '@/components/i18n-provider';

const key = 'panda-studio-theme';
const changeEvent = 'panda-studio-theme-change';
type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(changeEvent));
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: light)');
  const syncPreference = () => {
    let theme = systemTheme();
    try {
      const saved = localStorage.getItem(key);
      if (saved === 'light' || saved === 'dark') theme = saved;
    } catch { /* Storage may be unavailable; system preference still works. */ }
    applyTheme(theme);
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener('storage', syncPreference);
  media.addEventListener('change', syncPreference);
  syncPreference();
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener('storage', syncPreference);
    media.removeEventListener('change', syncPreference);
  };
}

function snapshot(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  return useSyncExternalStore(subscribe, snapshot, () => 'dark' as Theme);
}

export function ThemeSwitcher() {
  const theme = useTheme();
  const { locale } = useI18n();
  const label = locale === 'zh' ? '浅色模式' : 'Light mode';
  const hint = locale === 'zh'
    ? `切换为${theme === 'light' ? '深' : '浅'}色模式`
    : `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;

  return (
    <button type="button" className="theme-switcher" aria-label={label}
      aria-pressed={theme === 'light'} title={hint}
      onClick={() => {
        const next = theme === 'light' ? 'dark' : 'light';
        try { localStorage.setItem(key, next); } catch { /* Keep switching in memory. */ }
        applyTheme(next);
      }}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" />
      </svg>
    </button>
  );
}
