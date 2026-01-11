"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { authService } from '../../../api/authService';
import { bookingService } from '../../../api/bookingService';
import countryData from '../../../data/countries-states-cities-database/json/countries+states.json';
import { showAlert } from '../../../utils/alertStore';
import { useCartStore } from '@/store/useCartStore';
import { siteService } from '../../../api/siteService';
import { FaCheckCircle, FaHome, FaListAlt, FaArrowRight } from 'react-icons/fa';
import { useCurrency } from '@/hooks/useCurrency';
import { useSettingsStore } from '@/store/useSettingsStore';
import { usePayment } from '@/hooks/usePayment';
import RoomCartCard from '@/components/room-view/RoomCardSingle';
import { Room, useRoomStore } from '@/store/useRoomStore';
import { useSearchParams } from 'next/navigation';
import { useBillingAddressStore } from '@/store/useBillingAddressStore';
import { BillingAddress } from '@/api/billingAddressService';
interface SingleBookingInfo {
    room: number;
    adults: number;
    children: number;
    roomTotal: number;
    serviceTotal: number;
    tax: number;
    serviceCharge: number;
    grandTotal: number;
}

interface RoomCheckoutProps {
    onBack?: () => void;
    onPlaceOrder?: () => void;
    params: {
        slug?: string[];
    };
    handleUpdateGuests: () => void;
    handleUpdateRoom: () => void;
    handleUpdateChildren: () => void;
    handleUpdateAdult: () => void;
    onUpdate: (data: any) => void;
}

