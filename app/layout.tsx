import type { Metadata } from 'next';
import { Caveat, Geist, Geist_Mono } from 'next/font/google';
import { I18nProvider } from '@/components/i18n-provider';
import { siteCopy } from '@/content/i18n';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const handDisplay = Caveat({
  variable: '--font-hand-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteCopy.en.metadata.title,
  description: siteCopy.en.metadata.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';try{var s=localStorage.getItem('panda-studio-theme');if(s==='light'||s==='dark')t=s}catch(e){}document.documentElement.dataset.theme=t})()` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${handDisplay.variable}`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
