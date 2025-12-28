"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { authService } from '../../api/authService';
import { cartService } from '../../api/cartService';

interface RoomCheckoutProps {
    onBack: () => void;
    onPlaceOrder: () => void;
}

const RoomCheckout: React.FC<RoomCheckoutProps> = ({ onBack, onPlaceOrder }) => {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cartItem, setCartItem] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        country: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        email: 'vs@yopmail.com',
        phone: '09789577062',
        notes: ''
    });

    useEffect(() => {
        const loadCheckoutData = async () => {
            // 1. Get User Data
            const user = authService.getCurrentUser();
            let loadedCartItem: any = null;

            // 2. Try LocalStorage FIRST
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('room_cart');
                if (stored) {
                    try {
                        loadedCartItem = JSON.parse(stored);
                    } catch (e) { console.error("Parse error", e); }
                }
            }

            // 3. If User Logged In, checking backend might be redundant IF we assume Cart Page syncs it.
            // BUT, for safety, let's trust LocalStorage as the "immediate" state from Cart Page.
            // If LocalStorage is empty but user is logged in, MAYBE fetch from backend (e.g. cross-device).
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
                // 3. Populate Form (Cart takes precedence for contact info if set, otherwise User)
                setFormData(prev => ({
                    ...prev,
                    name: loadedCartItem?.contact?.name || user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '') || '',
                    email: loadedCartItem?.contact?.email || user?.email || '',
                    phone: loadedCartItem?.contact?.phone || user?.phone || '',
                }));
            }
        };
        loadCheckoutData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        const formData: any = {
            "orederId": "ORDER_123450",
            "orederAmount": 80,
            "orederCurrency": "INR",
            "orederDetails": {
                "customerId": "rahul_05",
                "customerEmail": "test@gmail.com",
                "customerPhone": "9361428950"
            }
        }
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTIxNjJiZGI4YzRjZGUxZDllZjJiN2QiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGVJZCI6IjY5MjE2Mjg1YjhjNGNkZTFkOWVmMmFkOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NjQwMDI4MiwiZXhwIjoxNzY2NDg2NjgyfQ.Wc4xytWim_iCQeGm4HjeE3ZgKWmZDJSahJ6KmlOFWT8'
        const headers: any = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
            }
        }
        try {
            const res = await axios.post("http://localhost:5000/api/v1/payment", formData, headers);
            const order = await res.data;
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.orederAmount * 100, // Amount in paise
                currency: order.orederCurrency,
                name: "RoomIntel",
                description: "Booking Payment",
                order_id: order.razorpayOrderId,
                handler: function (response: any) {
                    console.log("Payment Successful:", response);
                    alert("Payment ID: " + response.razorpay_payment_id);
                },
                prefill: {
                    name: "Rahul",
                    email: formData.orederDetails.customerEmail,
                    contact: formData.orederDetails.customerPhone,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            if (typeof window !== "undefined" && window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert("Razorpay SDK not loaded. Please check your internet connection.");
            }
        } catch (error: any) {
            console.error("Payment API error:", error.response?.data || error.message);
        }

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
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={onBack}>Home</span>
                        <span>/</span>
                        <span className="text-white">Room Checkout</span>
                    </div>
                </div>
            </div>

            <div className="bg-white max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16 rounded-[20px]">

                <div className="flex flex-col lg:flex-row gap-12 relative">

                    {/* --- LEFT COLUMN: BILLING DETAILS --- */}
                    <div className="w-full lg:w-2/3">
                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-8 pb-4 border-b border-gray-200">Billing Address</h2>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm appearance-none cursor-pointer"
                                >
                                    <option value="">Select your country</option>
                                    <option value="US">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="IN">India</option>
                                    <option value="AU">Australia</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Street address"
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Town / City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Postcode</label>
                                <input
                                    type="text"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full h-32 bg-white border border-gray-300 rounded-sm p-4 text-sm text-[#283862] focus:outline-none focus:border-[#EDA337] shadow-sm resize-none"
                                    placeholder="Notes about your order, e.g. special notes for delivery."
                                ></textarea>
                            </div>

                        </form>
                    </div>

                    {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24">
                            <div className="bg-[#283862] text-white p-8 rounded-sm shadow-xl border border-gray-700/50">
                                <h3 className="text-2xl noto-geogia-font font-bold mb-6 pb-4 border-b border-gray-600">Your Order</h3>

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
                                                <span>Discount</span>
                                                <span>-${cartItem.financials.discountAmount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {/* Taxes & fees usually added to grand total, show breakdown if needed */}
                                        <div className="flex justify-between items-start mb-2 text-sm text-gray-400">
                                            <span>Taxes & Fees</span>
                                            <span>+${((cartItem.financials?.taxes || 0) + (cartItem.financials?.serviceCharge || 0)).toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between items-center mb-6 text-xs text-gray-400">
                                            <span>Booking Date: {new Date().toLocaleDateString()}</span>
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
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cash"
                                            checked={paymentMethod === 'cash'}
                                            onChange={() => setPaymentMethod('cash')}
                                            className="hidden"
                                        />
                                        <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>Cash</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-[#EDA337]' : 'border-gray-500'}`}>
                                            {paymentMethod === 'paypal' && <div className="w-2 h-2 rounded-full bg-[#EDA337]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')}
                                            className="hidden"
                                        />
                                        <span className={`text-sm font-medium ${paymentMethod === 'paypal' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>Paypal</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#EDA337]' : 'border-gray-500'}`}>
                                            {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#EDA337]"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                            className="hidden"
                                        />
                                        <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>Credit Card</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    className="w-full bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold py-4 text-xs uppercase tracking-[0.15em] rounded-sm transition-all shadow-md hover:shadow-lg"
                                >
                                    Place Order
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