const RoomCheckout: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    // Set User Data
    const user = authService.getCurrentUser();

    // ============Single booking 
    const { fetchRoomBySlug, selectedRoom } = useRoomStore();


    const [selectedRoomByslug, setSelectedRoomByslug] = useState<Room>();

    const [singleItemInfo, setSingleItemInfo] = useState<SingleBookingInfo>({
        room: 0,
        adults: 0,
        children: 0,
        roomTotal: 0,
        serviceTotal: 0,
        tax: 0,
        serviceCharge: 0,
        grandTotal: 0,
    });
    const [bookingId, setBookingId] = useState<string>('')

    const { createBillingAddress, billingAddress, isLoading, fetchBillingAddressByCustomerId, setDefaultBillingAddress, updateBillingAddress } = useBillingAddressStore();
    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const addresses = billingAddress?.addresses || [];
    //-----
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const def = addresses.find(a => a.isDefault);
            const initialAddr = def || addresses[0];
            setSelectedAddressId(initialAddr._id);
            setFormData(prev => ({
                ...prev,
                name: initialAddr.fullName || '',
                email: initialAddr.email || prev.email || user?.email || '',
                phone: initialAddr.phone || '',
                address: initialAddr.streetAddress?.[0] || '',
                city: initialAddr.city || '',
                state: initialAddr.state || '',
                postcode: initialAddr.zipCode || '',
                country: initialAddr.country || ''
            }));
        }
    }, [addresses]);

    // Validate form immediately when opening 'Add Address'
    useEffect(() => {
        if (showAddressForm) {
            validateAddressForm();
        }
    }, [showAddressForm]);

    // Type-safe function to handle selecting an address
    const handleSelectAddress = async (addressId: string | undefined) => {
        if (!addressId) return; // safety check

        setSelectedAddressId(addressId);

        // Update formData to match selected address
        const selectedAddr = addresses.find(a => a._id === addressId);
        if (selectedAddr) {
            setFormData(prev => ({
                ...prev,
                name: selectedAddr.fullName || '',
                email: selectedAddr.email || prev.email || user?.email || '',
                phone: selectedAddr.phone || '',
                address: selectedAddr.streetAddress?.[0] || '',
                city: selectedAddr.city || '',
                state: selectedAddr.state || '',
                postcode: selectedAddr.zipCode || '',
                country: selectedAddr.country || ''
            }));
            // Clear any validation errors since this is a valid saved address
            setErrors({});
            setTouched({});
        }

        try {
            // Update default billing address in the store
            await useBillingAddressStore.getState().setDefaultBillingAddress(userId, addressId);

            // Refresh addresses for the user
            await fetchBillingAddressByCustomerId(userId);
        } catch (err) {
            showAlert.error("Failed to update default address");
        }
    };




    // assume user already exists (customer id)
    const userId = user?._id; // or user.id based on your auth

    const validateAddressForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email))
            newErrors.email = "Invalid email";

        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.postcode.trim()) newErrors.postcode = "Postcode is required";

        setErrors(newErrors);

        // 🔥 THIS IS THE KEY PART
        setTouched({
            name: true,
            email: true,
            phone: true,
            address: true,
            country: true,
            state: true,
            city: true,
            postcode: true,
        });

        return Object.keys(newErrors).length === 0;
    };


    const resetAddressForm = () => {
        setFormData(prev => ({
            ...prev,          // keep name, email, company
            phone: "",
            address: "",
            city: "",
            state: "",
            postcode: "",
            country: "",
            notes: "",
        }));

        setErrors({});       // optional: clear validation errors
        setTouched({});      // optional: clear touched fields
    };


    const handleCancelAddressForm = () => {
        // If we have a selected address, revert formData to it
        if (selectedAddressId) {
            handleSelectAddress(selectedAddressId);
        } else {
            resetAddressForm();
        }
        setShowAddressForm(false);
    };


    const handleSaveAddress = async () => {
        const isValid = validateAddressForm();

        // ❌ IF ERROR → STOP EVERYTHING
        if (!isValid) {
            return;
        }

        try {
            const storeState = useBillingAddressStore.getState();
            const billingAddress = storeState.billingAddress;

            const addressPayload = {
                fullName: formData.name,
                email: formData.email,
                phone: formData.phone,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                zipCode: formData.postcode,
                streetAddress: [formData.address],
                isDefault: true,
            };

            if (!billingAddress?._id) {
                await createBillingAddress({
                    customerId: userId,
                    addresses: [addressPayload],
                });
            } else {
                await updateBillingAddress(
                    billingAddress._id,
                    "new",
                    addressPayload
                );
            }

            // Refresh addresses
            await fetchBillingAddressByCustomerId(userId);

            showAlert.success("Address saved successfully");

            // After saving, we want to select the newly added/updated address (which is set as default)
            const updatedAddresses = useBillingAddressStore.getState().billingAddress?.addresses || [];
            // Find the one we just added (it is Default, or we can fallback to the last one)
            const newDefault = updatedAddresses.find(a => a.isDefault) || updatedAddresses[updatedAddresses.length - 1];

            if (newDefault) {
                handleSelectAddress(newDefault._id);
            } else {
                resetAddressForm();
            }

            setShowAddressForm(false);

        } catch (err) {
            console.error(err);
            showAlert.error("Failed to save address");
        }
    };






    useEffect(() => {
        if (user?._id) {
            fetchBillingAddressByCustomerId(user._id);
        }
    }, [user?._id]);
    useEffect(() => {
        if (user?.billingAddress) {
            setIsAddressSaved(true);
            setFormData(prev => ({
                ...prev,
                address: user.billingAddress.streetAddress?.[0] || "",
                city: user.billingAddress.city || "",
                state: user.billingAddress.state || "",
                country: user.billingAddress.country || "",
                postcode: user.billingAddress.zipCode || "",
            }));
        }
    }, [user]);



    // Slug check
    const slug = params?.slug as string[] | undefined;
    const isSlug = slug ? slug?.[0] : null;

    // Fetch room
    useEffect(() => {
        if (isSlug) {
            fetchRoomBySlug(isSlug);
        };

    }, [isSlug]);

    useEffect(() => {
        if (selectedRoom) {
            setSelectedRoomByslug(selectedRoom);
            setFormData(prev => {
                if (prev.email) return prev;
                return {
                    ...prev,
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                };
            });
        }
    }, [selectedRoom]);


    const onUpdateGetData = React.useCallback((data: any) => {
        setSingleItemInfo(prev => {
            // 🔐 prevent unnecessary updates
            if (
                prev.room === data?.room &&
                prev.roomTotal === data?.roomTotal &&
                prev.serviceTotal === data?.serviceTotal &&
                prev.tax === data?.tax &&
                prev.serviceCharge === data?.serviceCharge &&
                prev.grandTotal === data?.grandTotal
            ) {
                return prev;
            }

            return {
                ...prev,
                room: data?.room,
                roomTotal: data?.roomTotal,
                serviceTotal: data?.serviceTotal,
                tax: data?.tax,
                serviceCharge: data?.serviceCharge,
                grandTotal: data?.grandTotal
            };
        });
    }, []);




    // --- STORE ---
    const { cartItems, fetchCart, clearCart } = useCartStore();
    const { settings } = useSettingsStore();

    // Payment Hook
    const { processPayment } = usePayment();

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

    const { formatPrice } = useCurrency();
    const fmt = (amount: number) => formatPrice(amount);

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

    useEffect(() => {
        if (!isSlug) return;

        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const adults = searchParams.get('adults');
        const children = searchParams.get('children');
        const rooms = searchParams.get('rooms');
        const roomTotal = searchParams.get('roomTotal');
        const tax = searchParams.get('tax');
        const serviceCharge = searchParams.get('serviceCharge');
        const grandTotal = searchParams.get('grandTotal');

        if (checkIn && checkOut) {
            setDates({
                checkIn,
                checkOut
            });
        }

        if (grandTotal && roomTotal && tax && serviceCharge) {
            setSingleItemInfo(prev => ({
                ...prev,
                room: Number(rooms) || 1,
                adults: Number(adults) || 2,
                children: Number(children) || 0,
                roomTotal: Number(roomTotal) || 0,
                serviceTotal: 0, // no extras in single booking yet
                tax: Number(tax) || 0,
                serviceCharge: Number(serviceCharge) || 0,
                grandTotal: Number(grandTotal) || 0,
            }));
        }
    }, [searchParams, isSlug]);
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
            if (cartItem.checkIn && cartItem.checkOut) {
                setDates({
                    checkIn: new Date(cartItem.checkIn).toISOString().split('T')[0],
                    checkOut: new Date(cartItem.checkOut).toISOString().split('T')[0]
                });
            }

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
    const validateField = (name: string, value: string) => {
        switch (name) {
            case "phone":
                if (!value.trim()) return "Phone is required";
                if (!/^[0-9+()\s-]+$/.test(value)) return "Invalid phone number";
                break;
            case "postcode":
                if (!value.trim()) return "Postcode is required";
                break;
            case "name":
                if (!value.trim()) return "Name is required";
                break;
            case "email":
                if (!value.trim()) return "Email is required";
                if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email";
                break;
            case "address":
                if (!value.trim()) return "Address is required";
                break;
            case "city":
                if (!value.trim()) return "City is required";
                break;
            case "state":
                if (!value.trim()) return "State is required";
                break;
            case "country":
                if (!value.trim()) return "Country is required";
                break;
            default:
                return "";
        }
        return "";
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
        newErrors.address = validateField('address', formData.address);
        newErrors.city = validateField('city', formData.city);
        newErrors.state = validateField('state', formData.state);
        newErrors.country = validateField('country', formData.country);

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
            postcode: true,
            address: true,
            city: true,
            state: true,
            country: true
        });

        return Object.keys(newErrors).length === 0;
    };

    // --- HANDLERS ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'country') {
            setFormData(prev => {
                const newCode = countryCodeMap[value] || "";
                const oldCode = countryCodeMap[prev.country] || "";
                let newPhone = prev.phone;

                // If phone is empty, just set the new code
                if (!newPhone || newPhone.trim() === "") {
                    newPhone = newCode;
                }
                // If phone starts with old code, replace it with new code
                else if (oldCode && newPhone.startsWith(oldCode)) {
                    newPhone = newCode + newPhone.slice(oldCode.length);
                }
                // If old code was empty (e.g. initial selection) and phone exists, prepend new code
                else if (!oldCode && newCode && !newPhone.startsWith("+")) {
                    newPhone = newCode + " " + newPhone;
                }

                return {
                    ...prev,
                    [name]: value,
                    state: '',
                    phone: newPhone
                };
            });
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

    const finalizeOrder = async (data: any) => {
        await clearCart();
        setConfirmedBookingDetails({
            id: data.id,
            totalAmount: data.totalAmount,
            points: data.points,
            paymentMode: data.paymentMode
        });
        setIsBookingConfirmed(true);
        setIsProcessing(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePlaceOrder = async () => {

        if (!isSlug && cartItems.length === 0) return showAlert.error("Your cart is empty and valid booking details are missing.");

        // Validate form
        if (!validateForm()) {
            showAlert.error("Please fix the errors in the form before proceeding.");
            setIsProcessing(false);
            return;
        }

        setIsProcessing(true);

        // Correctly determine the total amount based on booking type
        const finalTotalAmount = isSlug ? (singleItemInfo?.grandTotal || 0) : totals.grandTotal;

        const bookedRooms = isSlug ? [{
            roomId: selectedRoomByslug?._id,
            roomName: selectedRoomByslug?.title,
            price: singleItemInfo.grandTotal,
            // checkIn: item.checkIn || dates.checkIn,
            // checkOut: item.checkOut || dates.checkOut,
            guestDetails: {
                adults: singleItemInfo.adults,
                children: singleItemInfo.children
            }
        }
        ]
            :
            cartItems.map(item => ({
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
            user: user?._id,
            room: primaryRoomId,
            rooms: bookedRooms,
            checkIn: dates.checkIn,
            checkOut: dates.checkOut,
            totalAmount: finalTotalAmount,
            specialRequests: formData.notes,
            billingAddressId: selectedAddressId,
            paymentStatus: 'Pending',
            paymentMode: paymentMethod === 'cash' ? 'Cash' : 'Card',
            bookingStatus: 'Pending'
        };
        try {
            if (paymentMethod === 'cash') {
                // CASH FLOW
                const bookingData = await bookingService.createBooking(bookingPayload);
                setBookingId(bookingData._id);
                const pointsEarned = Math.floor(finalTotalAmount * 10);
                showAlert.success(`Booking Confirmed! Please pay on arrival.\n\n🎉 You earned ${pointsEarned} loyalty points!`);
                await finalizeOrder(bookingPayload);


            } else if (paymentMethod === 'card') {
                // RAZORPAY / ONLINE FLOW
                await processPayment({
                    amount: finalTotalAmount,
                    currency: settings?.defaultCurrency || 'INR',
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    description: `Booking for ${formData.name}`,
                    onSuccess: async (response) => {
                        // Update payload with p    ayment success
                        const paidPayload = {
                            ...bookingPayload,
                            paymentStatus: 'Paid',
                            paymentMode: 'Card',
                        };

                        try {
                            await bookingService.createBooking(paidPayload);
                            const pointsEarned = Math.floor(finalTotalAmount * 10);
                            showAlert.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}\n\n🎉 You earned ${pointsEarned} loyalty points!`);
                            await finalizeOrder(bookingPayload);
                        } catch (err) {
                            showAlert.error("Payment successful but booking failed to save. Please contact support.");
                            setIsProcessing(false);
                        }
                    },
                    onFailure: (error) => {
                        // Only log real errors to avoid "Console Error" overlay for cancellations
                        if (error?.message !== "Payment cancelled by user") {
                            console.error("Payment failed", error);
                        }
                        setIsProcessing(false);
                    }
                });
            } else {
                showAlert.warning("Selected payment method not supported yet.");
                setIsProcessing(false);
            }

        } catch (error: any) {
            showAlert.error("Order failed: " + (error.response?.data?.message || error.message));
            setIsProcessing(false);
        }
    };



    if (isBookingConfirmed) {
        return (
            <div className="w-full pb-20 min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-[500px]  mt-25 w-full bg-white rounded-[30px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    {/* Top Accent Bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-[#EDA337] via-[#f1bb6d] to-[#EDA337]"></div>

                    <div className="p-6 text-center">
                        {/* Success Icon */}
                        <div className="mb-5 relative inline-block">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
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
                        <p className="text-gray-500 text-[12px] mb-6 max-w-md mx-auto">
                            Thank you for choosing AvensStay. Your reservation has been successfully processed and a confirmation email is on its way.
                        </p>

                        {/* Details Card */}
                        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 md:p-4 mb-8 text-left shadow-sm">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-4">

                                <div className="col-span-2 border-b border-gray-100 pb-6">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                                        Booking ID
                                    </label>
                                    <p className="text-[14px] font-black text-[#283862] tracking-tight uppercase">
                                        #{bookingId || "RT-LOADING"}
                                    </p>
                                </div>

                                <div className="col-span-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                                        Total Amount
                                    </label>
                                    <p className="text-[14px] font-black text-[#c23535]">
                                        {fmt(confirmedBookingDetails?.totalAmount || 0)}
                                    </p>
                                </div>

                                <div className="col-span-1 border-l border-gray-100 pl-6">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                                        Payment Status
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${confirmedBookingDetails?.paymentMode === 'Cash' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                        <p className="text-[14px] font-black text-[#283862] uppercase tracking-tighter">
                                            {confirmedBookingDetails?.paymentMode === 'Cash' ? 'Pay on Arrival' : 'Paid Online'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-3 py-2 bg-[#283862] text-white font-bold rounded-xl hover:bg-[#1a2542] transition-all transform hover:scale-105 active:scale-95 text-sm uppercase tracking-wider shadow-lg"
                            >
                                View Dashboard
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="px-3 py-2 bg-white border-2 border-[#283862] text-[#283862] font-bold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
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
                        <RoomCartCard
                            selectedRoomByslug={selectedRoomByslug}
                            checkIn={dates.checkIn}
                            checkOut={dates.checkOut}
                            availableServices={availableServices}
                            onUpdate={onUpdateGetData}
                            initialAdults={searchParams.get('adults') ? Number(searchParams.get('adults')) : undefined}
                            initialChildren={searchParams.get('children') ? Number(searchParams.get('children')) : undefined}
                        />
                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-8 pb-4 border-b border-gray-200">Billing & Booking Details</h2>

                        <form className="space-y-6">

                            {/* DATES SECTION */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
                            {!showAddressForm && addresses.length > 0 ? (
                                /* ---------------- RADIO LIST ---------------- */
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-[#283862]">
                                        Select Billing Address
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map(addr => (
                                            <label
                                                key={addr._id}
                                                className={`flex gap-4 p-4 border rounded-lg cursor-pointer
                                    ${selectedAddressId === addr._id
                                                        ? "border-[#EDA337] bg-[#fff8ec]"
                                                        : "border-gray-200"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedAddressId === addr._id}
                                                    onChange={() => handleSelectAddress(addr._id)}
                                                    className="mt-1"
                                                />

                                                <div>
                                                    <div className="font-bold flex gap-2">
                                                        {addr.fullName}
                                                        {addr.isDefault && (
                                                            <span className="text-[10px] bg-green-100 px-2 rounded">
                                                                DEFAULT
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-gray-600 mt-1">{addr.streetAddress.join(", ")}</p>
                                                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                                                    <p className="text-sm text-gray-600">{addr.country}</p>
                                                    <p className="font-semibold text-sm mt-2">📞 {addr.phone}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetAddressForm();
                                            setShowAddressForm(true);
                                        }}
                                        className="text-xs font-bold text-[#EDA337] underline"
                                    >
                                        + Add New Address
                                    </button>
                                </div>

                            ) : (
                                /* ---------------- ADDRESS FORM ---------------- */
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name *</label>
                                            <input
                                                disabled={formData.name ? true : false}
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('name')}
                                                placeholder="e.g. John Doe"
                                                className={`w-full border rounded-sm p-4 text-sm text-[#283862] ${formData.name ? 'bg-[#efefef]' : 'bg-white'} focus:outline-none shadow-sm ${touched.name && errors.name
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
                                                disabled={formData.email ? true : false}
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('email')}
                                                placeholder="e.g. john@example.com"
                                                className={`w-full  border rounded-sm p-4 text-sm text-[#283862] ${formData.email ? 'bg-[#efefef]' : 'bg-white'} focus:outline-none shadow-sm ${touched.email && errors.email
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
                                            disabled={formData.phone ? true : false}
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            onBlur={() => handleBlur('phone')}
                                            placeholder="+1 234 567 8900"
                                            className={`w-full border rounded-sm p-4 text-sm text-[#283862] ${formData.phone ? 'bg-[#efefef]' : 'bg-white'} focus:outline-none shadow-sm ${touched.phone && errors.phone
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
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Street address"
                                            className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm ${touched.address && errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EDA337]'
                                                }`}
                                        />
                                        {touched.address && errors.address && (
                                            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm appearance-none cursor-pointer ${touched.country && errors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EDA337]'
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
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                                            {availableStates.length > 0 ? (
                                                <select
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm appearance-none cursor-pointer ${touched.state && errors.state ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EDA337]'
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
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. NY"
                                                    className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm ${touched.state && errors.state ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EDA337]'
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
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Town / City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="e.g. New York"
                                                className={`w-full bg-white border rounded-sm p-4 text-sm text-[#283862] focus:outline-none shadow-sm ${touched.city && errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EDA337]'
                                                    }`}
                                            />
                                            {touched.city && errors.city && (
                                                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Postcode</label>
                                            <input
                                                type="text"
                                                name="postcode"
                                                value={formData.postcode}
                                                onChange={handleInputChange}
                                                onBlur={() => handleBlur('postcode')}
                                                placeholder="e.g. 10001"
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
                                    {/* ADD Cancel button at bottom */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSaveAddress}
                                            className="bg-[#EDA337] text-white font-bold px-6 py-3 text-xs"
                                        >
                                            Save Address
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancelAddressForm}
                                            className="border px-6 py-3 text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}

                        </form>
                    </div>

                    {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24">
                            <h3 className="text-2xl text-[white] rounded-t-[8px] bg-[#283862] p-[15px] noto-geogia-font font-bold pb-4   ">Your Booking</h3>
                            <div className="bg-[white] text-white p-8 rounded-b-[8px] shadow-xl border border-[#00000017]">
                                {isSlug ? <>
                                    {selectedRoomByslug &&
                                        <>
                                            <div className="flex justify-between items-start mb-4 text-sm">
                                                <div>
                                                    <div className="font-bold text-[black]">{selectedRoomByslug.roomName}</div>
                                                    <div className="text-xs text-[black] ">x {singleItemInfo?.room} Rooms</div>
                                                    <div className="text-xs text-gray-500">
                                                        {singleItemInfo?.adults} Adults, {singleItemInfo?.children} Children
                                                    </div>
                                                </div>
                                                <span className="font-bold text-[#c23535]">{fmt(singleItemInfo?.roomTotal)}</span>
                                            </div>
                                            {singleItemInfo?.serviceTotal > 0 && (
                                                <div className="flex justify-between items-start mb-2 text-sm text-[black]">
                                                    <span>Extras</span>
                                                    <span>+{fmt(singleItemInfo?.serviceTotal)}</span>
                                                </div>
                                            )}
                                            <div className="flex font-semibold justify-between items-start mb-2 text-sm text-[#c23535]">
                                                <span className=' text-[#283862]'>Taxes & Fees</span>
                                                <span>+{fmt(singleItemInfo?.tax + singleItemInfo?.serviceCharge)}</span>
                                            </div>
                                            <div className="w-full h-[1px] bg-gray-300 mb-6"></div>

                                            <div className="flex justify-between items-center mb-8">
                                                <span className="text-lg text-[black] font-bold">Total</span>
                                                <span className="text-xl font-bold text-[#c23535]">{fmt(singleItemInfo?.grandTotal)}</span>
                                            </div>
                                        </>
                                    }
                                </> : <>
                                    {cartItems.length > 0 ? (
                                        <>
                                            {cartItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start mb-4 text-sm">
                                                    <div>
                                                        <div className="font-bold text-[black]">{item.roomName}</div>
                                                        <div className="text-xs text-[black] ">x {item.guestDetails?.rooms || 1} Rooms</div>
                                                    </div>
                                                    <span className="font-bold text-[#c23535]">{fmt(item.financials?.baseTotal || item.price)}</span>
                                                </div>
                                            ))}

                                            {totals.extrasTotal > 0 && (
                                                <div className="flex justify-between items-start mb-2 text-sm text-[black]">
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
                                            <div className="flex font-semibold justify-between items-start mb-2 text-sm text-[#c23535]">
                                                <span className=' text-[#283862]'>Taxes & Fees</span>
                                                <span>+{fmt(totals.taxes + totals.serviceCharge)}</span>
                                            </div>

                                            <div className="w-full h-[1px] bg-gray-300 mb-6"></div>

                                            <div className="flex justify-between items-center mb-8">
                                                <span className="text-lg text-[black] font-bold">Total</span>
                                                <span className="text-xl font-bold text-[#c23535]">{fmt(totals.grandTotal)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 text-sm mb-6">Your cart is empty.</div>
                                    )}

                                </>}

                                <h3 className="text-xl noto-geogia-font text-[black] font-bold mb-6">Payment Method</h3>

                                <div className="space-y-4 mb-8">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cash' ? 'border-[#c23535]' : 'border-gray-500'}`}>
                                            {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-[#c23535]"></div>}
                                        </div>
                                        <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="hidden" />
                                        <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-[black]' : 'text-[black] group-hover:text-[#c23535]'}`}>Pay on Arrival (Cash/Card)</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#c23535]' : 'border-gray-500'}`}>
                                            {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#c23535]"></div>}
                                        </div>
                                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                        <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-[black]' : 'text-[black] group-hover:text-[#c23535]'}`}>Online Payment (Razorpay)</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    // disabled={!cartItem || isProcessing || !isFormValid}
                                    className={`w-full bg-[#283862] hover:bg-[#c23535] text-white font-bold py-4 text-xs uppercase tracking-[0.15em] rounded-sm transition-all shadow-md hover:shadow-lg 
                                        `}
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