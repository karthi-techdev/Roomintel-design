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
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore'; // adjust path if needed
import { authService } from '@/api/authService';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');

  // Dashboard Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{ name: string; phone: string; address: string; email: string }>({
    name: '',
    phone: '',
    address: '',
    email: '',
  });
  const [files, setFiles] = useState<{ avatar?: File, cover?: File }>({});
  const [previews, setPreviews] = useState<{ avatar?: string, cover?: string }>({});
  const [profileVersion, setProfileVersion] = useState(0);
  // Zustand auth state
  const { user, isLoggedIn, logout, loadFromStorage, updateUser } = useAuthStore();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load user from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Sync formData with user when user loads
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

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn && !user) {
      router.push('/');
    }
  }, [isLoggedIn, user, router]);

  // Countdown timer (demo: 2 days from now)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);

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
  }, []);

  // Real logout using Zustand store
  const handleLogout = () => {
    logout(); // Clears store + localStorage
    router.push('/');
    router.refresh();
  };

  // --- Profile Edit Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: { name: string; phone: string; address: string; email: string }) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));

      // If we are not in edit mode, we might want to toggle it or auto-save
      // Here, let's just make sure we are "editing" if we change a picture
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
        const updatedUser = response.data;

        // Update store with new user data
        updateUser(updatedUser);

        // Force image refresh by incrementing version
        setProfileVersion(prev => prev + 1);

        // Clear local previews and files
        setPreviews({});
        setFiles({});

        // Exit edit mode
        setIsEditing(false);

        // Optional: success feedback
        // toast({ title: "Success", description: "Profile updated successfully!", variant: "success" });
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFiles({});
    setPreviews({});
    // Reset formData to current user state
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  };

  const getImageUrl = (filename: string | undefined, fallback: string) => {
    if (!filename) return fallback;

    // If it's already a full URL (rare), return it
    if (filename.startsWith('http')) return filename;

    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/customers/${filename}`;
  };

  // Mock bookings
  const bookings = [
    {
      id: "BK-7829",
      roomName: "Oceanfront Paradise Suite",
      image: "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=800&auto=format&fit=crop",
      checkIn: "Dec 24, 2023",
      checkOut: "Dec 28, 2023",
      guests: "2 Adults, 1 Child",
      price: "$2,450",
      status: "Upcoming",
      features: ["Ocean View", "Breakfast Inc."],
    },
    {
      id: "BK-5521",
      roomName: "Mountain Retreat",
      image: "https://images.unsplash.com/photo-1512918760532-3ed465901861?q=80&w=800&auto=format&fit=crop",
      checkIn: "Aug 15, 2023",
      checkOut: "Aug 20, 2023",
      guests: "2 Adults",
      price: "$1,800",
      status: "Completed",
      features: ["Spa Access", "Dinner Inc."],
    }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 w-full pb-20 min-h-screen">
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
            <h1 className="text-4xl md:text-5xl noto-geogia-font font-bold text-white mb-2">
              Welcome Back, {user.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-lg">
              Manage your bookings, check your loyalty status, and update your personal details all in one place.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-20 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
              <div className="h-32 bg-gray-200 relative">
                <img
                  src={previews.cover || getImageUrl(user.cover, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop")}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <label className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white/40 transition-colors">
                  <FaPen className="text-white text-xs" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                </label>
              </div>

              <div className="px-6 pb-8 relative text-center">
                <div className="w-24 h-24 mx-auto -mt-12 mb-4 relative">
                  <div className="w-full h-full rounded-full p-1 bg-white shadow-md">
                    <img
                      src={previews.avatar || getImageUrl(user.avatar, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop")}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-1 right-1 bg-[#EDA337] p-2 rounded-full cursor-pointer hover:bg-[#d8922f] border-2 border-white shadow-sm transition-colors">
                    <FaCamera size={10} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                  </label>
                </div>

                <h3 className="noto-geogia-font font-bold text-xl text-[#283862] mb-1">{user.name || 'User'}</h3>
                <div className="inline-block px-3 py-1 bg-[#283862]/5 text-[#283862] text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                  {user.status || 'Member'}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Bookings</div>
                    <div className="text-xl font-bold text-[#283862]">{user.stays || 0}</div>
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

                <div className="h-[1px] bg-gray-100 mx-4 my-2"></div>

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
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="text-xs font-bold text-[#283862] border border-[#283862] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="text-xs font-bold text-white bg-[#283862] px-6 py-2 rounded-md hover:bg-[#1a2542] transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-white bg-[#283862] px-6 py-3 rounded-md hover:bg-[#1a2542] transition-colors shadow-md flex items-center gap-2"
                      >
                        <FaPen size={10} /> Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <FaUser />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            className={`w-full rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold transition-all ${isEditing
                              ? 'bg-white border-2 border-[#283862]/20 focus:border-[#283862] focus:ring-0 outline-none'
                              : 'bg-gray-50 border border-gray-200 cursor-not-allowed'
                              }`}
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
                            value={formData.email || ''}
                            readOnly
                            title="Email cannot be changed"
                            className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold cursor-not-allowed opacity-70"
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
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            className={`w-full rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold transition-all ${isEditing
                              ? 'bg-white border-2 border-[#283862]/20 focus:border-[#283862] focus:ring-0 outline-none'
                              : 'bg-gray-50 border border-gray-200 cursor-not-allowed'
                              }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Location / Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <FaMapMarkerAlt />
                          </div>
                          <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            placeholder={isEditing ? "Enter your address" : "Not provided"}
                            className={`w-full rounded-md py-3 pl-11 pr-4 text-sm text-[#283862] font-semibold transition-all ${isEditing
                              ? 'bg-white border-2 border-[#283862]/20 focus:border-[#283862] focus:ring-0 outline-none'
                              : 'bg-gray-50 border border-gray-200 cursor-not-allowed'
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FAFAFA] p-8 border-t border-gray-100">
                    <h3 className="text-lg noto-geogia-font font-bold text-[#283862] mb-4 flex items-center gap-2">
                      <FaStar className="text-[#EDA337]" /> Membership Status
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                          <span className="text-gray-500">Current Points</span>
                          <span className="text-[#283862]">{(user.points || 0).toLocaleString()} / 5,000</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#283862] to-[#c23535]"
                            style={{ width: `${Math.min(((user.points || 0) / 5000) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Earn {Math.max(5000 - (user.points || 0), 0).toLocaleString()} more points to reach Platinum status.</p>
                      </div>
                      <div className="shrink-0">
                        <button className="text-xs font-bold text-[#283862] border border-[#283862] px-4 py-2 rounded-md hover:bg-[#283862] hover:text-white transition-colors">
                          View Benefits
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 bg-white px-4 pt-8 rounded-[5px]">
                  <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">My Bookings</h2>
                      <p className="text-sm text-gray-500 mt-1">Showing <span className="font-bold text-[#283862]">{bookings.length}</span> active and past bookings.</p>
                    </div>
                    <div className="flex gap-2 text-xs font-bold">
                      <button className="px-4 py-2 bg-[#283862] text-white rounded-md shadow-sm">All</button>
                      <button className="px-4 py-2 bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 rounded-md">Upcoming</button>
                      <button className="px-4 py-2 bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 rounded-md">Completed</button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-[280px] h-[200px] md:h-auto relative overflow-hidden shrink-0">
                            <img src={booking.image} alt={booking.roomName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#283862] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                              {booking.id}
                            </div>
                          </div>

                          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 mb-4">
                                <div>
                                  <h3 className="text-xl noto-geogia-font font-bold text-[#283862] group-hover:text-[#c23535] transition-colors cursor-pointer">{booking.roomName}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${booking.status === 'Upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
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

                            {booking.status === 'Upcoming' && (
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
                              <button className="flex-1 bg-white border border-gray-200 hover:border-[#283862] hover:text-[#283862] text-gray-500 text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors flex items-center justify-center gap-2">
                                <FaReceipt /> Receipt
                              </button>
                              <button className="flex-1 bg-white border border-gray-200 hover:border-[#c23535] hover:text-[#c23535] text-gray-500 text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors flex items-center justify-center gap-2">
                                <FaConciergeBell /> Support
                              </button>
                              {booking.status === 'Completed' && (
                                <button className="flex-1 bg-[#283862] hover:bg-[#1a2542] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-md transition-colors">
                                  Book Again
                                </button>
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
    </div>
  );
};

export default Dashboard;
