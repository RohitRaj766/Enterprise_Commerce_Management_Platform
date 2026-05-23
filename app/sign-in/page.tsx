'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

export default function SignInPage() {
  const router = useRouter();
  const { socialLogin, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePhoneNumberClick = async () => {
    if (isPhoneLoading || isGoogleLoading || isFacebookLoading) return;
    setIsPhoneLoading(true);
    await delay(900);
    router.push('/phone-number');
    setIsPhoneLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isFacebookLoading || isPhoneLoading) return;
    setIsGoogleLoading(true);
    try {
      await delay(900);
      const success = await socialLogin('google');
      if (success) {
        router.push('/location');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (isFacebookLoading || isGoogleLoading || isPhoneLoading) return;
    setIsFacebookLoading(true);
    try {
      await delay(900);
      const success = await socialLogin('facebook');
      if (success) {
        router.push('/location');
      }
    } finally {
      setIsFacebookLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="h-1/2 relative overflow-hidden lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-6xl">🛒</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center pt-0 p-4 bg-white lg:hidden">
        <Image 
          src="/assets/socialmedia.png" 
          alt="Social media options" 
          width={200} 
          height={80}
          className="object-cover"
        />
      </div>

      <div className="h-1/2 bg-white px-6 pt-8 pb-6 lg:h-auto lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:px-6 lg:pt-0 lg:pb-0">
        <div className="lg:max-w-md lg:w-full lg:bg-white lg:rounded-3xl lg:border lg:border-gray-100 lg:shadow-sm lg:px-8 lg:py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get your groceries with nectar
          </h1>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={handlePhoneNumberClick}
                  disabled={isPhoneLoading || isGoogleLoading || isFacebookLoading}
                  className={`
                    w-full py-4 pl-12 pr-4 rounded-2xl border-2 border-gray-200 
                    focus:border-[#53B175] focus:outline-none
                    text-base text-left bg-white cursor-pointer
                    hover:border-[#53B175] transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed relative
                  `}
                >
                  <span className="text-gray-400">
                    {isPhoneLoading ? 'Loading...' : '+880'}
                  </span>
                  {isPhoneLoading && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <svg
                        className="animate-spin h-5 w-5 text-[#53B175]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  )}
                </button>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9.5V11L14.25 13.75L15 12.75L10.5 10.5V5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or connect with social media
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="social-google"
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading}
              className="mb-3"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-2"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="social-facebook"
              onClick={handleFacebookLogin}
              isLoading={isFacebookLoading}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-2"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#ffffff"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

