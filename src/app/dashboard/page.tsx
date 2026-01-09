"use client";

import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUser, FaSuitcase, FaSignOutAlt, FaCamera, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaCalendarAlt, FaPen, FaConciergeBell, FaStar,
  FaReceipt, FaClock, FaSave, FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/api/authService';
import { bookingService } from '@/api/bookingService';
import { membershipService } from '@/api/membershipService';
import { showAlert } from '@/utils/alertStore';
import { useCurrency } from '@/hooks/useCurrency';
import { FaHeart } from "react-icons/fa6";

import MyWishlist from '@/components/my-wishlist/MyWishlist';
import { dashboardService } from "@/api/dashboardService";


const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'wishlist'>('profile');
  const { formatPrice } = useCurrency();

  // --- State Management ---
  const { user, isLoggedIn, logout, loadFromStorage, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '' });
  const [files, setFiles] = useState<{ avatar?: File; cover?: File }>({});
  const [previews, setPreviews] = useState<{ avatar?: string; cover?: string }>({});
  const [profileVersion, setProfileVersion] = useState(0);

  // Bookings & Membership
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // UI States
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  console.log('Rendered Dashboard with bookings:', bookings);
  // --- Effects ---
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isLoggedIn && !localStorage.getItem('token')) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // 1. Refresh Profile
        try {
          const res = await authService.getProfile();
          if (res?.status && res.data) {
            updateUser(res.data);
          }
        } catch (e) { console.error("Profile fetch failed", e); }

        // 2. Refresh Bookings
        try {
          const bookingsRes = await bookingService.getMyBookings();
          console.log('Fetched bookings:', bookingsRes);
          if (bookingsRes?.status && Array.isArray(bookingsRes.data)) {
            const mappedBookings = bookingsRes.data.map((bk: any) => {
              // Extract primary room data
              const primaryRoom = bk.room || bk.rooms?.[0]?.roomId || bk.rooms?.[0] || {};
              const roomImage = primaryRoom?.images?.[0] || primaryRoom?.image || bk.rooms?.[0]?.room?.images?.[0];

              // Resolve Image URL
              const finalImage = roomImage
                ? (roomImage.startsWith('http') ? roomImage : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:8000'}/uploads/rooms/${roomImage}`)
                : "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=800&auto=format&fit=crop";

              // Resolve Guest Details
              const gd = bk.guestDetails || bk.rooms?.[0]?.guestDetails || bk.guests;
              const guestsString = Array.isArray(gd)
                ? gd.map((g: any) => `${g.value} ${g.key || g.label || 'Guests'}`).join(', ')
                : [
                  (gd?.adults || 0) > 0 ? `${gd?.adults} Adult${(gd?.adults || 0) > 1 ? 's' : ''}` : null,
                  (gd?.children || 0) > 0 ? `${gd?.children} Child${(gd?.children || 0) !== 1 ? 'ren' : ''}` : null,
                  (gd?.rooms || 0) > 0 ? `${gd?.rooms} Room${(gd?.rooms || 0) > 1 ? 's' : ''}` : null
                ].filter(Boolean).join(', ') || '0 Guests';

              return {
                id: bk._id,
                roomName: primaryRoom?.title || primaryRoom?.name || bk.roomName || "Unknown Room",
                image: finalImage,
                checkIn: new Date(bk.checkIn).toLocaleDateString(),
                checkOut: new Date(bk.checkOut).toLocaleDateString(),
                guests: guestsString,
                price: formatPrice(bk.totalAmount),
                status: bk.bookingStatus || "Upcoming",
                features: [],
                originalCheckIn: bk.checkIn
              };
            });
            setBookings(mappedBookings);
          }
        } catch (e) { console.error("Bookings fetch failed", e); }

        // 3. Refresh Membership
        try {
          const membershipRes = await membershipService.getMyMembership();
          if (membershipRes?.status && membershipRes.data) {
            setMembership(membershipRes.data);
          }
        } catch (e) { console.error("Membership fetch failed", e); }

      } catch (error) {
        console.error("Dashboard load error", error);
      } finally {
        setLoading(false);
      }

      // 4. Get Total Bookings Count
      try {
  const countRes = await dashboardService.getBookingCount();
  if (countRes?.success) {
    setTotalBookings(countRes.data.totalBookings);
  }
} catch (e) {
  console.error("Booking count fetch failed", e);
}
    };

    loadDashboardData();
  }, [updateUser]);

  // Sync formData with user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Countdown Timer logic
  useEffect(() => {
    const nextBooking = bookings.find(b => (b.status === 'Upcoming' || b.status === 'Confirmed') && new Date(b.originalCheckIn) > new Date());
    if (!nextBooking) return;

    const targetDate = new Date(nextBooking.originalCheckIn);
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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bookings]);

  // --- Handlers ---
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true); // Show confirmation modal
  };

  const confirmLogout = () => {
    logout();
    router.push('/');
    router.refresh();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
      if (!isEditing) setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!isEditing) return;
    try {
      setIsSaving(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('phone', formData.phone.trim());
      data.append('address', formData.address.trim());

      if (files.avatar) data.append('avatar', files.avatar);
      if (files.cover) data.append('cover', files.cover);

      const response = await authService.updateProfile(data);
      if (response.status === true || response.data) {
        updateUser(response.data);
        setProfileVersion(prev => prev + 1);
        setPreviews({});
        setFiles({});
        setIsEditing(false);
        showAlert.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showAlert.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFiles({});
    setPreviews({});
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  };

  const handlePayNow = async (booking: any) => {
    try {
      const amountStr = booking.price.replace(/[^0-9.]/g, '');
      const amount = parseFloat(amountStr);
      const paymentRes = await bookingService.initiatePayment(amount * 100, "INR");

      if (paymentRes.status === false) {
        showAlert.error(paymentRes.message!); // Forces TS to trust you
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
        handler: function (response: any) {
          showAlert.success(`Payment Successful! ID: ${response.razorpay_payment_id}`);
          window.location.reload();
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: "#EDA337" },
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          showAlert.error("Payment Failed: " + response.error.description);
        });
        rzp.open();
      } else {
        showAlert.error("Razorpay SDK not loaded.");
      }
    } catch (error: any) {
      showAlert.error("Payment failed: " + (error.message || "Unknown error"));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const result = await bookingService.cancelBooking(bookingId);
      if (result.status) {
        showAlert.success("Booking cancelled successfully");
        window.location.reload();
      }
    } catch (error: any) {
      showAlert.error("Failed to cancel: " + (error.message || "Unknown error"));
    }
  };

  const handleDownloadReceipt = (booking: any) => {
    const receiptContent = `ROOMINTEL BOOKING RECEIPT\nID: ${booking.id}\nRoom: ${booking.roomName}\nGuest: ${user?.name}\nTotal: ${booking.price}\nStatus: ${booking.status}`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${booking.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSupportClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowSupportModal(true);
  };

  const getImageUrl = (filename: string | undefined, fallback: string) => {
    if (!filename) return fallback;
    if (filename.startsWith('http')) return filename;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}/uploads/customers/${filename}?v=${profileVersion}`;
  };

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    if (bookingFilter === 'upcoming') return ['Upcoming', 'Confirmed', 'Pending'].includes(b.status);
    if (bookingFilter === 'completed') return b.status === 'Completed';
    if (bookingFilter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });
  console.log("========",activeTab)
  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#283862] font-semibold">Loading your dashboard...</div>;
  }

  return (
    <div className="bg-gray-50 w-full pb-20 min-h-screen">
      {/* HERO HEADER */}
      <div className="relative bg-[#283862] h-[300px] md:h-[350px] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#283862]/90"></div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 h-full flex flex-col justify-center items-center md:items-start pt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl noto-geogia-font font-bold text-white mb-2">Welcome Back, {user.name?.split(' ')[0] || 'User'}</h1>
            <p className="text-gray-300 text-sm md:text-base max-w-lg">Manage your bookings, check loyalty status, and update details.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-20 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
              <div className="h-32 bg-gray-200 relative">
                <img src={previews.cover || getImageUrl(user.cover, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop")} className="w-full h-full object-cover" alt="Cover" />
                <label className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white/40 transition-colors">
                  <FaPen className="text-white text-xs" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                </label>
              </div>
              <div className="px-6 pb-8 relative text-center">
                <div className="w-24 h-24 mx-auto -mt-12 mb-4 relative">
                  <div className="w-full h-full rounded-full p-1 bg-white shadow-md">
                    {/* <Image
                      src={previews.avatar || getImageUrl(user.avatar, '/image/user.png')}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                      priority
                      width={150}
                      height={150}
                    /> */}
                    <img src={previews.avatar || getImageUrl(user.avatar, '/image/user.png')} className="w-full h-full rounded-full object-cover" alt="Profile" />
                  </div>
                  <label className="absolute bottom-1 right-1 bg-[#EDA337] p-2 rounded-full cursor-pointer hover:bg-[#d8922f] border-2 border-white shadow-sm transition-colors">
                    <FaCamera size={10} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                  </label>
                </div>
                <h3 className="noto-geogia-font font-bold text-xl text-[#283862] mb-1">{user.name}</h3>
                <div className="inline-block px-3 py-1 bg-[#283862]/5 text-[#283862] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">{user.status || 'Member'}</div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Bookings</div>
                    <div className="text-xl font-bold text-[#283862]">{bookings.length}</div>
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Points</div>
                    <div className="text-xl font-bold text-[#c23535]">{(user.points || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="p-2 space-y-1">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide rounded-md transition-all ${activeTab === 'profile' ? 'bg-[#283862] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <FaUser className={activeTab === 'profile' ? 'text-[#c23535]' : 'text-gray-400'} /> Account Info
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide rounded-md transition-all ${activeTab === 'bookings' ? 'bg-[#283862] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <FaSuitcase className={activeTab === 'bookings' ? 'text-[#c23535]' : 'text-gray-400'} /> My Bookings
                </button>


                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide rounded-md transition-all ${activeTab === 'wishlist' ? 'bg-[#283862] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50' }`} >
                  <FaHeart className={activeTab === 'wishlist' ? 'text-[#c23535]' : 'text-gray-400'} />
                  My Wishlist
                </button>



                <div className="h-[1px] bg-gray-100 mx-4 my-2"></div>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-md transition-all group"
                >
                  <FaSignOutAlt className="text-gray-400 group-hover:text-red-500" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          {/* ... [All your existing main content remains exactly the same] ... */}
          {/* (No changes needed here — kept identical to your original code) */}

          <div className="flex-1">
            
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              {activeTab === 'profile' &&
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  {/* ... Profile section unchanged ... */}
                  <div className="flex justify-between items-center p-8 border-b border-gray-100">
                    <div>
                      <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">Profile Information</h2>
                      <p className="text-gray-400 text-sm mt-1">Update your account's profile information.</p>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button onClick={handleCancelEdit} className="text-xs font-bold text-[#283862] border border-[#283862] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"><FaTimes /> Cancel</button>
                        <button onClick={handleSaveProfile} disabled={isSaving} className="text-xs font-bold text-white bg-[#283862] px-6 py-2 rounded-md hover:bg-[#1a2542] transition-colors shadow-md flex items-center gap-2 disabled:opacity-50">{isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-white bg-[#283862] px-6 py-3 rounded-md hover:bg-[#1a2542] transition-colors shadow-md flex items-center gap-2"><FaPen size={10} /> Edit Profile</button>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FaUser /></div>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} readOnly={!isEditing} className={`w-full rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold transition-all ${isEditing ? 'bg-white border-2 border-[#283862]/20' : 'bg-gray-50 border border-gray-200 cursor-not-allowed'}`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FaEnvelope /></div>
                          <input type="email" value={formData.email} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold cursor-not-allowed opacity-70" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FaPhoneAlt /></div>
                          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} readOnly={!isEditing} className={`w-full rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold transition-all ${isEditing ? 'bg-white border-2 border-[#283862]/20' : 'bg-gray-50 border border-gray-200 cursor-not-allowed'}`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Location / Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><FaMapMarkerAlt /></div>
                          <input type="text" name="address" value={formData.address} onChange={handleInputChange} readOnly={!isEditing} placeholder={isEditing ? "Enter your address" : "Not provided"} className={`w-full rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold transition-all ${isEditing ? 'bg-white border-2 border-[#283862]/20' : 'bg-gray-50 border border-gray-200 cursor-not-allowed'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Membership Section */}
                  <div className="bg-[#FAFAFA] p-8 border-t border-gray-100">
                    <h3 className="text-lg noto-geogia-font font-bold text-[#283862] mb-4 flex items-center gap-2"><FaStar className="text-[#EDA337]" /> Membership Status</h3>
                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                          <span className="text-gray-500">Current Points {membership?.tier ? `(${membership.tier})` : ''}</span>
                          <span className="text-[#283862]">{(membership?.points || user.points || 0).toLocaleString()} / {membership?.nextTier?.maxPoints?.toLocaleString() || '5,000'}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#283862] to-[#c23535]" style={{ width: `${Math.min(((membership?.points || user.points || 0) / (membership?.nextTier?.maxPoints || 5000)) * 100, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {membership?.nextTier?.pointsNeeded > 0
                            ? `Earn ${membership.nextTier.pointsNeeded.toLocaleString()} more points to reach ${membership.nextTier.name} status.`
                            : "You've reached the top loyalty tier!"}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <button className="text-xs font-bold text-[#283862] border border-[#283862] px-4 py-2 rounded-md hover:bg-[#283862] hover:text-white transition-colors">View Benefits</button>
                      </div>
                    </div>
                  </div>
                </div>}
  {activeTab === 'bookings' &&
                <div className="space-y-8 bg-white px-4 pt-8 rounded-[5px]">
                  <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">My Bookings</h2>
                      <p className="text-sm text-gray-500 mt-1">Showing <span className="font-bold text-[#283862]">{filteredBookings.length}</span> {bookingFilter} bookings.</p>
                    </div>
                    <div className="flex gap-2 text-xs font-bold">
                      {['all', 'upcoming', 'completed', 'cancelled'].map(filter => (
                        <button key={filter} onClick={() => setBookingFilter(filter as any)} className={`px-4 py-2 rounded-md shadow-sm transition-all capitalize ${bookingFilter === filter ? 'bg-[#283862] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>{filter}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-[280px] h-[200px] md:h-auto relative overflow-hidden shrink-0">
                            <img src={booking.image} alt={booking.roomName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-xl noto-geogia-font font-bold text-[#283862] group-hover:text-[#c23535] transition-colors">{booking.roomName}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${['Upcoming', 'Confirmed'].includes(booking.status) ? 'bg-green-100 text-green-700' : booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{booking.status}</span>
                                    <span className="text-gray-500 text-xs">{booking.guests}</span>
                                  </div>
                                </div>
                                <div className="text-xl font-bold text-[#c23535]">{booking.price}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                  <div className="text-[10px] text-gray-400 font-bold mb-1">Check In</div>
                                  <div className="flex items-center gap-2 text-[#283862] font-bold text-sm"><FaCalendarAlt className="text-[#c23535] text-xs" /> {booking.checkIn}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                  <div className="text-[10px] text-gray-400 font-bold mb-1">Check Out</div>
                                  <div className="flex items-center gap-2 text-[#283862] font-bold text-sm"><FaCalendarAlt className="text-[#c23535] text-xs" /> {booking.checkOut}</div>
                                </div>
                              </div>
                            </div>
                            {['Upcoming', 'Confirmed'].includes(booking.status) && (
                              <div className="bg-[#283862] text-white p-4 rounded-md flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3"><FaClock className="text-[#EDA337]" /> <span className="text-sm font-bold">Check-in starts in:</span></div>
                                <div className="flex gap-2 font-bold text-sm">
                                  <span className="bg-white/10 px-2 rounded">{timeLeft.days}d</span>
                                  <span className="bg-white/10 px-2 rounded">{timeLeft.hours}h</span>
                                  <span className="bg-white/10 px-2 rounded">{timeLeft.minutes}m</span>
                                </div>
                              </div>
                            )}
                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                              <button onClick={() => handleDownloadReceipt(booking)} className="flex-1 bg-white border border-gray-200 text-gray-500 text-xs font-bold py-2 rounded hover:border-[#283862] hover:text-[#283862] transition-colors flex items-center justify-center gap-1"><FaReceipt /> Receipt</button>
                              <button onClick={() => handleSupportClick(booking)} className="flex-1 bg-white border border-gray-200 text-gray-500 text-xs font-bold py-2 rounded hover:border-[#c23535] hover:text-[#c23535] transition-colors flex items-center justify-center gap-1"><FaConciergeBell /> Support</button>
                              {['Upcoming', 'Confirmed', 'Pending'].includes(booking.status) && (
                                <>
                                  <button onClick={() => handlePayNow(booking)} className="flex-1 bg-[#283862] text-white text-xs font-bold py-2 rounded hover:bg-[#1a2542] transition-colors">Pay Now</button>
                                  <button onClick={() => handleCancelBooking(booking.id)} className="flex-1 bg-white border border-red-200 text-red-600 text-xs font-bold py-2 rounded hover:bg-red-50 transition-colors">Cancel</button>
                                </>
                              )}
                              {booking.status === 'Completed' && <button className="flex-1 bg-[#283862] text-white text-xs font-bold py-2 rounded">Book Again</button>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : <div className="text-center py-20 text-gray-400 font-bold">No bookings found in this category.</div>}
                  </div>
                </div>}
                  {activeTab === 'wishlist' &&
                  <MyWishlist/>
                  }
            
             
              
            </motion.div>
            
          </div>
        </div>
      </div>

      {/* SUPPORT MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-[#283862] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl noto-geogia-font font-bold">Customer Support</h3>
              <button onClick={() => setShowSupportModal(false)} className="hover:text-[#EDA337] transition-colors"><FaTimes size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              {selectedBooking && <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"><div className="text-xs text-gray-500 font-bold mb-1">Booking Ref: {selectedBooking.id}</div><div className="text-sm font-bold text-[#283862]">{selectedBooking.roomName}</div></div>}
              <div className="space-y-4">
                <a href="tel:+911234567890" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#283862] transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#283862] flex items-center justify-center text-white"><FaPhoneAlt size={16} /></div>
                  <div><div className="text-xs text-gray-500 font-bold">Call Us</div><div className="text-sm font-bold text-[#283862]">+91 123 456 7890</div></div>
                </a>
                <a href="mailto:support@roomintel.com" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#283862] transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#283862] flex items-center justify-center text-white"><FaEnvelope size={16} /></div>
                  <div><div className="text-xs text-gray-500 font-bold">Email Us</div><div className="text-sm font-bold text-[#283862]">support@roomintel.com</div></div>
                </a>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="w-full bg-[#283862] text-white font-bold py-3 rounded-lg hover:bg-[#1a2542] transition-colors">Close</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <FaSignOutAlt className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-[#283862] mb-2">Logout Confirmation</h3>
                <p className="text-gray-600 text-sm">Are you sure you want to logout from your account?</p>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  onClick={cancelLogout}
                  className="flex-1 py-4 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-4 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;