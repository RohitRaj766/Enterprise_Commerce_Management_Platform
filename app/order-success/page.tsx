'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [loadingButton, setLoadingButton] = useState<'track' | 'home' | null>(null);

  const goTo = (path: string, key: 'track' | 'home') => {
    if (loadingButton) return;
    setLoadingButton(key);
    setTimeout(() => {
      router.push(path);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#eef8f1] to-white flex items-center justify-center px-5">
      <div className="w-full max-w-md  backdrop-blur rounded-3xl  px-6 py-10 text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-[#53B175]/10 flex items-center justify-center shadow-inner">
          <svg className="w-14 h-14 text-[#53B175]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Your order has been accepted</h1>
          <p className="text-sm text-gray-600">
            Your items have been placed and are on their way to being processed.
          </p>
        </div>
        <div className="space-y-3">
          <Button onClick={() => goTo('/account', 'track')} isLoading={loadingButton === 'track'} disabled={!!loadingButton && loadingButton !== 'track'}>
            Track Order
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

