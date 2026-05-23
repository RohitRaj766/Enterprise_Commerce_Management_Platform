'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#53B175] flex items-center justify-center">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="relative">
            <Image
              src="/assets/nector-logo.png"
              alt="nectar logo"
              width={80}
              height={50}
              priority
              className="object-contain w-20 h-10 sm:w-24 sm:h-12 md:w-32 md:h-16 lg:w-40 lg:h-20 transition-all duration-300"
            />
          </div>
        
        </div>
      </div>
    </div>
  );
}

