// src/store/useBookingStore.ts
import { create } from 'zustand';
import { bookingService } from '@/api/bookingService';
import type { Booking } from '@/api/bookingService'; // if Booking type is exported

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
      const response = await bookingService.getMyBookings();
      
      // Check if the request was successful and extract the actual bookings array
      if (response.status && Array.isArray(response.data)) {
        set({ bookings: response.data, isLoading: false });
      } else {
        throw new Error(response.message || 'Invalid response from server');
      }
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Failed to load bookings',
      });
      console.error('Booking fetch failed:', err);
    }
  },
}));