'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function PaymentGatewayPage() {
  const router = useRouter();
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);
  const [isFailureLoading, setIsFailureLoading] = useState(false);

  const simulate = (type: 'success' | 'failure') => {
    if (isSuccessLoading || isFailureLoading) return;
    if (type === 'success') setIsSuccessLoading(true);
    if (type === 'failure') setIsFailureLoading(true);
    setTimeout(() => {
      if (type === 'success') {
        router.push('/order-success');
      } else {
        router.push('/order-failure');
      }
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18L9 12L15 6" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 mx-auto lg:mx-0">Payment Gateway</h1>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-2xl w-full mx-auto space-y-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#53B175]/10 flex items-center justify-center text-[#53B175] font-bold text-xl">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Simulate successful order</h2>
              <p className="text-sm text-gray-600 mt-1">Proceed to the accepted screen shown in the design.</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => simulate('success')} isLoading={isSuccessLoading} disabled={isFailureLoading}>
            Simulate success
          </Button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 font-bold text-xl">
              !
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Simulate failure</h2>
              <p className="text-sm text-gray-600 mt-1">Jump to the error page to mirror a failed transaction.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => simulate('failure')} isLoading={isFailureLoading} disabled={isSuccessLoading}>
            Simulate failure
          </Button>
        </div>
      </main>
    </div>
  );
}

