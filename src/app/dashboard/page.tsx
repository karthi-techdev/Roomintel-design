"use client";

import Image from "next/image";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUser, FaSuitcase, FaSignOutAlt, FaCamera, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaCalendarAlt, FaPen, FaConciergeBell, FaStar,
  FaReceipt, FaClock, FaSave, FaTimes, FaAddressCard
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/api/authService';
import { bookingService } from '@/api/bookingService';
import { useSettingsStore } from '@/store/useSettingsStore';
import { membershipService } from '@/api/membershipService';
// At the top of Dashboard.tsx
import { useToast } from '@/components/ui/Toast';   // adjust path if needed
import { useCurrency } from '@/hooks/useCurrency';
import { usePayment } from '@/hooks/usePayment';
import { getImageUrl as getBaseImageUrl } from '@/utils/getImage';
import { FaHeart } from "react-icons/fa6";
import countryData from '../../data/countries-states-cities-database/json/countries+states.json';
import MyWishlist from '@/components/my-wishlist/MyWishlist';
import { useBillingAddressStore } from "@/store/useBillingAddressStore";
interface AddressFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}
import useMyWishListStore from "@/store/useMyWishListstore";
import { CustomAlert } from "@/components/alert/CustomAlert";
import { validateField } from "@/utils/validation";



