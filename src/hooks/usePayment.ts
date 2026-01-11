import { useState } from 'react';
import { bookingService } from '@/api/bookingService';
import { showAlert } from '@/utils/alertStore';
import { useSettingsStore } from '@/store/useSettingsStore';

interface PaymentOptions {
    amount: number;
    currency?: string;
    name?: string;
    email?: string;
    phone?: string; // Changed from contact to phone to match Booking interface
    description?: string;
    bookingId?: string; // Optional: for reconciling specific bookings
    onSuccess: (response: any) => void;
    onFailure?: (error: any) => void;
}

export const usePayment = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { settings } = useSettingsStore();

    const processPayment = async ({
        amount,
        currency,
        name,
        email,
        phone,
        description,
        onSuccess,
        onFailure,
    }: PaymentOptions) => {
        setIsProcessing(true);
        try {
            if (!amount || amount <= 0) {
                throw new Error("Invalid amount");
            }

            const payCurrency = currency || settings?.defaultCurrency || 'INR';

            // 1. Initiate Payment with Backend
            const paymentRes = await bookingService.initiatePayment(amount, payCurrency);

            if (paymentRes.status === false) {
                throw new Error(paymentRes.message || "Failed to initiate payment");
            }

            const orderData = paymentRes.data;

            // 2. Configure Razorpay Options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Avensstay Booking",
                description: description || "Payment for Booking",
                order_id: orderData.razorpayOrderId,
                handler: function (response: any) {
                    setIsProcessing(false);
                    onSuccess(response);
                },
                prefill: {
                    name: name || '',
                    email: email || '',
                    contact: phone || '',
                },
                theme: {
                    color: "#EDA337",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        showAlert.info("Payment cancelled");
                        if (onFailure) onFailure(new Error("Payment cancelled by user"));
                    }
                }
            };

            // 3. Open Razorpay
            if (typeof window !== "undefined" && (window as any).Razorpay) {
                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    setIsProcessing(false);
                    const errorMsg = response.error.description || "Payment Failed";
                    showAlert.error(errorMsg);
                    if (onFailure) onFailure(response.error);
                });
                rzp.open();
            } else {
                throw new Error("Razorpay SDK not loaded. Please check your internet connection.");
            }

        } catch (error: any) {
            setIsProcessing(false);
            const msg = error.message || "Payment processing failed";
            showAlert.error(msg);
            if (onFailure) onFailure(error);
        }
    };

    return { processPayment, isProcessing };
};
