"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck } from 'react-icons/fa';
import { authService } from '../../api/authService';
import { cartService } from '../../api/cartService';
import { bookingService } from '../../api/bookingService';
import countryData from '../../data/countries-states-cities-database/json/countries+states.json';
import { showAlert } from '../../utils/alertStore';

interface RoomCheckoutProps {
    onBack?: () => void;
    onPlaceOrder?: () => void;
}

const RoomCheckout: React.FC<RoomCheckoutProps> = ({ onBack, onPlaceOrder }) => {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cartItem, setCartItem] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Dates (If not in Cart)
    const [dates, setDates] = useState({
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
    });

    // Mapping for Country -> Phone Code (In real app, can come from DB or comprehensive lib)
    const countryCodeMap: any = {
        "India": "+91",
        "United States": "+1",
        "United Kingdom": "+44",
        "Australia": "+61",
        "Afghanistan": "+93",
        "Albania": "+355",
        "Canada": "+1"
        // Add more as needed or use a library
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

    useEffect(() => {
        const loadCheckoutData = async () => {
            const user = authService.getCurrentUser();
            let loadedCartItem: any = null;

            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('room_cart');
                if (stored) {
                    try {
                        loadedCartItem = JSON.parse(stored);
                    } catch (e) { console.error("Parse error", e); }
                }
            }

            if (!loadedCartItem && user) {
                try {
                    const backendCartContainer = await cartService.getCart();
                    const backendItems = backendCartContainer?.data?.items;
                    if (backendItems && backendItems.length > 0) {
                        loadedCartItem = backendItems[0];
                    }
                } catch (e) {
                    console.error("Backend fetch error", e);
                }
            }

            if (loadedCartItem) {
                setCartItem(loadedCartItem);

                // Handle populated roomId
                const roomName = loadedCartItem.roomName || (loadedCartItem.roomId?.name) || "Room";

                setFormData(prev => ({
                    ...prev,
                    name: loadedCartItem?.contact?.name || user?.name || '',
                    email: loadedCartItem?.contact?.email || user?.email || '',
                    phone: loadedCartItem?.contact?.phone || user?.phone || '',
                }));
            }
        };
        loadCheckoutData();
    }, []);

    // Validation Functions
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (value.trim().length > 50) return 'Name must not exceed 50 characters';
                if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters';
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'country') {
            const code = countryCodeMap[value] || "";
            setFormData(prev => ({
                ...prev,
                [name]: value,
                state: '',
                phone: prev.phone ? prev.phone : code
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

    const handlePlaceOrder = async () => {
        if (!cartItem) return showAlert.error("Your cart is empty and valid booking details are missing.");

        // Validate form
        if (!validateForm()) {
            showAlert.error("Please fix the errors in the form before proceeding.");
            return;
        }

        setIsProcessing(true);

        const totalAmount = cartItem.financials?.grandTotal || cartItem.price || 0;
        const roomId = typeof cartItem.roomId === 'object' ? cartItem.roomId._id : cartItem.roomId;

        const bookingPayload = {
            guestName: formData.name,
            guestEmail: formData.email,
            guestPhone: formData.phone,
            room: roomId,
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
            bookingStatus: 'Pending' // Or 'Confirmed' depending on business logic
        };

        try {
            if (paymentMethod === 'cash') {
                // CASH FLOW
                await bookingService.createBooking(bookingPayload);
                const pointsEarned = Math.floor(totalAmount * 10);
                showAlert.success(`Booking Confirmed! Please pay on arrival.\n\n🎉 You earned ${pointsEarned} loyalty points!`);
                finalizeOrder();

            } else if (paymentMethod === 'card') {
                // RAZORPAY / ONLINE FLOW
                const paymentRes = await bookingService.initiatePayment(totalAmount, "INR");

                if (paymentRes.status === false) throw new Error(paymentRes.message);

                const orderData = paymentRes.data; // Expected { razorpayOrderId: ..., amount: ... } provided by paymentService

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure env var is set
                    amount: orderData.amount, // from backend (paise)
                    currency: orderData.currency,
                    name: "RoomIntel Booking",
                    description: `Booking for ${cartItem.roomName || 'Room'}`,
                    order_id: orderData.razorpayOrderId, // Backend returns this
                    handler: async function (response: any) {
                        console.log("Payment Successful:", response);

                        // Update payload with payment success
                        const paidPayload = {
                            ...bookingPayload,
                            paymentStatus: 'Paid',
                            paymentMode: 'Card',
                            // Could enable storing transaction ID in backend if expanded schema
                        };

                        try {
                            await bookingService.createBooking(paidPayload);
                            const pointsEarned = Math.floor(totalAmount * 10);
                            showAlert.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}\n\n🎉 You earned ${pointsEarned} loyalty points!`);
                            finalizeOrder();
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

    const finalizeOrder = async () => {
        // Clear Cart
        localStorage.removeItem('room_cart');
        setCartItem(null);
        await cartService.clearCart();

        // Redirect
        router.push('/'); // Or to a 'success' page
        setIsProcessing(false);
    };

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

                            {/* NEW: DATES SECTION */}
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

                                {cartItem ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4 text-sm">
                                            <div>
                                                <div className="font-bold text-gray-300">{cartItem.roomName}</div>
                                                <div className="text-xs text-gray-400">x {cartItem.guestDetails?.rooms || 1} Rooms</div>
                                            </div>
                                            <span className="font-bold text-[#EDA337]">${cartItem.financials?.baseTotal?.toLocaleString()}</span>
                                        </div>

                                        {cartItem.financials?.extrasTotal > 0 && (
                                            <div className="flex justify-between items-start mb-2 text-sm text-gray-400">
                                                <span>Extras</span>
                                                <span>+${cartItem.financials.extrasTotal.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {cartItem.financials?.discountAmount > 0 && (
                                            <div className="flex justify-between items-start mb-2 text-sm text-green-400">
                                                <span>Discount ({cartItem.promoCode})</span>
                                                <span>-${cartItem.financials.discountAmount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-2 text-sm text-gray-400">
                                            <span>Taxes & Fees</span>
                                            <span>+${((cartItem.financials?.taxes || 0) + (cartItem.financials?.serviceCharge || 0)).toLocaleString()}</span>
                                        </div>

                                        <div className="w-full h-[1px] bg-gray-600 mb-6"></div>

                                        <div className="flex justify-between items-center mb-8">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-xl font-bold text-[#EDA337]">${cartItem.financials?.grandTotal?.toLocaleString()}</span>
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
                                    disabled={!cartItem || isProcessing}
                                    className={`w-full bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold py-4 text-xs uppercase tracking-[0.15em] rounded-sm transition-all shadow-md hover:shadow-lg ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
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