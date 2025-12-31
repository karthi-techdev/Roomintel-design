// src/store/useAccommodationStore.ts
import { create } from 'zustand';
import { accommodationService, Accommodation } from '@/api/accomodationService';

interface AccommodationState {
  accommodations: Accommodation[];
  isLoading: boolean;
  error: string | null;

  fetchAccommodations: () => Promise<void>;
}

export const useAccommodationStore = create<AccommodationState>((set) => ({
  accommodations: [],
  isLoading: false,
  error: null,

  fetchAccommodations: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await accommodationService.getAllAccommodations();
      set({ accommodations: data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Failed to load accommodations',
      });
      console.error('Accommodation fetch failed:', err);
    }
  },
}));