"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/Alert';
import { promoCodeService } from '../../api/promoCodeService';
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
import { authService } from '../../api/authService';
import { cartService } from '../../api/cartService';
// ... (EXTRAS_OPTIONS remains same, skipping for brevity in this replacement block if possible, but replace_file_content needs continguous block. I'll target just the top imports)


const EXTRAS_OPTIONS = [
    { name: 'Spa Package', price: 120, popular: true, description: 'Relaxing 60-min massage' },
    { name: 'Dinner for Two', price: 85, popular: false, description: '3-course meal at our restaurant' },
    { name: 'City Tour', price: 65, popular: true, description: 'Guided tour of local landmarks' },
    { name: 'Airport Transfer', price: 45, popular: false, description: 'Private car pickup/drop-off' },
    { name: 'Late Checkout', price: 30, popular: false, description: 'Keep your room until 2 PM' },
];

export default function RoomCart() {
    const router = useRouter();
    const [cartItem, setCartItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Default states, will be updated from cart data
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    const [showMobileCheckout, setShowMobileCheckout] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    // Dynamic Logic States
    const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<{ code: string, discountAmount: number } | null>(null);
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [alertState, setAlertState] = useState<{ type: 'default' | 'destructive' | 'success', title: string, message: string } | null>(null);

    // Load Cart Data
    useEffect(() => {
        const loadCart = async () => {
            setIsLoading(true);
            const user = authService.getCurrentUser();
            let loadedCartItem = null;

            // 1. Try LocalStorage first (always source of truth for anonymous or unsynced changes)
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('room_cart');
                if (stored) {
                    try {
                        loadedCartItem = JSON.parse(stored);
                    } catch (e) {
                        console.error("Failed to parse cart item", e);
                    }
                }
            }

            // 2. If User Logged In, Sync or Fetch
            if (user) {
                try {
                    // fetching backend cart
                    const backendCartContainer = await cartService.getCart();
                    const backendItems = backendCartContainer?.data?.items;

                    if (loadedCartItem) {
                        // Priority: If local changes exist, sync to backend
                        // In a real app, you might ask user or merge. Here we overwrite backend with local if local exists (assuming latest activity)
                        await cartService.syncCart(loadedCartItem);
                    } else if (backendItems && backendItems.length > 0) {
                        // If no local but backend has data, use backend
                        // Only supporting single item flow for now
                        loadedCartItem = backendItems[0];
                        // Also update local storage to keep them in sync for other pages
                        localStorage.setItem('room_cart', JSON.stringify(loadedCartItem));
                    }
                } catch (err) {
                    console.error("Error syncing cart", err);
                }
            }

            if (loadedCartItem) {
                setCartItem(loadedCartItem);
                if (loadedCartItem.guestDetails) {
                    setAdults(loadedCartItem.guestDetails.adults || 2);
                    setChildren(loadedCartItem.guestDetails.children || 0);
                }
                if (loadedCartItem.selectedExtras) {
                    setSelectedExtras(new Set(loadedCartItem.selectedExtras));
                }
                if (loadedCartItem.appliedPromo) {
                    // If we saved promo state
                }
            }

            setIsLoading(false);
        };
        loadCart();
    }, []);

    // Derived values
    const roomPrice = cartItem ? cartItem.price : 0;
    const roomsCount = cartItem?.guestDetails?.rooms || 1;
    const baseTotal = roomPrice * roomsCount;

    const extrasTotal = Array.from(selectedExtras).reduce((acc, extraName) => {
        const extra = EXTRAS_OPTIONS.find(e => e.name === extraName);
        return acc + (extra ? extra.price : 0);
    }, 0);

    const taxes = baseTotal * 0.10; // 10% tax
    const serviceCharge = baseTotal * 0.05; // 5% service charge

    // Calculate Discount
    const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;

    const grandTotal = Math.max(0, baseTotal + extrasTotal + taxes + serviceCharge - discountAmount);

    // Handle Promo Code
    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setIsApplyingPromo(true);
        setAlertState(null);

        try {
            const result = await promoCodeService.validatePromoCode(promoCode, baseTotal);

            if (result.valid) {
                setAppliedPromo({
                    code: promoCode.toUpperCase(),
                    discountAmount: result.discountAmount || 0
                });
                setAlertState({
                    type: 'success',
                    title: 'Success!',
                    message: `Promo code applied! You saved ${fmt(result.discountAmount || 0)}`
                });
            } else {
                setAppliedPromo(null);
                setAlertState({
                    type: 'destructive',
                    title: 'Invalid Code',
                    message: result.message || "Invalid promo code"
                });
            }
        } catch (error) {
            console.error(error);
            setAlertState({
                type: 'destructive',
                title: 'Error',
                message: "Something went wrong while applying the promo code."
            });
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
        setAlertState({
            type: 'default',
            title: 'Removed',
            message: "Promo code has been removed."
        });
        setTimeout(() => setAlertState(null), 3000);
    };

    // Handle Extras Toggle
    const toggleExtra = (extraName: string) => {
        const newExtras = new Set(selectedExtras);
        if (newExtras.has(extraName)) {
            newExtras.delete(extraName);
        } else {
            newExtras.add(extraName);
        }
        setSelectedExtras(newExtras);
    };


    // Handle checkout navigation
    // Save updated total and extras to cart/checkout state if needed
    // Handle checkout navigation
    // Save updated total and extras to cart/checkout state if needed
    const handleCheckout = async () => {
        // Ideally we save the "final" cart state back to storage so checkout page can read totals
        if (cartItem) {
            const updatedCart = {
                ...cartItem,
                guestDetails: {
                    ...cartItem.guestDetails,
                    rooms: roomsCount, // Ensure rooms count is preserved
                    adults,
                    children
                },
                financials: {
                    baseTotal,
                    extrasTotal,
                    taxes,
                    serviceCharge,
                    discountAmount,
                    grandTotal,
                    currency: '$'
                },
                selectedExtras: Array.from(selectedExtras)
            };
            localStorage.setItem('room_cart', JSON.stringify(updatedCart));

            // Sync to backend if logged in
            const user = authService.getCurrentUser();
            if (user) {
                await cartService.syncCart(updatedCart);
            }
        }
        router.push('/room-checkout');
    };

    // Handle removing item
    const handleRemove = async () => {
        localStorage.removeItem('room_cart');
        setCartItem(null);
        setSelectedExtras(new Set());
        setAppliedPromo(null);

        const user = authService.getCurrentUser();
        if (user) {
            await cartService.clearCart();
        }
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

    // Helper to format currency
    const fmt = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* --- HEADER --- */}
            <div className="bg-[#283862] pt-24 lg:pt-32 pb-16 lg:pb-26 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop"
                        className="w-full h-full object-cover" alt="Header" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl noto-geogia-font font-bold mb-4">Room Cart</h1>
                    <div className="flex justify-center items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300">
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors">Home</span>
                        <span>/</span>
                        <span className="text-white">Room Cart</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 mt-16 lg:mt-0">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-[#283862] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : !cartItem ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <FaShoppingCart className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#283862] mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added any rooms yet.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-3 bg-[#c23535] text-white font-bold rounded-lg hover:bg-[#a82d2d] transition-colors"
                        >
                            Browse Rooms
                        </button>
                    </div>
                ) : (
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
                                                    SELECTED ROOM
                                                </span>
                                                <span className="hidden sm:inline text-sm text-gray-500">•</span>
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <FaCalendarDay className="text-[#c23535]" />
                                                    {/* Dynamic Date Display logic - Default to tomorrow if not set */}
                                                    {new Date(Date.now() + 86400000).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h2 className="text-xl lg:text-2xl font-bold text-[#283862]">{cartItem.roomName}</h2>
                                            <p className="text-gray-600 mt-2 text-sm lg:text-base">
                                                {cartItem.roomTitle !== cartItem.roomName ? cartItem.roomTitle : "Excellent Choice!"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleRemove}
                                            className="text-gray-400 hover:text-[#c23535] p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors flex-shrink-0 ml-2">
                                            <FaTrash className="text-lg" />
                                        </button>
                                    </div>

                                    {/* Room Details Grid */}
                                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-6">
                                        {/* Image */}
                                        <div className="lg:col-span-1">
                                            <div className="relative h-56 sm:h-64 lg:h-72 rounded-lg overflow-hidden">
                                                <img
                                                    src={cartItem.roomImage || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"}
                                                    alt="Room"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-4 left-4">
                                                    <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                        {fmt(roomPrice)}/night
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
                                                {(cartItem.amenities && cartItem.amenities.length > 0 ? cartItem.amenities : [
                                                    { name: 'Free WiFi' },
                                                    { name: 'Breakfast' },
                                                    { name: 'Parking' },
                                                    { name: 'Pool Access' },
                                                ]).slice(0, 8).map((feature: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <span className="text-green-500 font-bold">✓</span>
                                                        <span className="text-sm text-gray-600 truncate">{feature.name || feature.title || "Amenity"}</span>
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
                                                <div className="text-xl lg:text-2xl font-bold text-[#283862] text-nowrap">{fmt(roomPrice)} <span className="text-sm font-normal text-gray-400">x {roomsCount} room(s)</span></div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">Subtotal</div>
                                                <div className="text-xl lg:text-2xl font-bold text-[#c23535]">{fmt(baseTotal)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Extras Section */}
                            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-4 lg:p-6">
                                <h3 className="text-lg font-bold text-[#283862] mb-4">Enhance Your Stay</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {EXTRAS_OPTIONS.map((extra, idx) => {
                                        const isSelected = selectedExtras.has(extra.name);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => toggleExtra(extra.name)}
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-[#c23535] bg-[#c23535]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="font-medium text-[#283862]">{extra.name}</div>
                                                        <div className="text-xs text-gray-500 line-clamp-1">{extra.description}</div>
                                                    </div>
                                                    {extra.popular && (
                                                        <span className="px-2 py-1 bg-[#c23535]/10 text-[#c23535] text-[10px] uppercase font-bold rounded">Popular</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-lg font-bold text-[#283862]">+${extra.price}</div>
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#c23535] bg-[#c23535]' : 'border-gray-300'}`}>
                                                        {isSelected && <FaCheckCircle className="text-white text-xs" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar - Desktop */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Summary Card */}
                                <div className="bg-white rounded-xl border border-gray-200">
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-[#283862] mb-6">Booking Summary</h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Room ({roomsCount}) x 1 night</span>
                                                <span className="font-medium">{fmt(baseTotal)}</span>
                                            </div>

                                            {extrasTotal > 0 && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Extras ({selectedExtras.size})</span>
                                                    <span className="font-medium text-[#c23535]">+{fmt(extrasTotal)}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Taxes (10%)</span>
                                                <span className="font-medium">{fmt(taxes)}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Service Charge (5%)</span>
                                                <span className="font-medium">{fmt(serviceCharge)}</span>
                                            </div>

                                            {appliedPromo && (
                                                <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded group">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">Discount ({appliedPromo.code})</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold">-{fmt(discountAmount)}</span>
                                                        <button
                                                            onClick={handleRemovePromo}
                                                            className="text-green-600 hover:text-red-500 transition-colors"
                                                            title="Remove Coupon"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Promo Code */}
                                            <div className="pt-4 border-t border-gray-200">
                                                {/* Alert Notification */}
                                                {alertState && (
                                                    <Alert variant={alertState.type as any} className="mb-4 py-3">
                                                        <AlertTitle className="mb-0 font-bold">{alertState.title}</AlertTitle>
                                                        <AlertDescription>{alertState.message}</AlertDescription>
                                                    </Alert>
                                                )}

                                                {!appliedPromo && (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={promoCode}
                                                            onChange={(e) => setPromoCode(e.target.value)}
                                                            placeholder="Code: WELCOME10"
                                                            className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#c23535]"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                                        />
                                                        <button
                                                            onClick={handleApplyPromo}
                                                            disabled={isApplyingPromo}
                                                            className={`px-4 py-2 bg-[#c23535] cursor-pointer text-white rounded text-sm font-medium hover:bg-[#283862] transition-colors ${isApplyingPromo ? 'opacity-70 cursor-wait' : ''}`}
                                                        >
                                                            {isApplyingPromo ? '...' : 'Apply'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-[#283862]">Total Amount</div>
                                                    <div className="text-xs text-gray-500">Includes all taxes</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl lg:text-3xl font-bold text-[#c23535]">{fmt(grandTotal)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <div className="border-t border-gray-200 p-6">
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>

                                {/* Security etc - Keep existing */}
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
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Actions - Desktop only */}
                {cartItem && (
                    <div className="hidden lg:flex mt-8 flex-col sm:flex-row justify-between items-center gap-4">
                        <button onClick={() => router.back()} className="px-6 py-3 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:border-[#c23535] hover:text-[#c23535] transition-colors font-medium">
                            Continue Shopping
                        </button>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleCheckout}
                                className="px-6 py-3 cursor-pointer bg-[#c23535] text-white rounded-lg hover:bg-[#a82d2d] transition-colors font-medium flex items-center gap-2"
                            >
                                <FaCreditCard />
                                Secure Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Floating Checkout Button - UPDATED */}
            {showMobileCheckout && cartItem && (
                <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
                    <button
                        onClick={handleCheckout}
                        className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                        <FaCreditCard />
                        Checkout - {fmt(grandTotal)}
                    </button>
                </div>
            )}

            {/* Mobile Summary Modal would go here, updated similarly to Desktop Sidebar */}
            {showSummaryModal && cartItem && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                    {/* ... (Mobile modal content with same dynamic values as desktop sidebar) ... */}
                    {/* Simplified for brevity in this replacement, but ideally should match */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-[#283862]">Complete Booking</h3>
                                <button onClick={() => setShowSummaryModal(false)} className="text-gray-400 hover:text-gray-600 p-2"><FaTimes className="text-lg" /></button>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="font-bold text-[#283862] mb-4">Booking Summary</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Room ({roomsCount} room(s))</span>
                                            <span className="font-medium">{fmt(baseTotal)}</span>
                                        </div>
                                        {extrasTotal > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Extras</span>
                                                <span className="font-medium text-[#c23535]">+{fmt(extrasTotal)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Taxes & Fees</span>
                                            <span className="font-medium">{fmt(taxes + serviceCharge)}</span>
                                        </div>
                                        {appliedPromo && (
                                            <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded group">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">Discount ({appliedPromo.code})</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold">-{fmt(discountAmount)}</span>
                                                    <button
                                                        onClick={handleRemovePromo}
                                                        className="text-green-600 hover:text-red-500 transition-colors"
                                                        title="Remove Coupon"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-gray-300">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-[#283862]">Total Amount</span>
                                                <span className="text-2xl font-bold text-[#c23535]">{fmt(grandTotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Code (Mobile) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>

                                    {/* Alert Notification */}
                                    {alertState && (
                                        <Alert variant={alertState.type as any} className="mb-4 py-3">
                                            <AlertTitle className="mb-0 font-bold">{alertState.title}</AlertTitle>
                                            <AlertDescription>{alertState.message}</AlertDescription>
                                        </Alert>
                                    )}

                                    {!appliedPromo ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Enter promo code"
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#c23535]"
                                                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                disabled={isApplyingPromo}
                                                className={`px-6 py-3 bg-[#c23535] cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-[#283862] transition-colors ${isApplyingPromo ? 'opacity-70 cursor-wait' : ''}`}
                                            >
                                                {isApplyingPromo ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-green-600">Promo code applied successfully.</p>
                                    )}
                                </div>
                                <div className="mt-8">
                                    <button onClick={handleCheckout} className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all shadow-md">
                                        Complete Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}