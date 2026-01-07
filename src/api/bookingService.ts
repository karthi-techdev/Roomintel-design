import { CpuIcon } from 'lucide-react';
import axiosInstance from './axiosInstance';

export interface Booking {
  id: string;
  roomName: string;
  image: string;
  checkIn: string;          
  checkOut: string;         
  originalCheckIn: string;  
  guests: string;           
  price: string;            
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'; 
  features?: string[];   
}


export interface PaymentInitiateResponse {
  orderId: string;         
  amount: number;
  currency: string;

}

export const bookingService = {
 
  createBooking: async (bookingData: any): Promise<Booking> => {
    const response = await axiosInstance.post('/site/bookings', bookingData);
    return response.data;
  },

  initiatePayment: async (
    amount: number,
    currency: string = 'INR'
  ): Promise<PaymentInitiateResponse> => {
    const receiptId = `rcpt_${Date.now()}`;
    const data = {
      orederAmount: amount,    
      orederCurrency: currency,
      orederId: receiptId,
    };

    const response = await axiosInstance.post('/payment', data);
    return response.data;
  },

  // Get logged-in user's bookings
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await axiosInstance.get('/site/bookings/my-bookings');
    return response.data;
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
    console.log('Fetched room bookings:', response.data);  
    return response.data?.data || response.data || [];
  },
  
};