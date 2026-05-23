'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push('/sign-in');
    }, 900);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/onboarding.png"
          alt="Delivery person with groceries"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Overlay - positioned in lower portion of screen */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end px-5 pb-8">
        <div className="flex flex-col items-center text-center mb-8">
          {/* Carrot Icon - small, white, centered above text */}
          <div className="mb-4">
            <Image
              src="/assets/carrot.png"
              alt="Carrot icon"
              width={60}
              height={80}
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Welcome Text - split into two lines as shown in screenshot */}
          <h1 className="text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
            Welcome<br />to our store
          </h1>

          {/* Tagline - smaller, lighter white text */}
          <p className="text-white text-lg font-normal opacity-95 px-2 mb-8">
            Get your groceries in as fast as one hour
          </p>

          {/* Get Started Button - prominent green button at bottom */}
          <Button
            onClick={handleGetStarted}
            variant="primary"
            className="shadow-xl"
            isLoading={isLoading}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

