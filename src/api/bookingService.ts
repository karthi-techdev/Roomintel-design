
import axiosInstance from './axiosInstance';

export const bookingService = {
    // Create a new booking
    createBooking: async (bookingData: any) => {
        const response = await axiosInstance.post('/site/bookings', bookingData);
        return response.data;
    },

    // Initiate Payment (Get Order ID for Razorpay)
    initiatePayment: async (amount: number, currency: string = "INR") => {
        // Generates a receipt ID (can be random or match a booking temp ID)
        const receiptId = `rcpt_${Date.now()}`;
        const data = {
            orederAmount: amount, // Note: Backend typo "orederAmount"
            orederCurrency: currency,
            orederId: receiptId
        };
        const response = await axiosInstance.post('/payment', data);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await axiosInstance.get('/site/bookings/my-bookings');
        return response.data;
    },

    cancelBooking: async (bookingId: string) => {
        const response = await axiosInstance.patch(`/site/bookings/${bookingId}/cancel`);
        return response.data;
    }
};
