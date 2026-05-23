import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthState } from '@/types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock validation
          if (email && password.length >= 6) {
            const user: User = {
              id: '1',
              username: 'User',
              email,
              phoneNumber: '+8801234567890',
            };
            set({
              isAuthenticated: true,
              user,
              isLoading: false,
            });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      signUp: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock validation
          if (username && email && password.length >= 6) {
            const user: User = {
              id: '1',
              username,
              email,
              phoneNumber: '+8801234567890',
            };
            set({
              isAuthenticated: true,
              user,
              isLoading: false,
            });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      verifyOTP: async (phoneNumber: string, otp: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock validation - accept any 4-digit OTP for demo
          if (otp.length === 4 && /^\d{4}$/.test(otp)) {
            const user: User = {
              id: '1',
              username: 'User',
              email: 'user@example.com',
              phoneNumber,
            };
            set({
              isAuthenticated: true,
              user,
              isLoading: false,
            });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      socialLogin: async (provider: 'google' | 'facebook') => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const user: User = {
            id: '1',
            username: provider === 'google' ? 'Google User' : 'Facebook User',
            email: `${provider}@example.com`,
            phoneNumber: '+8801234567890',
          };
          set({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
          return true;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        // Clear auth state
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        
        // Explicitly clear localStorage for auth and user-specific data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          // Clear cart on logout for security
          localStorage.removeItem('cart-storage');
          // Clear favorites and filters from product store
          const productStorage = localStorage.getItem('product-storage');
          if (productStorage) {
            try {
              const parsed = JSON.parse(productStorage);
              // Keep products and categories, clear user-specific data
              const updated = {
                ...parsed,
                state: {
                  ...parsed.state,
                  favorites: [],
                  selectedCategories: [],
                  selectedBrands: [],
                  searchTerm: '',
                },
              };
              localStorage.setItem('product-storage', JSON.stringify(updated));
            } catch (e) {
              // If parsing fails, just remove it
              localStorage.removeItem('product-storage');
            }
          }
        }
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

