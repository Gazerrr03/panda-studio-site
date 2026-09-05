'use client';

import { useI18n } from '@/components/i18n-provider';

export function LanguageSwitcher() {
  const { copy, locale, setLocale } = useI18n();

  return (
    <fieldset className="language-switcher" aria-label={copy.language.label}>
      <button
        type="button"
        aria-label={copy.language.switchToEnglish}
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
      >
        {copy.language.english}
      </button>
      <button
        type="button"
        aria-label={copy.language.switchToChinese}
        aria-pressed={locale === 'zh'}
        onClick={() => setLocale('zh')}
      >
        {copy.language.chinese}
      </button>
    </fieldset>
  );
}
