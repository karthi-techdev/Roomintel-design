// src/store/useBookingStore.ts
import { create } from 'zustand';
import { Booking, bookingService, } from '@/api/bookingService';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await bookingService.getMyBookings();
      set({ bookings: data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Failed to load bookings',
      });
      console.error('Booking fetch failed:', err);
    }
  },
}));