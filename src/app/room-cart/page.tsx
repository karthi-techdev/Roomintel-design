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
import { PiArrowsOutSimple, PiBed, PiUsers } from 'react-icons/pi';
import { siteService } from '../../api/siteService';
import { useCartStore, CartItem } from '@/store/useCartStore';
import { useCurrency } from '@/hooks/useCurrency';

export default function RoomCart() {
    const router = useRouter();

    // --- STORE ---
    const { cartItems, loading, fetchCart, updateCartItem, removeFromCart, addToCart } = useCartStore();

    // --- LOCAL STATE ---
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [bedConfig, setBedConfig] = useState<{ _id?: string; key: string; value: string }[]>([]);

    // Alert/Promo
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<{ code: string, discountAmount: number } | null>(null);
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [alertState, setAlertState] = useState<{ type: 'default' | 'destructive' | 'success', title: string, message: string } | null>(null);

    // UI State
    const [showMobileCheckout, setShowMobileCheckout] = useState(false);

    // Helper
    const { formatPrice, currencyIcon } = useCurrency();
    const fmt = (amount: number) => formatPrice(amount);

    // --- EFFECTS ---

    // Initial Fetch
    useEffect(() => {
        // Fetch bed configuration
        const fetchBedConfig = async () => {
            try {
                const res = await siteService.getConfigBySlug('bed-types');
                if (res && (res.status === true || res.success === true) && res.data) {
                    setBedConfig(res.data.configFields || []);
                }
            } catch (e) {
                console.error("Failed to fetch bed config", e);
            }
        };
        fetchBedConfig();
        fetchCart();

        // Fetch Services
        const fetchServices = async () => {
            try {
                const servicesData = await siteService.getServices();
                if (servicesData && servicesData.success) {
                    setAvailableServices(servicesData.data);
                }
            } catch (e) {
                console.error("Error fetching services", e);
            }
        };

        // Fetch All Rooms
        const fetchRooms = async () => {
            setRoomsLoading(true);
            try {
                const res = await siteService.getRooms();
                if (res && res.data) {
                    setAllRooms(res.data);
                }
            } catch (e) {
                console.error("Error fetching rooms", e);
            } finally {
                setRoomsLoading(false);
            }
        };

        fetchServices();
        fetchRooms();
    }, []);

    // Scroll Handler
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

    // Aggregate calculations for all items
    const totals = cartItems.reduce((acc, item) => {
        const roomPrice = item.price || 0;
        const roomsCount = item.guestDetails?.rooms || 1;

        // Occupancy Surcharge per item
        const config = item.rateConfig;
        let occupancySurcharge = 0;
        if (config) {
            const adults = item.guestDetails?.adults || 2;
            const children = item.guestDetails?.children || 0;
            const extraAdults = Math.max(0, adults - (config.baseAdults ?? 2));
            const extraChildren = Math.max(0, children - (config.baseChildren ?? 0));
            occupancySurcharge = (extraAdults * (config.extraAdultPrice ?? 0)) + (extraChildren * (config.extraChildPrice ?? 0));
        }

        const itemBaseTotal = (roomPrice + occupancySurcharge) * roomsCount;

        // Extras per item
        const extrasTotal = (item.selectedExtras || []).reduce((eAcc, extraName) => {
            const extra = availableServices.find(e => e.title === extraName);
            return eAcc + (extra ? extra.price : 0);
        }, 0);

        return {
            baseTotal: acc.baseTotal + itemBaseTotal,
            extrasTotal: acc.extrasTotal + extrasTotal,
            roomsCount: acc.roomsCount + roomsCount
        };
    }, { baseTotal: 0, extrasTotal: 0, roomsCount: 0 });

    const taxes = totals.baseTotal * 0.10; // 10% tax
    const serviceCharge = totals.baseTotal * 0.05; // 5% service charge

    const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
    const grandTotal = Math.max(0, totals.baseTotal + totals.extrasTotal + taxes + serviceCharge - discountAmount);


    // --- HANDLERS ---

    const handleAddRoom = async (room: any) => {
        // Default dates from existing items or tomorrow
        const checkIn = cartItems.length > 0 ? cartItems[0].checkIn : new Date(Date.now() + 86400000).toISOString();
        const checkOut = cartItems.length > 0 ? cartItems[0].checkOut : new Date(Date.now() + 86400000 * 2).toISOString();

        const newItem: CartItem = {
            roomId: room._id,
            roomName: room.title,
            roomTitle: room.title,
            price: room.price,
            image: room.images?.[0],
            checkIn,
            checkOut,
            guestDetails: {
                rooms: 1,
                adults: room.baseAdults || 2,
                children: room.baseChildren || 0
            },
            rateConfig: {
                baseAdults: room.baseAdults || 2,
                baseChildren: room.baseChildren || 0,
                extraAdultPrice: room.extraAdultPrice || 0,
                extraChildPrice: room.extraChildPrice || 0,
                maxAdults: room.maxAdults || 4,
                maxChildren: room.maxChildren || 2
            },
            amenities: room.amenities,
            financials: {
                baseTotal: room.price,
                extrasTotal: 0,
                taxes: room.price * 0.10,
                serviceCharge: room.price * 0.05,
                discountAmount: 0,
                grandTotal: room.price * 1.15,
                currency: currencyIcon
            }
        };

        await addToCart(newItem);
        setAlertState({
            type: 'success',
            title: 'Room Added',
            message: `${room.title} has been added to your cart.`
        });
        setTimeout(() => setAlertState(null), 3000);
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setIsApplyingPromo(true);
        setAlertState(null);

        try {
            const result = await promoCodeService.validatePromoCode(promoCode, totals.baseTotal);

            if (result.valid) {
                const discount = result.discountAmount || 0;
                setAppliedPromo({
                    code: promoCode.toUpperCase(),
                    discountAmount: discount
                });

                setAlertState({
                    type: 'success',
                    title: 'Success!',
                    message: `Promo code applied! You saved ${fmt(result.discountAmount || 0)}`
                });

                promoCodeService.applyPromoUsage(promoCode.toUpperCase());
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

    const handleRemovePromo = async () => {
        if (appliedPromo) {
            promoCodeService.removePromoUsage(appliedPromo.code);
        }
        setAppliedPromo(null);
        setPromoCode('');

        setAlertState({
            type: 'default',
            title: 'Removed',
            message: "Promo code has been removed."
        });
        setTimeout(() => setAlertState(null), 3000);
    };

    const handleCheckout = async () => {
        // Note: Individual item financials aren't critical for next page if we pass totals, 
        // but we sync them in useCartStore via updateCartItem if needed.
        router.push('/room-checkout');
    };

    const handleRemove = async (itemId: string) => {
        await removeFromCart(itemId);
    };

    const calculateItemFinancials = (item: CartItem) => {
        const roomPrice = item.price || 0;
        const config = item.rateConfig;
        const roomsCount = item.guestDetails?.rooms || 1;

        // Occupancy Surcharge
        let occupancySurcharge = 0;
        if (config) {
            const adults = item.guestDetails?.adults || 2;
            const children = item.guestDetails?.children || 0;
            const extraAdults = Math.max(0, adults - (config.baseAdults ?? 2));
            const extraChildren = Math.max(0, children - (config.baseChildren ?? 0));
            occupancySurcharge = (extraAdults * (config.extraAdultPrice ?? 0)) + (extraChildren * (config.extraChildPrice ?? 0));
        }

        const baseTotal = (roomPrice + occupancySurcharge) * roomsCount;

        // Extras
        const extrasTotal = (item.selectedExtras || []).reduce((eAcc, extraName) => {
            const extra = availableServices.find(e => e.title === extraName);
            return eAcc + (extra ? extra.price : 0);
        }, 0);

        const taxes = baseTotal * 0.10;
        const serviceCharge = baseTotal * 0.05;
        const grandTotal = baseTotal + extrasTotal + taxes + serviceCharge;

        return {
            baseTotal,
            extrasTotal,
            taxes,
            serviceCharge,
            discountAmount: 0, // Will be managed globally or updated separately
            grandTotal,
            currency: currencyIcon
        };
    };

    const handleUpdateGuests = async (index: number, adults: number, children: number) => {
        const item = cartItems[index];
        const updatedItem = {
            ...item,
            guestDetails: {
                rooms: item.guestDetails?.rooms || 1,
                adults: adults || 2,
                children: children || 0
            }
        };
        updatedItem.financials = calculateItemFinancials(updatedItem);
        await updateCartItem(updatedItem);
    };

    const handleUpdateRooms = async (index: number, rooms: number) => {
        const item = cartItems[index];
        const updatedItem = {
            ...item,
            guestDetails: {
                rooms: Math.max(1, rooms),
                adults: item.guestDetails?.adults ?? 2,
                children: item.guestDetails?.children ?? 0
            }
        };
        updatedItem.financials = calculateItemFinancials(updatedItem);
        await updateCartItem(updatedItem);
    };

    const toggleExtra = async (index: number, extraName: string) => {
        const item = cartItems[index];
        const currentExtras = new Set(item.selectedExtras || []);
        if (currentExtras.has(extraName)) {
            currentExtras.delete(extraName);
        } else {
            currentExtras.add(extraName);
        }

        const updatedItem = {
            ...item,
            selectedExtras: Array.from(currentExtras)
        };
        updatedItem.financials = calculateItemFinancials(updatedItem);
        await updateCartItem(updatedItem);
    };




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
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-[#283862] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <FaShoppingCart className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#283862] mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added any rooms yet.</p>
                        <button
                            onClick={() => router.push('/rooms')}
                            className="px-8 py-3 bg-[#c23535] text-white font-bold rounded-lg hover:bg-[#a82d2d] transition-colors"
                        >
                            Browse Rooms
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Main Cart Section */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Cart Items List */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xl font-bold text-[#283862]">Your Selection</h3>
                                    <span className="bg-[#c23535] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{totals.roomsCount} {totals.roomsCount === 1 ? 'ROOM' : 'ROOMS'}</span>
                                </div>
                                {cartItems.map((item, index) => {
                                    const config = item.rateConfig;
                                    const occupancySurcharge = config ? (
                                        (Math.max(0, (item.guestDetails?.adults || 2) - (config.baseAdults ?? 2)) * (config.extraAdultPrice ?? 0)) +
                                        (Math.max(0, (item.guestDetails?.children || 0) - (config.baseChildren ?? 0)) * (config.extraChildPrice ?? 0))
                                    ) : 0;
                                    const itemBaseTotal = (item.price + occupancySurcharge) * (item.guestDetails?.rooms || 1);

                                    return (
                                        <div key={item._id || index} className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <span className="px-3 py-1 bg-[#c23535]/10 text-[#c23535] text-[10px] font-bold rounded-full uppercase">Room {index + 1}</span>
                                                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                                                <FaCalendarDay className="text-[#c23535]" />
                                                                {item.checkIn && item.checkOut
                                                                    ? `${new Date(item.checkIn).toLocaleDateString()} - ${new Date(item.checkOut).toLocaleDateString()}`
                                                                    : 'Dates not set'
                                                                }
                                                            </span>
                                                        </div>
                                                        <h2 className="text-lg lg:text-xl font-bold text-[#283862]">{item.roomName}</h2>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(item._id || item.roomId)}
                                                        className="text-gray-400 hover:text-[#c23535] p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                                                    >
                                                        <FaTrash className="text-base" />
                                                    </button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                                                    <div className="w-full sm:w-40 h-32 rounded-lg overflow-hidden shrink-0">
                                                        <img src={item.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop"} alt="Room" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Rooms</label>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() => handleUpdateRooms(index, (item.guestDetails?.rooms || 1) - 1)}
                                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:text-[#c23535] disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={(item.guestDetails?.rooms || 1) <= 1}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="font-bold text-[#283862]">
                                                                        {item.guestDetails?.rooms || 1}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => {
                                                                            const roomData = allRooms.find((r: any) => r._id === item.roomId);
                                                                            const maxRooms = roomData?.maxRooms || 10;
                                                                            handleUpdateRooms(index, Math.min(maxRooms, (item.guestDetails?.rooms || 1) + 1));
                                                                        }}
                                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:text-[#c23535] disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={(() => {
                                                                            const roomData = allRooms.find((r: any) => r._id === item.roomId);
                                                                            const maxRooms = roomData?.maxRooms || 10;
                                                                            return (item.guestDetails?.rooms || 1) >= maxRooms;
                                                                        })()}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                                {(() => {
                                                                    const roomData = allRooms.find((r: any) => r._id === item.roomId);
                                                                    const maxRooms = roomData?.maxRooms || 10;
                                                                    return (item.guestDetails?.rooms || 1) >= maxRooms && (
                                                                        <div className="text-[9px] text-yellow-500">Max limit reached</div>
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Adults</label>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() => handleUpdateGuests(index, Math.max(1, (item.guestDetails?.adults || 2) - 1), item.guestDetails?.children || 0)}
                                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:text-[#c23535] disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={(item.guestDetails?.adults || 2) <= 1}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="font-bold text-[#283862]">{item.guestDetails?.adults || 2}</span>
                                                                    <button
                                                                        onClick={() => handleUpdateGuests(index, Math.min(config?.maxAdults || 10, (item.guestDetails?.adults || 2) + 1), item.guestDetails?.children || 0)}
                                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:text-[#c23535] disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={(item.guestDetails?.adults || 2) >= (config?.maxAdults || 10)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Children</label>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() => handleUpdateGuests(index, item.guestDetails?.adults || 2, Math.max(0, (item.guestDetails?.children || 0) - 1))}
                                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:text-[#c23535] disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={(item.guestDetails?.children || 0) <= 0}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="font-bold text-[#283862]">{item.guestDetails?.children || 0}</span>
                                                                    <button
                                                                        onClick={() => handleUpdateGuests(index, item.guestDetails?.adults || 2, Math.min(config?.maxChildren || 10, (item.guestDetails?.children || 0) + 1))}
                                                                        className="w-8 h-8 flex items-center justify-center border rounded hover:text-[#c23535] disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={(item.guestDetails?.children || 0) >= (config?.maxChildren || 10)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Individual Extras per room */}
                                                        <div>
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Room Service Extras</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {availableServices.map((service, sIdx) => {
                                                                    const isSelected = (item.selectedExtras || []).includes(service.title);
                                                                    return (
                                                                        <button
                                                                            key={sIdx}
                                                                            onClick={() => toggleExtra(index, service.title)}
                                                                            className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all ${isSelected ? 'bg-[#c23535] border-[#c23535] text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'}`}
                                                                        >
                                                                            {service.title} ({formatPrice(service.price)})
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-dotted border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm">
                                                    <div className="text-gray-500 whitespace-nowrap">
                                                        ({fmt(item.price)} + {fmt(occupancySurcharge)}) × {item.guestDetails?.rooms || 1} Rooms
                                                    </div>
                                                    <div className="font-bold text-[#283862]">Subtotal: {fmt(itemBaseTotal)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Available Rooms Section */}
                            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-[#283862]">Available Rooms</h3>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select to add</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {roomsLoading ? (
                                        <div className="col-span-full py-4 text-center text-gray-400">Loading rooms...</div>
                                    ) : allRooms.filter(r => !cartItems.some(ci => ci.roomId === r._id)).map((room, idx) => (
                                        <div key={idx} className="group relative flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-[#c23535] hover:shadow-md transition-all">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0">
                                                <img src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=200&auto=format&fit=crop"} alt={room.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-[#283862] text-sm truncate">{room.title}</h4>
                                                    <div className="text-[#c23535] font-bold text-sm">{formatPrice(room.price)}</div>
                                                </div>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400">
                                                    <span className="flex items-center gap-1"><PiArrowsOutSimple /> {room.size}</span>
                                                    {(() => {
                                                        if (!room.beds || typeof room.beds !== 'string') return null;

                                                        // Convert bed IDs to labels
                                                        let bedDisplay = room.beds;
                                                        if (bedConfig.length > 0) {
                                                            const bedIds = room.beds.split(',').map((s: string) => s.trim());
                                                            const labels = bedIds.map((id: string) => {
                                                                const match = bedConfig.find((c: any) => c._id && c._id.toString() === id);
                                                                return match ? match.value : id;
                                                            });
                                                            bedDisplay = labels.join(', ');
                                                        }

                                                        // Hide if contains "Unknown"
                                                        if (bedDisplay.toLowerCase().includes('unknown')) return null;

                                                        return (
                                                            <span className="flex items-center gap-1"><PiBed /> {bedDisplay}</span>
                                                        );
                                                    })()}
                                                    <span className="flex items-center gap-1"><PiUsers /> {room.baseAdults || 2} + {room.baseChildren || 0}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddRoom(room)}
                                                className="px-4 py-2 bg-[#283862] text-white text-xs font-bold rounded-lg hover:bg-[#c23535] transition-colors shadow-sm"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))}
                                    {allRooms.length > 0 && allRooms.filter(r => !cartItems.some(ci => ci.roomId === r._id)).length === 0 && (
                                        <div className="col-span-full py-4 text-center text-sm text-gray-500 italic">All rooms already added</div>
                                    )}
                                </div>
                            </div>


                        </div>

                        {/* Order Summary Sidebar - Desktop */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Summary Card */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="bg-[#283862] p-5 text-white">
                                        <h3 className="text-lg font-bold">Booking Summary</h3>
                                        <p className="text-xs text-gray-300 mt-1">Review your total selection</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Rooms ({totals.roomsCount})</span>
                                                <span className="font-bold text-[#283862]">{fmt(totals.baseTotal)}</span>
                                            </div>

                                            {totals.extrasTotal > 0 && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">Total Extras</span>
                                                    <span className="font-bold text-[#c23535]">+{fmt(totals.extrasTotal)}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Taxes (10%)</span>
                                                <span className="font-medium">{fmt(taxes)}</span>
                                            </div>

                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Service Charge (5%)</span>
                                                <span className="font-medium">{fmt(serviceCharge)}</span>
                                            </div>

                                            {appliedPromo && (
                                                <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold">PROMO: {appliedPromo.code}</span>
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
                                            <div className="pt-4 border-t border-gray-100">
                                                {/* Alert Notification */}
                                                {alertState && (
                                                    <Alert variant={alertState.type as any} className="mb-4 py-2 text-xs">
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
                                                            placeholder="Promo Code"
                                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#c23535] transition-colors"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                                        />
                                                        <button
                                                            onClick={handleApplyPromo}
                                                            disabled={isApplyingPromo}
                                                            className={`px-4 py-2 bg-[#283862] cursor-pointer text-white rounded-lg text-xs font-bold hover:bg-[#c23535] transition-colors ${isApplyingPromo ? 'opacity-70 cursor-wait' : ''}`}
                                                        >
                                                            {isApplyingPromo ? '...' : 'Apply'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-[#283862]">Grand Total</div>
                                                    <div className="text-[10px] text-gray-400">Total payable amount</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-[#c23535]">{fmt(grandTotal)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg"
                                        >
                                            Check Out Now
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#c23535]/10 flex items-center justify-center">
                                                <FaShieldAlt className="text-[#c23535] text-base" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#283862] text-sm">Secure Payment</div>
                                                <div className="text-xs text-gray-500">Industry standard encryption</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Mobile Floating Checkout Button */}
            {showMobileCheckout && cartItems.length > 0 && (
                <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
                    <button
                        onClick={handleCheckout}
                        className="w-full py-4 cursor-pointer bg-gradient-to-r from-[#283862] to-[#1c2a4a] hover:from-[#c23535] hover:to-[#a82d2d] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                        <FaCreditCard />
                        Checkout - {fmt(grandTotal)}
                    </button>
                </div>
            )}
        </div>
    );
}