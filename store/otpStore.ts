import { create } from 'zustand';
import type { OTPState } from '@/types';

interface OTPStore extends OTPState {
  setPhoneNumber: (phoneNumber: string) => void;
  setOTP: (otp: string) => void;
  resendOTP: () => Promise<void>;
  resetOTP: () => void;
}

export const useOTPStore = create<OTPStore>((set) => ({
  phoneNumber: '',
  otp: '',
  isVerified: false,
  isResending: false,

  setPhoneNumber: (phoneNumber: string) => {
    set({ phoneNumber, otp: '', isVerified: false });
  },

  setOTP: (otp: string) => {
    set({ otp });
  },

  resendOTP: async () => {
    set({ isResending: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isResending: false, otp: '' });
  },

  resetOTP: () => {
    set({ phoneNumber: '', otp: '', isVerified: false, isResending: false });
  },
}));

