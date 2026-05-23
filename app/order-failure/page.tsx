'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function OrderFailurePage() {
  const router = useRouter();
  const [loadingButton, setLoadingButton] = useState<'retry' | 'home' | null>(null);

  const goTo = (path: string, key: 'retry' | 'home') => {
    if (loadingButton) return;
    setLoadingButton(key);
    setTimeout(() => {
      router.push(path);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md px-6 py-10 text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12H6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7V5a3 3 0 016 0v2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11h.01M14 11h.01" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Oops! Order Failed</h1>
          <p className="text-sm text-gray-600">Something went terribly wrong.</p>
        </div>
        <div className="space-y-3">
          <Button onClick={() => goTo('/payment-gateway', 'retry')} isLoading={loadingButton === 'retry'} disabled={!!loadingButton && loadingButton !== 'retry'}>
            Please Try Again
          </Button>
          <Button
            variant="secondary"
            onClick={() => goTo('/home', 'home')}
            isLoading={loadingButton === 'home'}
            disabled={!!loadingButton && loadingButton !== 'home'}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}

