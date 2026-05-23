import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LocationState } from '@/types';

interface LocationStore extends LocationState {
  setZone: (zone: string) => void;
  setArea: (area: string) => void;
  resetLocation: () => void;
}

// Mock data for zones and areas
const mockZones = ['Banasree', 'Dhanmondi', 'Gulshan', 'Uttara', 'Mirpur'];
const mockAreas: Record<string, string[]> = {
  Banasree: ['Area 1', 'Area 2', 'Area 3'],
  Dhanmondi: ['Dhanmondi 27', 'Dhanmondi 32', 'Dhanmondi 15'],
  Gulshan: ['Gulshan 1', 'Gulshan 2', 'Gulshan Circle'],
  Uttara: ['Uttara Sector 1', 'Uttara Sector 7', 'Uttara Sector 11'],
  Mirpur: ['Mirpur 1', 'Mirpur 10', 'Mirpur 14'],
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      selectedZone: null,
      selectedArea: null,
      zones: mockZones,
      areas: mockAreas,

      setZone: (zone: string) => {
        set({ selectedZone: zone, selectedArea: null });
      },

      setArea: (area: string) => {
        set({ selectedArea: area });
      },

      resetLocation: () => {
        set({ selectedZone: null, selectedArea: null });
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

