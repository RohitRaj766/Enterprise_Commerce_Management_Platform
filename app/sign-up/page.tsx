'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@/lib/zod-schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/store/authStore';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isLoading, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: 'Afsar Hossen Shuvo',
      email: 'imshuvo97@gmail.com',
      password: '',
    },
  });

  const emailValue = watch('email');

  // Check email validity
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(emailValue || ''));
  }, [emailValue]);

  const onSubmit = async (data: SignUpFormData) => {
    if (isSubmitting || isLoading) return;
    setIsSubmitting(true);
    try {
      await delay(900);
      const success = await signUp(data.username, data.email, data.password);
      if (success) {
        router.push('/home');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center px-6">
      <div className="max-w-4xl w-full bg-white px-6 py-1 flex justify-center items-center">
        
        <div className="mt-8 w-full max-w-xl">
        <Navbar showLogo />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h1>
          <p className="text-gray-600 text-base mb-8">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Username"
              type="text"
              placeholder="Afsar Hossen Shuvo"
              {...register('username')}
              error={errors.username?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="imshuvo97@gmail.com"
              {...register('email')}
              error={errors.email?.message}
              rightIcon={
                emailValid && !errors.email ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6667 5L7.50004 14.1667L3.33337 10"
                      stroke="#53B175"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null
              }
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.04834 9.99999C3.11001 6.61916 6.26917 4.16666 10 4.16666C13.7317 4.16666 16.89 6.61916 17.9517 9.99999C16.89 13.3808 13.7317 15.8333 10 15.8333C6.26917 15.8333 3.11001 13.3808 2.04834 9.99999Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 2.5L17.5 17.5M8.15833 8.15833C7.84024 8.47642 7.66667 8.91449 7.66667 9.375C7.66667 10.2975 8.41084 11.0417 9.33333 11.0417C9.79384 11.0417 10.2319 10.8681 10.55 10.55M14.5333 12.6083C13.4717 13.05 12.2583 13.3333 11 13.3333C7.26833 13.3333 4.11 10.8817 3.04833 7.5C3.635 5.60833 4.8 3.99166 6.31667 2.85M14.5333 12.6083L16.6667 14.7417M14.5333 12.6083C15.125 11.7167 15.5833 10.725 15.8917 9.66666C14.83 6.285 11.6717 3.83333 7.94 3.83333C7.25833 3.83333 6.59167 3.93333 5.95833 4.11666M8.15833 8.15833L5.95833 4.11666M8.15833 8.15833L5.83333 5.83333M5.95833 4.11666L3.33333 1.66666"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              }
            />

            <div className="text-sm text-gray-600">
              By continuing you agree to our{' '}
              <Link href="/terms" className="text-[#53B175]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#53B175]">
                Privacy Policy
              </Link>
              .
            </div>

            <Button type="submit" variant="primary" isLoading={isLoading || isSubmitting}>
              Sign Up
            </Button>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-[#53B175] font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

