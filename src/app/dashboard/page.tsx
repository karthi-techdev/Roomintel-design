"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaUser,
    FaSuitcase,
    FaSignOutAlt,
    FaCamera,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaPen,
    FaConciergeBell,
    FaStar,
    FaReceipt,
    FaClock,
    FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { authService } from '@/api/authService';


import { bookingService } from '@/api/bookingService';
import { membershipService } from '@/api/membershipService';

const Dashboard: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [membership, setMembership] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

    // Filter bookings based on selected filter
    const filteredBookings = bookings.filter(booking => {
        if (bookingFilter === 'all') return true;
        if (bookingFilter === 'upcoming') return booking.status === 'Upcoming' || booking.status === 'Confirmed' || booking.status === 'Pending';
        if (bookingFilter === 'completed') return booking.status === 'Completed';
        if (bookingFilter === 'cancelled') return booking.status === 'Cancelled';
        return true;
    });

    // Handler Functions
    const handlePayNow = async (booking: any) => {
        try {
            const amount = parseFloat(booking.price.replace('$', ''));
            const paymentRes = await bookingService.initiatePayment(amount * 100, "INR"); // Convert to paise

            if (paymentRes.status === false) {
                alert(paymentRes.message);
                return;
            }

            const orderData = paymentRes.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "RoomIntel Booking",
                description: `Payment for ${booking.roomName}`,
                order_id: orderData.razorpayOrderId,
                handler: async function (response: any) {
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    // Refresh bookings
                    window.location.reload();
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: user?.phone || '',
                },
                theme: {
                    color: "#EDA337",
                },
            };

            if (typeof window !== "undefined" && (window as any).Razorpay) {
                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    alert("Payment Failed: " + response.error.description);
                });
                rzp.open();
            } else {
                alert("Razorpay SDK not loaded. Please refresh the page.");
            }
        } catch (error: any) {
            console.error("Payment error:", error);
            alert("Payment initiation failed: " + (error.message || "Unknown error"));
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const result = await bookingService.cancelBooking(bookingId);
            if (result.status) {
                alert("Booking cancelled successfully");
                // Refresh bookings
                const bookingsRes = await bookingService.getMyBookings();
                if (bookingsRes && bookingsRes.status && Array.isArray(bookingsRes.data)) {
                    const mappedBookings = bookingsRes.data.map((bk: any) => ({
                        id: bk._id,
                        roomName: bk.room?.title || bk.roomName || "Unknown Room",
                        image: bk.room?.images?.[0] || bk.room?.image || "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=800&auto=format&fit=crop",
                        checkIn: new Date(bk.checkIn).toLocaleDateString(),
                        checkOut: new Date(bk.checkOut).toLocaleDateString(),
                        guests: `${bk.guestDetails?.adults || 0} Adults, ${bk.guestDetails?.children || 0} Child`,
                        price: `$${bk.totalAmount}`,
                        status: bk.bookingStatus || "Upcoming",
                        features: [],
                        daysLeft: Math.max(0, Math.ceil((new Date(bk.checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                    }));
                    setBookings(mappedBookings);
                }
            }
        } catch (error: any) {
            console.error("Cancel error:", error);
            alert("Failed to cancel booking: " + (error.message || "Unknown error"));
        }
    };

    const handleDownloadReceipt = (booking: any) => {
        // Generate a simple receipt as text/HTML and trigger download
        const receiptContent = `
            ROOMINTEL BOOKING RECEIPT
            ========================
            
            Booking ID: ${booking.id}
            Room: ${booking.roomName}
            Guest: ${user?.name || 'Guest'}
            Email: ${user?.email || 'N/A'}
            
            Check-in: ${booking.checkIn}
            Check-out: ${booking.checkOut}
            Guests: ${booking.guests}
            
            Total Amount: ${booking.price}
            Status: ${booking.status}
            
            Thank you for choosing RoomIntel!
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${booking.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleSupportClick = (booking: any) => {
        setSelectedBooking(booking);
        setShowSupportModal(true);
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // 1. Get Profile
                // Check if we have a token
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/');
                    return;
                }

                // Try fetching fresh profile
                let profileData = null;
                try {
                    const res = await authService.getProfile();
                    if (res && res.status && res.data) {
                        profileData = res.data;
                    }
                } catch (e) {
                    console.error("Failed to fetch profile", e);
                }

                // Fallback to local storage if API fails or for immediate display
                if (!profileData) {
                    const localUser = authService.getCurrentUser();
                    if (localUser) profileData = localUser;
                }

                if (!profileData) {
                    router.push('/');
                    return;
                }

                setUser({
                    ...profileData,
                    name: profileData.name || profileData.fullName || "Guest", // Adjust based on actual user model
                    avatar: profileData.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
                    cover: profileData.cover || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
                    memberSince: profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "January 2023",
                    status: profileData.status || "Gold Member", // dynamic status if available
                    points: profileData.points || 0, // dynamic points if available
                    stays: profileData.stays || 0
                });

                // 2. Get My Bookings
                try {
                    const bookingsRes = await bookingService.getMyBookings();
                    if (bookingsRes && bookingsRes.status && Array.isArray(bookingsRes.data)) {
                        const mappedBookings = bookingsRes.data.map((bk: any) => ({
                            id: bk._id, // or bk.bookingId if exists
                            roomName: bk.room?.title || bk.roomName || "Unknown Room",
                            image: bk.room?.images?.[0] || bk.room?.image || "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=800&auto=format&fit=crop",
                            checkIn: new Date(bk.checkIn).toLocaleDateString(),
                            checkOut: new Date(bk.checkOut).toLocaleDateString(),
                            guests: `${bk.guestDetails?.adults || 0} Adults, ${bk.guestDetails?.children || 0} Child`,
                            price: `$${bk.totalAmount}`,
                            status: bk.bookingStatus || "Upcoming",
                            features: [], // Populate if available
                            daysLeft: Math.max(0, Math.ceil((new Date(bk.checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                        }));
                        setBookings(mappedBookings);

                        // Update user stays count based on real data
                        setUser((prev: any) => ({ ...prev, stays: mappedBookings.length }));
                    }
                } catch (e) {
                    console.error("Failed to fetch bookings", e);
                }

                // 3. Get Membership
                try {
                    const membershipRes = await membershipService.getMyMembership();
                    if (membershipRes && membershipRes.status && membershipRes.data) {
                        setMembership(membershipRes.data);
                    }
                } catch (e) {
                    console.error("Failed to fetch membership", e);
                }

            } catch (error) {
                console.error("Dashboard load error", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [router]);

    // --- COUNTDOWN TIMER ---
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const handleLogout = () => {
        authService.logout();           // Clear localStorage
        router.push('/');               // Redirect to home page
        router.refresh();               // Optional: force refresh navbar state
    };

    useEffect(() => {
        // Find next upcoming booking for countdown
        const nextBooking = bookings.find(b => b.status === 'Upcoming' && b.daysLeft >= 0);
        if (!nextBooking) return;

        const targetDate = new Date(nextBooking.checkIn); // Needs accurate date parsing

        // ... (existing interval logic) ... 
        // Adapting existing interval logic slightly for dynamic target
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [bookings]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null; // Should redirect

    return (
        <div className="bg-gray-50 w-full   pb-20 min-h-screen">

            {/* --- HERO HEADER --- */}
            <div className="relative bg-[#283862] h-[300px] md:h-[350px] overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#283862]/90"></div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-6 h-full flex flex-col justify-center items-center md:items-start pt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center md:text-left"
                    >
                        <h1 className="text-4xl md:text-5xl noto-geogia-font font-bold text-white mb-2">Welcome Back, {user.name.split(' ')[0]}</h1>
                        <p className="text-gray-300 text-sm md:text-base max-w-lg">Manage your bookings, check your loyalty status, and update your personal details all in one place.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-20 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR --- */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-6">

                        {/* Profile Card */}
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                            <div className="h-32 bg-gray-200 relative">
                                <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white/40 transition-colors">
                                    <FaPen className="text-white text-xs" />
                                </div>
                            </div>

                            <div className="px-6 pb-8 relative text-center">
                                <div className="w-24 h-24 mx-auto -mt-12 mb-4 relative">
                                    <div className="w-full h-full rounded-full p-1 bg-white shadow-md">
                                        <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-[#EDA337] p-2 rounded-full cursor-pointer hover:bg-[#d8922f] border-2 border-white shadow-sm transition-colors">
                                        <FaCamera size={10} className="text-white" />
                                    </div>
                                </div>

                                <h3 className="noto-geogia-font font-bold text-xl text-[#283862] mb-1">{user.name}</h3>
                                <div className="inline-block px-3 py-1 bg-[#283862]/5 text-[#283862] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                                    {user.status}
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Bookings</div>
                                        <div className="text-xl font-bold text-[#283862]">{user.stays}</div>
                                    </div>
                                    <div className="text-center border-l border-gray-100">
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Points</div>
                                        <div className="text-xl font-bold text-[#c23535]">{user.points.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide transition-all rounded-md ${activeTab === 'profile'
                                        ? 'bg-[#283862] text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#283862]'
                                        }`}
                                >
                                    <FaUser className={activeTab === 'profile' ? 'text-[#EDA337]' : 'text-gray-400'} />
                                    Account Info
                                </button>

                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide transition-all rounded-md ${activeTab === 'bookings'
                                        ? 'bg-[#283862] text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#283862]'
                                        }`}
                                >
                                    <FaSuitcase className={activeTab === 'bookings' ? 'text-[#EDA337]' : 'text-gray-400'} />
                                    My Bookings
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all rounded-md group"
                                >
                                    <FaSignOutAlt className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="flex-1">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'profile' ? (
                                <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-white">
                                        <div>
                                            <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">Profile Information</h2>
                                            <p className="text-gray-400 text-sm mt-1">Update your account's profile information and email address.</p>
                                        </div>
                                        <button className="hidden sm:block text-xs font-bold text-white bg-[#283862] px-6 py-3 rounded-md hover:bg-[#1a2542] transition-colors shadow-md">
                                            Edit Profile
                                        </button>
                                    </div>

                                    <div className="p-8">
                                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                        <FaUser />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        defaultValue={user.name}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold focus:outline-none focus:border-[#283862] focus:bg-white transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                        <FaEnvelope />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        defaultValue={user.email}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold focus:outline-none focus:border-[#283862] focus:bg-white transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                        <FaPhoneAlt />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        defaultValue={user.phone}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold focus:outline-none focus:border-[#283862] focus:bg-white transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Location</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                        <FaMapMarkerAlt />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        defaultValue={user.address}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold focus:outline-none focus:border-[#283862] focus:bg-white transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 pt-4">
                                                <button type="button" className="w-full sm:w-auto bg-[#c23535] text-white font-bold py-3 px-8 rounded-md hover:bg-[#a12b2b] transition-colors shadow-md text-sm uppercase tracking-wider">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="bg-[#FAFAFA] p-8 border-t border-gray-100">
                                        <h3 className="text-lg noto-geogia-font font-bold text-[#283862] mb-4 flex items-center gap-2">
                                            <FaStar className="text-[#EDA337]" /> Membership Status
                                        </h3>
                                        {membership ? (
                                            <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                                        <span className="text-gray-500">Current Points ({membership.tier})</span>
                                                        <span className="text-[#283862]">{membership.points.toLocaleString()} / {membership.nextTier.maxPoints.toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#283862] to-[#c23535]"
                                                            style={{ width: `${Math.min((membership.points / membership.nextTier.maxPoints) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    {membership.nextTier.pointsNeeded > 0 ? (
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            Earn {membership.nextTier.pointsNeeded.toLocaleString()} more points to reach {membership.nextTier.name} status.
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-green-600 font-bold mt-2">
                                                            🎉 You've reached the highest tier!
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="shrink-0">
                                                    <div className="text-center mb-3">
                                                        <div className="text-2xl font-bold text-[#283862]">{membership.tier}</div>
                                                        <div className="text-xs text-gray-500">Member</div>
                                                    </div>
                                                    <button className="text-xs font-bold text-[#283862] border border-[#283862] px-4 py-2 rounded-md hover:bg-[#283862] hover:text-white transition-colors">
                                                        View Benefits
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-gray-500">Loading membership information...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 bg-white px-4 pt-8 rounded-[5px]">
                                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                                        <div>
                                            <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">My Bookings</h2>
                                            <p className="text-sm text-gray-500 mt-1">Showing <span className="font-bold text-[#283862]">{filteredBookings.length}</span> {bookingFilter === 'all' ? 'total' : bookingFilter} bookings.</p>
                                        </div>
                                        <div className="flex gap-2 text-xs font-bold">
                                            <button
                                                onClick={() => setBookingFilter('all')}
                                                className={`px-4 py-2 rounded-md shadow-sm transition-colors ${bookingFilter === 'all'
                                                    ? 'bg-[#283862] text-white'
                                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                                    }`}
                                            >
                                                All
                                            </button>
                                            <button
                                                onClick={() => setBookingFilter('upcoming')}
                                                className={`px-4 py-2 rounded-md shadow-sm transition-colors ${bookingFilter === 'upcoming'
                                                    ? 'bg-[#283862] text-white'
                                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                                    }`}
                                            >
                                                Upcoming
                                            </button>
                                            <button
                                                onClick={() => setBookingFilter('completed')}
                                                className={`px-4 py-2 rounded-md shadow-sm transition-colors ${bookingFilter === 'completed'
                                                    ? 'bg-[#283862] text-white'
                                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                                    }`}
                                            >
                                                Completed
                                            </button>
                                            <button
                                                onClick={() => setBookingFilter('cancelled')}
                                                className={`px-4 py-2 rounded-md shadow-sm transition-colors ${bookingFilter === 'cancelled'
                                                    ? 'bg-[#283862] text-white'
                                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                                    }`}
                                            >
                                                Cancelled
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {filteredBookings.map((booking) => (
                                            <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Image Section */}
                                                    <div className="w-full md:w-[280px] h-[200px] md:h-auto relative overflow-hidden shrink-0">
                                                        <img src={booking.image} alt={booking.roomName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#283862] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                                                            {booking.id}
                                                        </div>
                                                    </div>

                                                    {/* Details Section */}
                                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 mb-4">
                                                                <div>
                                                                    <h3 className="text-xl noto-geogia-font font-bold text-[#283862] group-hover:text-[#c23535] transition-colors cursor-pointer">{booking.roomName}</h3>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${booking.status === 'Upcoming' || booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                                booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                                                    'bg-gray-100 text-gray-500'
                                                                            }`}>
                                                                            {booking.status}
                                                                        </span>
                                                                        <span className="text-gray-400 text-xs">•</span>
                                                                        <span className="text-xs text-gray-500 font-medium">{booking.guests}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-xl font-bold text-[#c23535]">{booking.price}</div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Check In</div>
                                                                    <div className="flex items-center gap-2 text-[#283862] font-bold text-sm">
                                                                        <FaCalendarAlt className="text-[#c23535] text-xs" /> {booking.checkIn}
                                                                    </div>
                                                                </div>
                                                                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Check Out</div>
                                                                    <div className="flex items-center gap-2 text-[#283862] font-bold text-sm">
                                                                        <FaCalendarAlt className="text-[#c23535] text-xs" /> {booking.checkOut}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {(booking.status === 'Upcoming' || booking.status === 'Confirmed') && (
                                                            <div className="bg-[#283862] text-white p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#EDA337]">
                                                                        <FaClock />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Time Until Check-in</div>
                                                                        <div className="font-bold text-sm">Let the countdown begin!</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-3 text-center shrink-0">
                                                                    <div className="bg-white/10 px-3 py-1 rounded-sm min-w-[50px]">
                                                                        <div className="font-bold text-lg leading-none text-[#EDA337]">{timeLeft.days}</div>
                                                                        <div className="text-[8px] uppercase text-gray-300">Days</div>
                                                                    </div>
                                                                    <div className="bg-white/10 px-3 py-1 rounded-sm min-w-[50px]">
                                                                        <div className="font-bold text-lg leading-none text-[#EDA337]">{timeLeft.hours}</div>
                                                                        <div className="text-[8px] uppercase text-gray-300">Hrs</div>
                                                                    </div>
                                                                    <div className="bg-white/10 px-3 py-1 rounded-sm min-w-[50px]">
                                                                        <div className="font-bold text-lg leading-none text-[#EDA337]">{timeLeft.minutes}</div>
                                                                        <div className="text-[8px] uppercase text-gray-300">Min</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                                                            <button
                                                                onClick={() => handleDownloadReceipt(booking)}
                                                                className="flex-1 bg-white border border-gray-200 hover:border-[#283862] hover:text-[#283862] text-gray-500 text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <FaReceipt /> Receipt
                                                            </button>
                                                            <button
                                                                onClick={() => handleSupportClick(booking)}
                                                                className="flex-1 bg-white border border-gray-200 hover:border-[#c23535] hover:text-[#c23535] text-gray-500 text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <FaConciergeBell /> Support
                                                            </button>
                                                            {booking.status === 'Completed' && (
                                                                <button className="flex-1 bg-[#283862] hover:bg-[#1a2542] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors">
                                                                    Book Again
                                                                </button>
                                                            )}
                                                            {(booking.status === 'Upcoming' || booking.status === 'Confirmed' || booking.status === 'Pending') && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handlePayNow(booking)}
                                                                        className="flex-1 bg-[#283862] hover:bg-[#1a2542] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors"
                                                                    >
                                                                        Pay Now
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleCancelBooking(booking.id)}
                                                                        className="flex-1 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Support Modal */}
            {showSupportModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        <div className="bg-[#283862] p-6 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl noto-geogia-font font-bold">Customer Support</h3>
                                <button
                                    onClick={() => setShowSupportModal(false)}
                                    className="text-white hover:text-[#EDA337] transition-colors"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">We're here to help with your booking</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {selectedBooking && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Booking Reference</div>
                                    <div className="text-sm font-bold text-[#283862]">{selectedBooking.id}</div>
                                    <div className="text-xs text-gray-600 mt-1">{selectedBooking.roomName}</div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-bold text-[#283862] mb-3">Contact Us</div>
                                    <div className="space-y-3">
                                        <a
                                            href="tel:+911234567890"
                                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#283862] hover:bg-gray-50 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#283862] flex items-center justify-center text-white group-hover:bg-[#1a2542]">
                                                <FaPhoneAlt size={16} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 font-bold">Call Us</div>
                                                <div className="text-sm font-bold text-[#283862]">+91 123 456 7890</div>
                                            </div>
                                        </a>

                                        <a
                                            href="mailto:support@roomintel.com"
                                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#283862] hover:bg-gray-50 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#283862] flex items-center justify-center text-white group-hover:bg-[#1a2542]">
                                                <FaEnvelope size={16} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 font-bold">Email Us</div>
                                                <div className="text-sm font-bold text-[#283862]">support@roomintel.com</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex gap-3">
                                        <div className="text-blue-600 mt-0.5">
                                            <FaConciergeBell size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-blue-900 mb-1">24/7 Support Available</div>
                                            <div className="text-xs text-blue-700">Our team is ready to assist you with any questions or concerns about your booking.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSupportModal(false)}
                                className="w-full bg-[#283862] hover:bg-[#1a2542] text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
