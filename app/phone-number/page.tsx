'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneNumberSchema, type PhoneNumberFormData } from '@/lib/zod-schemas';
import { Navbar } from '@/components/layout/Navbar';
import { useOTPStore } from '@/store/otpStore';
import { useAuthStore } from '@/store/authStore';
import { CountrySelector, type Country } from '@/components/ui/CountrySelector';

const defaultCountry: Country = {
  name: 'Bangladesh',
  code: 'BD',
  dialCode: '+880',
  flag: 'https://flagcdn.com/w40/bd.png',
};

export default function PhoneNumberPage() {
  const router = useRouter();
  const { setPhoneNumber: setStorePhoneNumber } = useOTPStore();
  const { isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PhoneNumberFormData>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const watchedPhone = watch('phoneNumber');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    setPhoneNumber(value);
    setValue('phoneNumber', value, { shouldValidate: true });
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const onSubmit = (data: PhoneNumberFormData) => {
    const fullPhoneNumber = `${selectedCountry.dialCode}${data.phoneNumber}`;
    setStorePhoneNumber(fullPhoneNumber);
    router.push('/otp');
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div 
        style={{ backgroundImage: 'url(/assets/headerbackground.png)' }}
        className="bg-cover bg-center bg-no-repeat h-80 absolute top-0 left-0 w-full z-0"
      >
        <Navbar showBack title="" />
      </div>
      
      <div className="px-6 pt-[100px] relative z-10 ">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 relative z-10">
          Enter your mobile number
        </h1>
        <p className="text-gray-500 text-base mb-8 relative z-10">Mobile Number</p>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
          <div className="flex items-center border-b-2 border-gray-300 pb-3 mb-12 gap-3 relative z-10">
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={handleCountrySelect}
            />
            <input
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              {...register('phoneNumber', {
                onChange: handlePhoneChange,
              })}
              className="flex-1 text-xl font-medium bg-transparent outline-none text-gray-900 w-[100%]"
              placeholder="mobile number"
            />
          </div>
          
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 mb-4">{errors.phoneNumber.message}</p>
          )}

<div className='flex justify-end items-center'>
<button
            type="submit"
            className=" w-14 h-14 bg-[#53B175] rounded-full flex items-center justify-center shadow-lg hover:bg-[#45a066] transition-colors disabled:opacity-50"
            disabled={!!errors.phoneNumber || !watchedPhone || watchedPhone.length < 7}
          >
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
          </button>
</div>
      
  

        </form>
      </div>
    </div>
  );
}