const Dashboard: React.FC = () => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'manage-address' | 'wishlist'>('profile');
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const { settings } = useSettingsStore();

  // --- State Management ---
  const { user, isLoggedIn, logout, loadFromStorage, updateUser } = useAuthStore();
  const userId = authService.getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', email: '' });
  const [files, setFiles] = useState<{ avatar?: File; cover?: File }>({});
  const [previews, setPreviews] = useState<{ avatar?: string; cover?: string }>({});
  const [profileVersion, setProfileVersion] = useState(0);
  console.log("CurrentUser", user);

  // Bookings & Membership
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // UI States
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  console.log('Rendered Dashboard with bookings:', bookings);
  const customerId = user?._id; // get from auth / context
  const userEmail = user?.email; // from authService / user context
  // const openAddress = searchParams.get("openAddress");
  const countryCodeMap: any = {
    "India": "+91",
    "United States": "+1",
    "United Kingdom": "+44",
    "Australia": "+61",
    "Afghanistan": "+93",
    "Albania": "+355",
    "Canada": "+1"
  };
  // Read `tab` query param on client-side safely to avoid Next.js prerender bailout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'manage-address') setActiveTab('manage-address');
    } catch (e) {
      // ignore
    }
  }, []);


  const { billingAddress,
    isLoading,
    fetchBillingAddressByCustomerId, deleteBillingAddressPermanently,
    createBillingAddress,
    updateBillingAddress, setDefaultBillingAddress,
  } = useBillingAddressStore();

  const addressId = billingAddress?.addresses[0]?._id;
  console.log("addressId", addressId);


  // if (!addressId) {
  //   console.error("Address ID not found!");
  //   return;
  // }

  // Now you can send it to your API


  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
  });

  useEffect(() => {
    if (editingAddress) {
      setAddressFormData({
        name: editingAddress.fullName || "",
        email: user?.email || "", // ✅ FORCE login email
        phone: editingAddress.phone || "",
        address: editingAddress.streetAddress?.[0] || "",
        country: editingAddress.country || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        postcode: editingAddress.zipCode || "",
      });
    }
  }, [editingAddress, user]);


  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const availableStates = addressFormData.country
    ? countryData.find((c: any) => c.name === addressFormData.country)?.states || []
    : [];
  const handleInputChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "country") {
      setAddressFormData(prev => {
        const newCode = countryCodeMap[value] || "";
        const oldCode = countryCodeMap[prev.country] || "";
        let newPhone = prev.phone;

        if (!newPhone) newPhone = newCode;
        else if (oldCode && newPhone.startsWith(oldCode))
          newPhone = newCode + newPhone.slice(oldCode.length);
        else if (!oldCode && newCode && !newPhone.startsWith("+"))
          newPhone = newCode + " " + newPhone;

        return {
          ...prev,
          country: value,
          state: "",
          phone: newPhone,
        };
      });
    } else {
      setAddressFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };


  const handleCancelAddress = () => {
    // Close modal
    setShowAddressForm(false);
    setEditingAddress(null);

    // 🔥 CLEAR VALIDATION
    setErrors({});
    setTouched({});

    // Reset address form values
    setAddressFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    });
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const fieldsToValidate = ['name', 'email', 'phone', 'address', 'city', 'state', 'country', 'postcode'];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const value = addressFormData[field as keyof AddressFormData] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    // Mark all as touched
    const allTouched = fieldsToValidate.reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
    setTouched(allTouched);

    if (!isValid) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }

    return isValid;
  };

  const handleBlur = (fieldName: keyof AddressFormData) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    const value = addressFormData[fieldName] || '';
    const error = validateField(fieldName, value);

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  useEffect(() => {
    if (showAddressForm && user?.email) {
      setAddressFormData(prev => ({
        ...prev,
        email: user.email, // ✅ always login email
      }));
    }
  }, [showAddressForm, user]);


  //   const addresses = [
  //   {
  //     id: "1",
  //     fullName: "kishore",
  //     phone: "123456789",
  //     streetAddress: ["01 Bharathiyar"],
  //     city: "Tirukkoilur",
  //     state: "Tamil Nadu",
  //     zipCode: "605757",
  //     country: "India",
  //     isDefault: true,
  //   },
  //   {
  //     id: "1",
  //     fullName: "kishore",
  //     phone: "123456789",
  //     streetAddress: ["12 Street"],
  //     city: "chennai",
  //     state: "Tamil Nadu",
  //     zipCode: "605757",
  //     country: "India",
  //     isDefault: false,
  //   },
  // ];
  useEffect(() => {
    if (activeTab === "manage-address" && customerId) {
      fetchBillingAddressByCustomerId(customerId);
    }
  }, [activeTab, customerId]);

  const addresses = useMemo(() => {
    return billingAddress?.addresses || [];
  }, [billingAddress]);

  const handleSubmitAddress = async () => {
    if (!customerId) return;

    // Validate form before submission
    if (!validateForm()) return;

    const addressPayload = {
      fullName: addressFormData.name,
      phone: addressFormData.phone,
      streetAddress: [addressFormData.address],
      city: addressFormData.city,
      state: addressFormData.state,
      zipCode: addressFormData.postcode,
      country: addressFormData.country,
      email: addressFormData.email
    };

    try {
      // If user has no billing address document yet, create one
      if (!billingAddress || !billingAddress._id) {
        await createBillingAddress({
          customerId: customerId,
          addresses: [addressPayload as any] // Cast as any if Types mismatch, ideally fix Interface
        });
        toast({
          title: "Success",
          description: "Address added successfully",
          variant: "success",
        });
      }
      else if (editingAddress) {
        // ✅ UPDATE EXISTING ADDRESS
        await updateBillingAddress(
          billingAddress._id,
          editingAddress._id,
          addressPayload
        );
        toast({
          title: "Success",
          description: "Address updated successfully",
          variant: "success",
        });
      } else {
        // ✅ ADD NEW ADDRESS TO EXISTING BILLING DOC
        await updateBillingAddress(
          billingAddress._id,
          undefined,
          addressPayload
        );
        toast({
          title: "Success",
          description: "Address added successfully",
          variant: "success",
        });
      }

      setShowAddressForm(false);
      setEditingAddress(null);
      setErrors({});
      setTouched({});
      setAddressFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      });
      fetchBillingAddressByCustomerId(customerId);
    } catch (error) {
      console.error("Address save failed", error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };



  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm';
    message: string;
    id: string;
    action: 'wishlist' | 'address' | null;
  }>({
    isOpen: false,
    type: 'success',
    message: '',
    id: '',
    action: null
  });

  // Set User Data
  const { wishlists, removeWishlist, error, fetchWishlists } = useMyWishListStore();

  useEffect(() => {
    if (userId?._id) {
      fetchWishlists({ userId: userId._id, isDeleted: true });
    }
  }, [userId?._id]);

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
      } finally {
        setLoading(false);
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
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          variant: "success",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong while updating your profile.";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    // Clear files & previews
    setFiles({});
    setPreviews({});

    // 🔥 CLEAR VALIDATION
    setErrors({});
    setTouched({});

    // Reset form values
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  };


  // Payment Hook
  const { processPayment } = usePayment();

  const handlePayNow = async (booking: any) => {
    const amountStr = booking.price.replace(/[^0-9.]/g, '');
    const amount = parseFloat(amountStr);

    await processPayment({
      amount,
      currency: settings?.defaultCurrency || 'INR',
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      description: `Payment for ${booking.roomName}`,
      onSuccess: (response: any) => {
        toast({
          title: "Payment Successful",
          description: `Payment ID: ${response?.razorpay_payment_id || 'Success'}`,
          variant: "success",
        });
        window.location.reload();
      },
      onFailure: (error: any) => {
        console.error("Payment failed", error);
        toast({
          title: "Payment Failed",
          description: error?.description || "Payment could not be processed",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancelConfirm(true);
  };

  const handleDownloadReceipt = (booking: any) => {
    const receiptContent = `Avensstay BOOKING RECEIPT\nID: ${booking.id}\nRoom: ${booking.roomName}\nGuest: ${user?.name}\nTotal: ${booking.price}\nStatus: ${booking.status}`;
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
    // Handle legacy customer images that might just be a filename
    const path = filename.includes('uploads/') ? filename : `customers/${filename}`;
    return `${getBaseImageUrl(path)}?v=${profileVersion}`;
  };

  const handleRemove = async (id: string) => {
    setAlert({ isOpen: true, type: 'confirm', message: 'Do you want to remove this room?', id, action: 'wishlist' });
  };
  // The Actual Delete Action
  const handleConfirmDelete = async () => {
    try {
      const idToDelete = alert.id;
      if (!idToDelete) return;

      setAlert({ ...alert, isOpen: false });

      if (alert.action === 'wishlist') {
        await removeWishlist(idToDelete);
        await fetchWishlists({ userId: userId._id, isDeleted: true });
        setAlert({
          isOpen: true,
          type: 'success',
          message: 'Removed successfully!',
          id: '',
          action: null
        });
      } else if (alert.action === 'address') {
        if (!billingAddress?._id) return;
        await deleteBillingAddressPermanently(billingAddress._id, idToDelete);
        await fetchBillingAddressByCustomerId(customerId);
        setAlert({
          isOpen: true,
          type: 'success',
          message: 'Address removed successfully!',
          id: '',
          action: null
        });
      }

    } catch (err) {
      setAlert({ isOpen: true, type: 'error', message: 'Something went wrong', id: '', action: null });
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    if (bookingFilter === 'upcoming') return ['Upcoming', 'Confirmed', 'Pending'].includes(b.status);
    if (bookingFilter === 'completed') return b.status === 'Completed';
    if (bookingFilter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });
  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#283862] font-semibold">Loading your dashboard...</div>;
  }
  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  // 1️⃣ Define the function in your component

  const handleRemoveAddress = async (addressId: string | undefined) => {
    if (!addressId) return;
    setAlert({
      isOpen: true,
      type: 'confirm',
      message: 'Are you sure you want to remove this address?',
      id: addressId,
      action: 'address'
    });
  };

  const handleSetDefault = async (addressId: string | undefined) => {
    if (!addressId) return;
    await setDefaultBillingAddress(customerId, addressId);
    await fetchBillingAddressByCustomerId(customerId);
  };


  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

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
                  {/* <div className="text-center border-l border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Points</div>
                    <div className="text-xl font-bold text-[#c23535]">{(user.points || 0).toLocaleString()}</div>
                  </div> */}
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
                <button onClick={() => setActiveTab('manage-address')} className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide rounded-md transition-all ${activeTab === 'manage-address' ? 'bg-[#283862] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <FaAddressCard className={activeTab === 'manage-address' ? 'text-[#c23535]' : 'text-gray-400'} /> Manage Address
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide rounded-md transition-all ${activeTab === 'wishlist' ? 'bg-[#283862] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`} >
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
                  <div className="bg-[#FAFAFA] p-8 border-t border-gray-100 hidden">
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
                    {filteredBookings.length > 0 && <div className="flex gap-2 text-xs font-bold">
                      {['all', 'upcoming', 'completed', 'cancelled'].map(filter => (
                        <button key={filter} onClick={() => setBookingFilter(filter as any)} className={`px-4 py-2 rounded-md shadow-sm transition-all capitalize ${bookingFilter === filter ? 'bg-[#283862] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>{filter}</button>
                      ))}
                    </div>}
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
                              {/* <button onClick={() => handleDownloadReceipt(booking)} className="flex-1 bg-white border border-gray-200 text-gray-500 text-xs font-bold py-2 rounded hover:border-[#283862] hover:text-[#283862] transition-colors flex items-center justify-center gap-1"><FaReceipt /> Receipt</button>i,  / l/,///. */}
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
              <div className={`relative ${showAddressForm ? "blur-sm pointer-events-none" : ""}`}>
                {activeTab === "manage-address" && (
                  <div className="space-y-8 bg-white px-4 pt-8 rounded-[5px]">
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                      <div>
                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">
                          Manage Address
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Showing{" "}
                          <span className="font-bold text-[#283862]">
                            {addresses.length}
                          </span>{" "}
                          saved addresses.
                        </p>
                      </div>
                      <button onClick={handleAddNewAddress} className="mb-4 bg-[#283862] text-white px-4 py-2 rounded">+ Add New Address</button>



                    </div>

                    <div className="space-y-6">
                      {isLoading ? (
                        <div className="text-center py-20 text-gray-400 font-bold">
                          Loading addresses...
                        </div>
                      ) : addresses.length > 0 ? (
                        addresses.map((address) => (
                          <div
                            key={address._id}
                            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
                          >
                            <div className="p-6 md:p-8 flex flex-col gap-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl noto-geogia-font font-bold text-[#283862] group-hover:text-[#c23535] transition-colors">
                                    {address.fullName}
                                  </h3>
                                  {address.isDefault && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-sm">
                                      DEFAULT
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-sm text-gray-600 leading-relaxed">
                                <p>{address.streetAddress.join(", ")}</p>
                                <p>
                                  {address.city}, {address.state} {address.zipCode}
                                </p>
                                <p>{address.country}</p>
                                <p className="mt-1 font-bold text-gray-700">
                                  Phone: {address.phone}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                <button
                                  onClick={() => handleEditAddress(address)}
                                  className="flex-1 bg-white border border-gray-200 text-gray-500 text-xs font-bold py-2 rounded hover:border-[#283862] hover:text-[#283862] transition"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => handleRemoveAddress(address._id)}
                                  className="flex-1 bg-white border border-red-200 text-red-600 text-xs font-bold py-2 rounded hover:bg-red-50 transition"
                                >
                                  Remove
                                </button>

                                {!address.isDefault && (
                                  <button
                                    onClick={() => handleSetDefault(address._id)}
                                    className="flex-1 bg-[#283862] text-white text-xs font-bold py-2 rounded hover:bg-[#1a2542] transition"
                                  >
                                    Set as Default
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 text-gray-400 font-bold">
                          No addresses found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {showAddressForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Form */}
                  <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]">
                    <h2 className="text-xl font-bold text-[#283862] mb-6">
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={addressFormData.name}
                          onChange={handleInputChanges}
                          onBlur={() => handleBlur('name')}
                          placeholder="e.g. John Doe"
                          className={`w-full border rounded-sm p-4 text-sm text-[#283862] 
    bg-white focus:outline-none shadow-sm 
    ${touched.name && errors.name
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:border-[#EDA337]'
                            }`}
                        />


                        {touched.name && errors.name && (
                          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Email Address
                        </label>

                        <input
                          type="email"
                          value={addressFormData.email}
                          disabled
                          className="w-full border rounded-sm p-4 text-sm text-[#283862] 
      bg-[#efefef] cursor-not-allowed shadow-sm"
                        />

                        <p className="text-xs text-gray-400">
                          Email is linked to your account and cannot be changed
                        </p>
                      </div>

                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressFormData.phone}
                        onChange={handleInputChanges}
                        onBlur={() => handleBlur('phone')}
                        placeholder="+1 234 567 8900"
                        className={`w-full border rounded-sm p-4 text-sm text-[#283862] 
    bg-white focus:outline-none shadow-sm 
    ${touched.phone && errors.phone
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-[#EDA337]'
                          }`}
                      />

                      {touched.phone && errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>


                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={addressFormData.address}
                        onChange={handleInputChanges}
                        onBlur={() => handleBlur('address')}
                        placeholder="Street address"
                        className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm 
                        ${touched.address && errors.address
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-[#EDA337]'
                          }`}
                      />
                      {touched.address && errors.address && (
                        <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Country
                        </label>
                        <select
                          name="country"
                          value={addressFormData.country}
                          onChange={handleInputChanges}
                          onBlur={() => handleBlur('country')}
                          className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm appearance-none cursor-pointer
                          ${touched.country && errors.country
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:border-[#EDA337]'
                            }`}
                        >
                          <option value="">Select your country</option>
                          {countryData.map((c: any, i: number) => (
                            <option key={i} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        {touched.country && errors.country && (
                          <p className="text-xs text-red-500 mt-1">{errors.country}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          State
                        </label>
                        {availableStates.length > 0 ? (
                          <select
                            name="state"
                            value={addressFormData.state}
                            onChange={handleInputChanges}
                            onBlur={() => handleBlur('state')}
                            className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm appearance-none cursor-pointer
                            ${touched.state && errors.state
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-[#EDA337]'
                              }`}
                          >
                            <option value="">Select State</option>
                            {availableStates.map((s: any, i: number) => (
                              <option key={i} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            name="state"
                            value={addressFormData.state}
                            onChange={handleInputChanges}
                            onBlur={() => handleBlur('state')}
                            placeholder="e.g. NY"
                            className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm 
                            ${touched.state && errors.state
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:border-[#EDA337]'
                              }`}
                          />
                        )}
                        {touched.state && errors.state && (
                          <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Town / City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressFormData.city}
                          onChange={handleInputChanges}
                          onBlur={() => handleBlur('city')}
                          placeholder="e.g. New York"
                          className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm 
                          ${touched.city && errors.city
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:border-[#EDA337]'
                            }`}
                        />
                        {touched.city && errors.city && (
                          <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Postcode
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          value={addressFormData.postcode}
                          onChange={handleInputChanges}
                          onBlur={() => handleBlur('postcode')}
                          placeholder="e.g. 10001"
                          className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm 
        ${touched.postcode && errors.postcode
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:border-[#EDA337]'
                            }`}
                        />
                        {touched.postcode && errors.postcode && (
                          <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>
                        )}
                      </div>
                    </div>


                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        onClick={handleCancelAddress}
                        className="px-6 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSubmitAddress}
                        className="px-6 py-2 bg-[#283862] text-white rounded hover:bg-[#1a2542]"
                      >
                        {editingAddress ? "Update Address" : "Add Address"}
                      </button>
                    </div>
                  </div>
                </div>
              )}



              {activeTab === 'wishlist' &&
                <MyWishlist data={wishlists} handleRemove={handleRemove} />
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
                <a href="tel:+8618124072" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#283862] transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#283862] flex items-center justify-center text-white"><FaPhoneAlt size={16} /></div>
                  <div><div className="text-xs text-gray-500 font-bold">Call Us</div><div className="text-sm font-bold text-[#283862]">+91 8618124072</div></div>
                </a>
                <a href="mailto:support@avensstay.com" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#283862] transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#283862] flex items-center justify-center text-white"><FaEnvelope size={16} /></div>
                  <div><div className="text-xs text-gray-500 font-bold">Email Us</div><div className="text-sm font-bold text-[#283862]">support@avensstay.com</div></div>
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

      {/* CustomAlert */}
      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        onConfirm={handleConfirmDelete}
      />
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-[#283862] mb-2">Cancel Booking?</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setBookingToCancel(null);
                  }}
                  className="flex-1 py-4 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  No, Keep Booking
                </button>
                <button
                  onClick={async () => {
                    if (!bookingToCancel) return;
                    try {
                      const result = await bookingService.cancelBooking(bookingToCancel);
                      if (result.status) {
                        toast({
                          title: "Booking Cancelled",
                          description: "Your booking has been successfully cancelled.",
                          variant: "success",
                        });
                        window.location.reload();
                      }
                    } catch (error: any) {
                      toast({
                        title: "Cancellation Failed",
                        description: error.message || "Unable to cancel booking at this time.",
                        variant: "destructive",
                      });
                    } finally {
                      setShowCancelConfirm(false);
                      setBookingToCancel(null);
                    }
                  }}
                  className="flex-1 py-4 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Cancel Booking
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