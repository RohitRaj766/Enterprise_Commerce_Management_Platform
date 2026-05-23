'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OTPFormData } from '@/lib/zod-schemas';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/store/authStore';
import { useOTPStore } from '@/store/otpStore';
import { OTPInput } from '@/components/ui/OTPInput';

export default function OTPPage() {
  const router = useRouter();
  const { verifyOTP, isLoading, isAuthenticated } = useAuthStore();
  const { phoneNumber, resendOTP, isResending } = useOTPStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);
  const [otpError, setOtpError] = useState<string>('');
  const [currentOtp, setCurrentOtp] = useState<string>('');

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleOTPComplete = async (otp: string) => {
    setCurrentOtp(otp);
    setValue('otp', otp, { shouldValidate: true });
    setOtpError('');
    
    const success = await verifyOTP(phoneNumber, otp);
    if (success) {
      router.push('/location');
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    await resendOTP();
    setCurrentOtp('');
    setOtpError('');
    setValue('otp', '', { shouldValidate: false });
  };

  const onSubmit = async (data: OTPFormData) => {
    if (!data.otp || data.otp.length !== 4) {
      return;
    }
    
    const success = await verifyOTP(phoneNumber, data.otp);
    if (success) {
      router.push('/location');
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div 
        style={{ backgroundImage: 'url(/assets/headerbackground.png)' }}
        className="bg-cover bg-center bg-no-repeat h-80 absolute top-0 left-0 w-full z-0"
      >
        <Navbar showBack title="" />
      </div>

      <div className="px-6 pt-[100px] relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">
          Enter your 4-digit code
        </h1>
        <p className="text-gray-500 text-base mb-8 relative z-10">Code</p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (currentOtp && currentOtp.length === 4) {
              handleSubmit(onSubmit)(e);
            }
          }} 
          className="relative z-10"
        >
          <div className="mb-6">
            <OTPInput
              onComplete={handleOTPComplete}
              error={otpError || (currentOtp && errors.otp?.message)}
            />
          </div>

          <div className="mb-8 flex justify-between items-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#53B175] text-base font-medium disabled:opacity-50"
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </button>
            
            <button
            type="submit"
            disabled={isLoading || !currentOtp || currentOtp.length !== 4}
            className="w-14 h-14 bg-[#53B175] rounded-full flex items-center justify-center shadow-lg hover:bg-[#45a066] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
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
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 19M19 12L12 5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          </div>

        
        </form>
      </div>
    </div>
  );
}

