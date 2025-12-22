"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Add this import
import {
    FaTrash,
    FaMinus,
    FaPlus,
    FaCalendarDay,
    FaUserFriends,
    FaChild,
    FaCheckCircle,
    FaShieldAlt,
    FaCreditCard,
    FaArrowLeft,
    FaShoppingCart,
    FaTimes
} from 'react-icons/fa';

export default function RoomCart() {
    const router = useRouter(); // Add this line
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(1);
    const [showMobileCheckout, setShowMobileCheckout] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    const roomPrice = 6510;
    const total = roomPrice;

    // Handle checkout navigation
    const handleCheckout = () => {
        router.push('/room-checkout');
    };

    // Handle scroll to show/hide floating checkout button
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 768) {
                const scrollY = window.scrollY;
                setShowMobileCheckout(scrollY > 300);
            } else {
                setShowMobileCheckout(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
                <div className="flex items-center justify-between p-4">
                    <button 
                        onClick={() => router.back()} // Optional: Add back navigation
                        className="flex items-center gap-2 text-gray-700"
                    >
                        <FaArrowLeft className="text-lg" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="font-bold text-[#283862]">Room Cart</h1>
                        <div className="text-xs text-gray-500">1 item</div>
                    </div>
                    <button 
                        onClick={() => setShowSummaryModal(true)}
                        className="relative"
                    >
                        <FaShoppingCart className="text-[#c23535] text-xl" />
                        <span className="absolute -top-2 -right-2 bg-[#c23535] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            1
                        </span>
                    </button>
                </div>
            </div>

            {/* --- HEADER --- */}
            <div className="bg-[#283862] pt-24 lg:pt-32 pb-16 lg:pb-26 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop" 
                        className="w-full h-full object-cover" alt="Header" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold mb-4">Room Cart</h1>
                    <div className="flex justify-center items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300">
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors">Home</span>
                        <span>/</span>
                        <span className="text-white">Room Cart</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 mt-16 lg:mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Cart Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Room Card */}
                        <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
                            <div className="p-4 sm:p-6">
                                {/* Top Section */}
                                <div className="flex items-start justify-between mb-4 lg:mb-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="px-3 py-1 bg-[#c23535]/10 text-[#c23535] text-xs font-bold rounded-full">
                                                MOST POPULAR
                                            </span>
                                            <span className="hidden sm:inline text-sm text-gray-500">•</span>
                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                                <FaCalendarDay className="text-[#c23535]" />
                                                13 Dec 2025
                                            </span>
                                        </div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-[#283862]">Premium City View Suite</h2>
                                        <p className="text-gray-600 mt-2 text-sm lg:text-base">Luxurious suite with panoramic city views and premium amenities</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-[#c23535] p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors flex-shrink-0 ml-2">
                                        <FaTrash className="text-lg" />
                                    </button>
                                </div>

                                {/* Room Details Grid */}
                                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-6">
                                    {/* Image */}
                                    <div className="lg:col-span-1">
                                        <div className="relative h-56 sm:h-64 lg:h-72 rounded-lg overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"
                                                alt="Room"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                    ${roomPrice}/night
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guest Controls */}
                                    <div className="lg:col-span-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 font-medium text-gray-700">
                                                    <FaUserFriends className="text-[#c23535]" />
                                                    Adults
                                                </label>
                                                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:text-[#c23535] hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <div className="text-center">
                                                        <div className="text-2xl sm:text-3xl font-bold text-[#283862]">{adults}</div>
                                                        <div className="text-xs text-gray-500">Adult{adults !== 1 ? 's' : ''}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => setAdults(adults + 1)}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:text-[#c23535] hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 font-medium text-gray-700">
                                                    <FaChild className="text-[#c23535]" />
                                                    Children
                                                </label>
                                                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:text-[#c23535] hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <div className="text-center">
                                                        <div className="text-2xl sm:text-3xl font-bold text-[#283862]">{children}</div>
                                                        <div className="text-xs text-gray-500">Child{children !== 1 ? 'ren' : ''}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => setChildren(children + 1)}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:text-[#c23535] hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Room Features */}
                                        <div className="mt-6 lg:mt-8 grid grid-cols-2 gap-3">
                                            {[
                                                { icon: '✓', text: 'Free WiFi', color: 'text-green-500' },
                                                { icon: '✓', text: 'Breakfast', color: 'text-green-500' },
                                                { icon: '✓', text: 'Parking', color: 'text-green-500' },
                                                { icon: '✓', text: 'Pool Access', color: 'text-green-500' },
                                            ].map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className={`${feature.color} font-bold`}>{feature.icon}</span>
                                                    <span className="text-sm text-gray-600">{feature.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-gray-200 pt-4 lg:pt-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Room Charges</div>
                                            <div className="text-xl lg:text-2xl font-bold text-[#283862]">${roomPrice.toLocaleString()}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Total for 1 night</div>
                                            <div className="text-xl lg:text-2xl font-bold text-[#c23535]">${total.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Extras Section */}
                        <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-4 lg:p-6">
                            <h3 className="text-lg font-bold text-[#283862] mb-4">Enhance Your Stay</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: 'Spa Package', price: 120, popular: true },
                                    { name: 'Dinner for Two', price: 85 },
                                    { name: 'City Tour', price: 65, popular: true },
                                ].map((extra, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-[#c23535] transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="font-medium text-[#283862]">{extra.name}</div>
                                                <div className="text-sm text-gray-500">Add to your booking</div>
                                            </div>
                                            {extra.popular && (
                                                <span className="px-2 py-1 bg-[#c23535]/10 text-[#c23535] text-xs rounded">Popular</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-lg lg:text-xl font-bold text-[#283862]">+${extra.price}</div>
                                            <button className="px-3 lg:px-4 py-2 bg-gray-100 cursor-pointer hover:bg-[#c23535] hover:text-white text-gray-700 rounded text-sm font-medium transition-colors">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white rounded-xl border border-gray-200">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-[#283862] mb-6">Booking Summary</h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Room (1 night)</span>
                                            <span className="font-medium">${roomPrice.toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Taxes & Fees</span>
                                            <span className="font-medium">$0</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Service Charge</span>
                                            <span className="font-medium">$0</span>
                                        </div>

                                        {/* Promo Code */}
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Promo code"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#c23535]"
                                                />
                                                <button className="px-4 py-2 bg-[#c23535] cursor-pointer text-white rounded text-sm font-medium hover:bg-[#283862] transition-colors">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-[#283862]">Total Amount</div>
                                                <div className="text-sm text-gray-500">All charges included</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl lg:text-3xl font-bold text-[#c23535]">${total.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button - UPDATED */}
                                <div className="border-t border-gray-200 p-6">
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>

                            {/* Security & Guarantee */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#c23535]/10 flex items-center justify-center">
                                            <FaShieldAlt className="text-[#c23535] text-lg" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#283862]">Secure Payment</div>
                                            <div className="text-sm text-gray-500">Your data is protected</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#c23535]/10 flex items-center justify-center">
                                            <FaCheckCircle className="text-[#c23535] text-lg" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#283862]">Best Price Guarantee</div>
                                            <div className="text-sm text-gray-500">Find it cheaper? We`ll match it</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Policies */}
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-green-600 text-xs">✓</span>
                                            </div>
                                            <span className="text-sm text-gray-600">Free cancellation until 24 hours before check-in</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-green-600 text-xs">✓</span>
                                            </div>
                                            <span className="text-sm text-gray-600">No credit card required to book</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-gradient-to-r from-[#283862] to-[#1c2a4a] rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaCreditCard className="text-white text-xl" />
                                    <h4 className="text-white font-bold">Accepted Payment Methods</h4>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {['Visa', 'Master', 'PayPal', 'Gpay'].map((method, idx) => (
                                        <div key={idx} className="bg-white/10 rounded-lg p-3 text-center">
                                            <div className="text-white font-medium cursor-pointer text-sm">{method}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions - Desktop only */}
                <div className="hidden lg:flex mt-8 flex-col sm:flex-row justify-between items-center gap-4">
                    <button 
                        onClick={() => router.back()} // Optional: Add navigation
                        className="px-6 py-3 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:border-[#c23535] hover:text-[#c23535] transition-colors font-medium"
                    >
                        Continue Shopping
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-3 cursor-pointer bg-white border border-[#283862] text-[#283862] rounded-lg hover:bg-[#283862] hover:text-white transition-colors font-medium">
                            Update Cart
                        </button>
                        <button 
                            onClick={handleCheckout}
                            className="px-6 py-3 cursor-pointer bg-[#c23535] text-white rounded-lg hover:bg-[#a82d2d] transition-colors font-medium flex items-center gap-2"
                        >
                            <FaCreditCard />
                            Secure Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Checkout Button - UPDATED */}
            {showMobileCheckout && (
                <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
                    <button 
                        onClick={handleCheckout}
                        className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                        <FaCreditCard />
                        Checkout - ${total.toLocaleString()}
                    </button>
                </div>
            )}

            {/* Mobile Summary Modal */}
            {showSummaryModal && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-[#283862]">Complete Booking</h3>
                                <button 
                                    onClick={() => setShowSummaryModal(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Booking Summary */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-[#283862] mb-4">Booking Summary</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Room (1 night)</span>
                                            <span className="font-medium">${roomPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Taxes & Fees</span>
                                            <span className="font-medium">$0</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Service Charge</span>
                                            <span className="font-medium">$0</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-300">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[#283862]">Total Amount</span>
                                                <span className="text-2xl font-bold text-[#c23535]">${total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter promo code"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#c23535]"
                                        />
                                        <button className="px-6 py-3 bg-[#c23535] cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-[#283862] transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#c23535]/10 flex items-center justify-center">
                                            <FaShieldAlt className="text-[#c23535]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#283862]">Secure Payment</div>
                                            <div className="text-sm text-gray-500">256-bit SSL encryption</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#c23535]/10 flex items-center justify-center">
                                            <FaCheckCircle className="text-[#c23535]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#283862]">Best Price Guarantee</div>
                                            <div className="text-sm text-gray-500">Find it cheaper? We`ll match it</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Policies */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h4 className="font-bold text-[#283862] mb-3">Booking Policies</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 font-bold mt-0.5">✓</span>
                                            <span className="text-sm text-gray-600">Free cancellation until 24 hours before check-in</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 font-bold mt-0.5">✓</span>
                                            <span className="text-sm text-gray-600">No credit card required to book</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final Checkout Button - UPDATED */}
                            <div className="mt-8">
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Complete Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}