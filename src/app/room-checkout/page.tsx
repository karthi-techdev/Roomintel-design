"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { authService } from '../../api/authService';
import { bookingService } from '../../api/bookingService';
import countryData from '../../data/countries-states-cities-database/json/countries+states.json';
import { showAlert } from '../../utils/alertStore';
import { useCartStore } from '@/store/useCartStore';
import { siteService } from '../../api/siteService';

interface RoomCheckoutProps {
    onBack?: () => void;
    onPlaceOrder?: () => void;
}

const RoomCheckout: React.FC<RoomCheckoutProps> = ({ onBack, onPlaceOrder }) => {
    const router = useRouter();

    // --- STORE ---
    const { cartItems, fetchCart, clearCart } = useCartStore();

    // --- STATE ---
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<any>(null);
    const [availableServices, setAvailableServices] = useState<any[]>([]);

    // Aggregate calculations for all items (same as cart page)
    const totals = useMemo(() => {
        const base = cartItems.reduce((acc: any, item: any) => {
            const roomPrice = item.price || 0;
            const config = item.rateConfig;
            const occupancySurcharge = config ? (
                (Math.max(0, (item.guestDetails?.adults || 2) - (config.baseAdults ?? 2)) * (config.extraAdultPrice ?? 0)) +
                (Math.max(0, (item.guestDetails?.children || 0) - (config.baseChildren ?? 0)) * (config.extraChildPrice ?? 0))
            ) : 0;
            const roomQuantity = item.guestDetails?.rooms || 1;
            const itemBaseTotal = (roomPrice + occupancySurcharge) * roomQuantity;

            // Calculate extras if availableServices is loaded, else fallback to essentials
            let itemExtrasTotal = item.financials?.extrasTotal || 0;
            if (availableServices.length > 0 && item.selectedExtras) {
                itemExtrasTotal = item.selectedExtras.reduce((eAcc: number, extraName: string) => {
                    const extra = availableServices.find(e => e.title === extraName);
                    return eAcc + (extra ? extra.price : 0);
                }, 0);
            }

            return {
                baseTotal: acc.baseTotal + itemBaseTotal,
                extrasTotal: acc.extrasTotal + itemExtrasTotal,
                discountAmount: acc.discountAmount + (item.financials?.discountAmount || 0),
                roomsCount: acc.roomsCount + roomQuantity
            };
        }, {
            baseTotal: 0,
            extrasTotal: 0,
            discountAmount: 0,
            roomsCount: 0
        });

        const taxes = base.baseTotal * 0.10;
        const serviceCharge = base.baseTotal * 0.05;
        const grandTotal = Math.max(0, base.baseTotal + base.extrasTotal + taxes + serviceCharge - base.discountAmount);

        return {
            ...base,
            taxes,
            serviceCharge,
            grandTotal
        };
    }, [cartItems, availableServices]);

    const fmt = (amount: number) => `₹${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const cartItem = cartItems.length > 0 ? cartItems[0] : null;

    // Dates
    const [dates, setDates] = useState({
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    });

    // Mapping for Country -> Phone Code
    const countryCodeMap: any = {
        "India": "+91",
        "United States": "+1",
        "United Kingdom": "+44",
        "Australia": "+61",
        "Afghanistan": "+93",
        "Albania": "+355",
        "Canada": "+1"
    };

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        country: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        email: '',
        phone: '',
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const availableStates = formData.country
        ? countryData.find((c: any) => c.name === formData.country)?.states || []
        : [];



    // Load Cart & Services
    useEffect(() => {
        fetchCart();
        const fetchServices = async () => {
            try {
                const res = await siteService.getServices();
                if (res && res.success) {
                    setAvailableServices(res.data);
                }
            } catch (e) {
                console.error("Error fetching services", e);
            }
        };
        fetchServices();
    }, []);
    // --- FORM VALIDITY CHECK ---
    const isFormValid = useMemo(() => {
        if (cartItems.length === 0) return false;

        // Required fields
        if (!formData.name.trim()) return false;
        if (!formData.email.trim()) return false;
        if (!formData.phone.trim()) return false;

        // Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return false;

        // Phone basic length check
        const cleanedPhone = formData.phone.replace(/\s/g, '');
        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) return false;

        // Date validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkInDate = new Date(dates.checkIn);
        const checkOutDate = new Date(dates.checkOut);

        if (checkInDate < today) return false;
        if (checkOutDate <= checkInDate) return false;

        return true;
    }, [formData.name, formData.email, formData.phone, dates.checkIn, dates.checkOut, cartItem]);
    // Load Data from Cart & User
    useEffect(() => {
        if (cartItem) {
            // Set Dates from Cart if available
            if (cartItem.checkIn && cartItem.checkOut) {
                setDates({
                    checkIn: new Date(cartItem.checkIn).toISOString().split('T')[0],
                    checkOut: new Date(cartItem.checkOut).toISOString().split('T')[0]
                });
            }

            // Set User Data
            const user = authService.getCurrentUser(); // Still good to check user for fallback
            // Cart might have contact info if previously saved? Not in current CartItem but typically user data persists

            setFormData(prev => {
                // If form is already filled, don't overwrite with defaults unless empty
                if (prev.email) return prev;

                return {
                    ...prev,
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                };
            });
        }
    }, [cartItem]);


    // --- VALIDATION ---
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (value.trim().length > 50) return 'Name must not exceed 50 characters';
                // if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters'; 
                return '';

            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';

            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number (10-15 digits)';
                return '';

            case 'postcode':
                if (value && !/^[a-zA-Z0-9\s\-]{3,10}$/.test(value)) return 'Please enter a valid postcode';
                return '';

            default:
                return '';
        }
    };

    const validateDates = (): { checkIn: string; checkOut: string } => {
        const errors = { checkIn: '', checkOut: '' };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkInDate = new Date(dates.checkIn);
        const checkOutDate = new Date(dates.checkOut);

        if (checkInDate < today) {
            errors.checkIn = 'Check-in date cannot be in the past';
        }

        if (checkOutDate <= checkInDate) {
            errors.checkOut = 'Check-out date must be after check-in date';
        }

        return errors;
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate required fields
        newErrors.name = validateField('name', formData.name);
        newErrors.email = validateField('email', formData.email);
        newErrors.phone = validateField('phone', formData.phone);
        newErrors.postcode = validateField('postcode', formData.postcode);

        // Validate dates
        const dateErrors = validateDates();
        newErrors.checkIn = dateErrors.checkIn;
        newErrors.checkOut = dateErrors.checkOut;

        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);
        setTouched({
            name: true,
            email: true,
            phone: true,
            checkIn: true,
            checkOut: true,
            postcode: true
        });

        return Object.keys(newErrors).length === 0;
    };

    // --- HANDLERS ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'country') {
            const code = countryCodeMap[value] || "";
            setFormData(prev => ({
                ...prev,
                [name]: value,
                state: '',
                phone: (!prev.phone || prev.phone === code) ? code : prev.phone // Simple logic to help user
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (fieldName: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, formData[fieldName as keyof typeof formData] as string);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDates(prev => ({ ...prev, [name]: value }));

        // Clear date errors when user changes dates
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDateBlur = () => {
        setTouched(prev => ({ ...prev, checkIn: true, checkOut: true }));
        const dateErrors = validateDates();
        setErrors(prev => ({ ...prev, ...dateErrors }));
    };

    const finalizeOrder = async (bookingData: any) => {
        await clearCart();
        setConfirmedBookingDetails(bookingData);
        setIsBookingConfirmed(true);
        setIsProcessing(false);
        // Scroll to top to see the confirmation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return showAlert.error("Your cart is empty and valid booking details are missing.");

        // Validate form
        if (!validateForm()) {
            showAlert.error("Please fix the errors in the form before proceeding.");
            return;
        }

        setIsProcessing(true);

        const totalAmount = totals.grandTotal;

        // Prepare rooms array for backend
        const bookedRooms = cartItems.map(item => ({
            roomId: typeof item.roomId === 'object' ? item.roomId._id : item.roomId,
            roomName: item.roomName,
            price: item.financials?.grandTotal || item.price,
            checkIn: item.checkIn || dates.checkIn,
            checkOut: item.checkOut || dates.checkOut,
            guestDetails: item.guestDetails
        }));

        const primaryRoomId = bookedRooms[0]?.roomId;

        const bookingPayload = {
            guestName: formData.name,
            guestEmail: formData.email,
            guestPhone: formData.phone,
            room: primaryRoomId,
            rooms: bookedRooms,
            checkIn: dates.checkIn,
            checkOut: dates.checkOut,
            totalAmount: totalAmount,
            specialRequests: formData.notes,
            billingAddress: {
                street: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zipCode: formData.postcode
            },
            paymentStatus: 'Pending',
            paymentMode: paymentMethod === 'cash' ? 'Cash' : 'Card',
            bookingStatus: 'Pending'
        };

        try {
            if (paymentMethod === 'cash') {
                // CASH FLOW
                const bookingRes = await bookingService.createBooking(bookingPayload);
                const pointsEarned = Math.floor(totalAmount * 10);

                await finalizeOrder({
                    id: bookingRes?.data?._id || 'N/A',
                    amount: totalAmount,
                    points: pointsEarned,
                    paymentMode: 'Cash'
                });

            } else if (paymentMethod === 'card') {
                // RAZORPAY / ONLINE FLOW
                const paymentRes = await bookingService.initiatePayment(totalAmount, "INR");

                if (paymentRes.status === false) throw new Error(paymentRes.message);

                const orderData = paymentRes.data;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "RoomIntel Booking",
                    description: `Multiple Room Booking (${totals.roomsCount} rooms)`,
                    order_id: orderData.razorpayOrderId,
                    handler: async function (response: any) {
                        console.log("Payment Successful:", response);

                        // Update payload with payment success
                        const paidPayload = {
                            ...bookingPayload,
                            paymentStatus: 'Paid',
                            paymentMode: 'Card',
                        };

                        try {
                            const bookingRes = await bookingService.createBooking(paidPayload);
                            const pointsEarned = Math.floor(totalAmount * 10);

                            await finalizeOrder({
                                id: bookingRes?.data?._id || 'N/A',
                                amount: totalAmount,
                                points: pointsEarned,
                                paymentMode: 'Card',
                                paymentId: response.razorpay_payment_id
                            });
                        } catch (err) {
                            console.error("Failed to save booking after payment", err);
                            showAlert.error("Payment successful but booking failed to save. Please contact support.");
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: {
                        color: "#EDA337",
                    },
                };

                if (typeof window !== "undefined" && (window as any).Razorpay) {
                    const rzp = new (window as any).Razorpay(options);
                    rzp.on('payment.failed', function (response: any) {
                        showAlert.error("Payment Failed: " + response.error.description);
                        setIsProcessing(false);
                    });
                    rzp.open();
                } else {
                    showAlert.error("Razorpay SDK not loaded. Check connection.");
                    setIsProcessing(false);
                }
            } else {
                showAlert.warning("Selected payment method not supported yet.");
                setIsProcessing(false);
            }

        } catch (error: any) {
            console.error("Order processing error:", error);
            showAlert.error("Order failed: " + (error.response?.data?.message || error.message));
            setIsProcessing(false);
        }
    };


    if (isBookingConfirmed) {
        return (
            <div className="w-full pb-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-[700px] w-full bg-white rounded-[30px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    {/* Top Accent Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-[#EDA337] via-[#f1bb6d] to-[#EDA337]"></div>

                    <div className="p-8 md:p-12 text-center">
                        {/* Success Icon */}
                        <div className="mb-8 relative inline-block">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#EDA337] rounded-full flex items-center justify-center text-white border-4 border-white">
                                <span className="text-lg">✨</span>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl noto-geogia-font font-bold text-[#283862] mb-4">
                            Booking Confirmed!
                        </h2>
                        <p className="text-gray-500 mb-10 max-w-md mx-auto">
                            Thank you for choosing RoomIntel. Your reservation has been successfully processed and a confirmation email is on its way.
                        </p>

                        {/* Details Card */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 mb-10 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Booking ID</label>
                                    <p className="font-mono text-[#283862] font-semibold">#{confirmedBookingDetails?.id?.slice(-8).toUpperCase() || 'RT-XXXXX'}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Total Amount</label>
                                    <p className="text-[#EDA337] font-bold">{fmt(confirmedBookingDetails?.amount || 0)}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Points Earned</label>
                                    <p className="text-green-600 font-bold">🎉 +{confirmedBookingDetails?.points || 0} Points</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Payment Status</label>
                                    <p className="text-blue-600 font-semibold">{confirmedBookingDetails?.paymentMode === 'Cash' ? 'Pay on Arrival' : 'Paid Online'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-8 py-4 bg-[#283862] text-white font-bold rounded-xl hover:bg-[#1a2542] transition-all transform hover:scale-105 active:scale-95 text-sm uppercase tracking-wider shadow-lg"
                            >
                                View Dashboard
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="px-8 py-4 bg-white border-2 border-[#283862] text-[#283862] font-bold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-medium">
                        <span>Need help? Contact support</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Secure Booking System
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" w-full   pb-20 min-h-screen">

            {/* --- HEADER --- */}
            <div className="bg-[#283862] pt-32 pb-16 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl noto-geogia-font font-bold mb-4">Room Checkout</h1>
                    <div className="flex justify-center items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300">
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={() => router.push('/')}>Home</span>
                        <span>/</span>
                        <span className="text-white">Room Checkout</span>
                    </div>
                </div>
            </div>

            <div className="bg-white max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16 rounded-[20px]">

                <div className="flex flex-col lg:flex-row gap-12 relative">

                    {/* --- LEFT COLUMN: BILLING DETAILS --- */}
                    <div className="w-full lg:w-2/3">
                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-8 pb-4 border-b border-gray-200">Billing & Booking Details</h2>

                        <form className="space-y-6">

                            {/* DATES SECTION */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check-In Date *</label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        value={dates.checkIn}
                                        onChange={handleDateChange}
                                        onBlur={handleDateBlur}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full bg-white border rounded-sm p-3 text-sm text-[#283862] focus:outline-none ${touched.checkIn && errors.checkIn
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-[#EDA337]'
                                            }`}
                                    />
                                    {touched.checkIn && errors.checkIn && (
                                        <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check-Out Date *</label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        value={dates.checkOut}
                                        onChange={handleDateChange}
                                        onBlur={handleDateBlur}
                                        min={dates.checkIn}
                                        className={`w-full bg-white border rounded-sm p-3 text-sm text-[#283862] focus:outline-none ${touched.checkOut && errors.checkOut
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-[#EDA337]'
                                            }`}
                                    />
                                    {touched.checkOut && errors.checkOut && (
                                        <p className="text-xs text-red-500 mt-1">{errors.checkOut}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('name')}
                                        className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm ${touched.name && errors.name
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-[#EDA337]'
                                            }`}
                                    />
                                    {touched.name && errors.name && (
                                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('email')}
                                        className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm ${touched.email && errors.email
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-[#EDA337]'
                                            }`}
                                    />
                                    {touched.email && errors.email && (
                                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('phone')}
                                    placeholder="+1 234 567 8900"
                                    className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm ${touched.phone && errors.phone
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-[#EDA337]'
                                        }`}
                                />
                                {touched.phone && errors.phone && (
                                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street address" className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
                                    <select name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm appearance-none cursor-pointer">
                                        <option value="">Select your country</option>
                                        {countryData.map((c: any, i: number) => (
                                            <option key={i} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                                    {availableStates.length > 0 ? (
                                        <select name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm appearance-none cursor-pointer">
                                            <option value="">Select State</option>
                                            {availableStates.map((s: any, i: number) => (
                                                <option key={i} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm" />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Town / City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Postcode</label>
                                    <input
                                        type="text"
                                        name="postcode"
                                        value={formData.postcode}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('postcode')}
                                        className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm ${touched.postcode && errors.postcode
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-[#EDA337]'
                                            }`}
                                    />
                                    {touched.postcode && errors.postcode && (
                                        <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Special Requests</label>
                                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full h-32 bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm resize-none" placeholder="Notes about your stay, e.g. dietary requirements, late check-in." />
                            </div>
                        </form>
                    </div>

                    {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24">
                            <div className="bg-[#283862] text-white p-8 rounded-sm shadow-xl border border-gray-700/50">
                                <h3 className="text-2xl noto-geogia-font font-bold mb-6 pb-4 border-b border-gray-600">Your Booking</h3>

                                {cartItems.length > 0 ? (
                                    <>
                                        {cartItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start mb-4 text-sm">
                                                <div>
                                                    <div className="font-bold text-gray-300">{item.roomName}</div>
                                                    <div className="text-xs text-gray-400">x {item.guestDetails?.rooms || 1} Rooms</div>
                                                </div>
                                                <span className="font-bold text-[#EDA337]">{fmt(item.financials?.baseTotal || item.price)}</span>
                                            </div>
                                        ))}

                                        {totals.extrasTotal > 0 && (
                                            <div className="flex justify-between items-start mb-2 text-sm text-gray-400">
                                                <span>Extras</span>
                                                <span>+{fmt(totals.extrasTotal)}</span>
                                            </div>
                                        )}
                                        {totals.discountAmount > 0 && (
                                            <div className="flex justify-between items-start mb-2 text-sm text-green-400">
                                                <span>Discount</span>
                                                <span>-{fmt(totals.discountAmount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-2 text-sm text-gray-400">
                                            <span>Taxes & Fees</span>
                                            <span>+{fmt(totals.taxes + totals.serviceCharge)}</span>
                                        </div>

                                        <div className="w-full h-[1px] bg-gray-600 mb-6"></div>

                                        <div className="flex justify-between items-center mb-8">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-xl font-bold text-[#EDA337]">{fmt(totals.grandTotal)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-400 text-sm mb-6">Your cart is empty.</div>
                                )}

                                <h3 className="text-xl noto-geogia-font font-bold mb-6">Payment Method</h3>

                                <div className="space-y-4 mb-8">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cash' ? 'border-[#EDA337]' : 'border-gray-500'}`}>
                                            {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-[#EDA337]"></div>}
                                        </div>
                                        <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="hidden" />
                                        <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>Pay on Arrival (Cash/Card)</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#EDA337]' : 'border-gray-500'}`}>
                                            {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#EDA337]"></div>}
                                        </div>
                                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                        <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>Online Payment (Razorpay)</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold py-4 text-xs uppercase tracking-[0.15em] rounded-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
                                >
                                    {isProcessing ? 'Processing...' : 'Place Booking'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default RoomCheckout;