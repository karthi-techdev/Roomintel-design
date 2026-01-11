import { CpuIcon } from 'lucide-react';
import axiosInstance from './axiosInstance';

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
}

export interface Booking {
  _id: string;
  id: string;
  roomName: string;
  image: string;
  checkIn: string;
  checkOut: string;
  originalCheckIn: string;
  guests: string;
  price: string;
  status: Boolean;
  features?: string[];
  data: Booking[];
}


export interface PaymentInitiateResponse {
  orderId: string;
  amount: number;
  currency: string;
  status: boolean;
  message?: string;
  razorpayOrderId: string;
}

export const bookingService = {

  createBooking: async (bookingData: any): Promise<Booking> => {
    const response = await axiosInstance.post('/site/bookings', bookingData);
    return response.data.data;
  },

  initiatePayment: async (
    amount: number,
    currency: string = 'INR'
  ): Promise<ApiResponse<PaymentInitiateResponse>> => {
    const receiptId = `rcpt_${Date.now()}`;
    const data = {
      amount: amount,
      currency: currency,
      receiptId: receiptId,
    };

    const response = await axiosInstance.post('/payment', data);
    return response.data;
  },

  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await axiosInstance.get('/site/bookings/my-bookings');
    return response.data; // Now correctly typed as { status: boolean; data: Booking[] }
  },

  // Cancel a booking
  cancelBooking: async (bookingId: string): Promise<Booking> => {
    const response = await axiosInstance.patch(
      `/site/bookings/${bookingId}/cancel`
    );
    return response.data;
  },
  getRoomBookings: async (slug: string): Promise<any[]> => {
    const response = await axiosInstance.get(`/bookings/room/${slug}`);
    return response.data?.data || response.data || [];
  },

  getBookedDates: async (): Promise<Array<{
    roomId: string;
    roomSlug: string;
    roomName: string;
    dates: string[];
  }>> => {
    const response = await axiosInstance.get('/site/bookings/booked-dates');
    return response.data.status ? response.data.data : [];
  },
};