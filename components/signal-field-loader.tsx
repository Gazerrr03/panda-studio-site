'use client';

import dynamic from 'next/dynamic';

const LazySignalField = dynamic(
  () => import('@/components/signal-field').then((module) => module.SignalField),
  {
    ssr: false,
    loading: () => <div className="signal-field signal-field-fallback" aria-hidden="true" />,
  },
);

export function SignalFieldLoader() {
  return <LazySignalField />;
}
