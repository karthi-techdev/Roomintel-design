"use client";

import React, { useState, useRef, useEffect, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, addMonths, differenceInDays } from 'date-fns';
import { FaStar } from "react-icons/fa6";
import {
    FaCheck,
    FaPlus,
    FaMinus,
    FaMapMarkerAlt,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaChevronDown
} from 'react-icons/fa';
import {



    PiCheckCircle,
    PiArrowsOutSimple,
    PiBed,
    PiUsers,
} from 'react-icons/pi';
// Add this import at the top with other imports
import SimpleCalendar from '../../../utils/calender';
import { BsGeoAlt, BsClock } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { siteService } from '../../../api/siteService';
import RoomLightbox from '../../../components/room-view/RoomLightbox';
import RoomImageGrid from '../../../components/room-view/RoomImageGrid';
import RoomFaq from '../../../components/room-view/RoomFaq';
import RoomAmenities from '../../../components/room-view/RoomAmenities';
import { useRoomStore } from '@/store/useRoomStore';
import { bookingService } from '@/api/bookingService';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { showAlert } from '@/utils/alertStore';
import { useCurrency } from '@/hooks/useCurrency';
import { Reviews, useReviewStore } from '@/store/useReviewStore';
import RoomReview from '@/components/room-view/RoomReview';
import RoomOverAllReview from '@/components/room-view/RoomOverAllReview';

interface DateRange {
    checkIn: Date | null;
    checkOut: Date | null;
}
export default function RoomView({ params }: { params: Promise<{ slug: string }> }) {

    // ?checkIn=2026-01-06&checkOut=2026-01-07

    const { slug } = use(params);
    const router = useRouter();
    const { formatPrice, currencyIcon } = useCurrency();
    const { selectedRoom: room, loading: roomLoading, error: roomError, fetchRoomBySlug } = useRoomStore();
    const { addToCart, fetchCart } = useCartStore();
    const [roomBookings, setRoomBookings] = useState<any[]>([]);
    const [availabilityLoading, setAvailabilityLoading] = useState(true);
    const { isLoggedIn, openLoginModal } = useAuthStore();

    const { fetchReview, reviews } = useReviewStore();
    const filteredReview = reviews && reviews.filter((item) => {
        return item?.bookingId?.room?.slug === slug;
    });
    // --- REFS FOR SCROLLING ---
    const aboutRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const amenitiesRef = useRef<HTMLDivElement>(null);
    const faqRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [checkInDate, setCheckInDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [checkOutDate, setCheckOutDate] = useState<string>(
        new Date(Date.now() + 86400000).toISOString().split('T')[0]
    );

    // New state for calendar visibility and range
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedRange, setSelectedRange] = useState<DateRange>({
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 86400000),
    });

    const bookedDates: Date[] = room?.bookedDates
        ?.map((dateStr: string) => new Date(dateStr))
        .filter((date) => !isNaN(date.getTime())) || [];

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // Related Rooms Carousel State
    const [relatedIndex, setRelatedIndex] = useState(0);

    // Banner State
    const [banner, setBanner] = useState<{
        image: string;
        title: string;
        description: string;
        buttonName: string;
    } | null>(null);

    // FAQ Data State
    const [faqData, setFaqData] = useState<{ question: string; answer: string }[]>([]);

    // Config State
    const [bedConfig, setBedConfig] = useState<{ _id?: string; key: string; value: string }[]>([]);

    // --- CONSTANTS ---
    const basePrice = room ? room.price : 1590;

    // Config values
    const maxAdults = room ? (room.maxAdults || 2) : 2;
    const maxChildren = room ? (room.maxChildren || 1) : 1;
    const baseAdults = room ? (room.baseAdults || 2) : 2;
    const baseChildren = room ? (room.baseChildren || 0) : 0;
    const extraAdultPrice = room ? (room.extraAdultPrice || 0) : 0;
    const extraChildPrice = room ? (room.extraChildPrice || 0) : 0;
    const extraAdultsCount = Math.max(0, adults - baseAdults);
    const extraChildrenCount = Math.max(0, children - baseChildren);
    const extrasPerRoom = (extraAdultsCount * extraAdultPrice) + (extraChildrenCount * extraChildPrice);

    const roomPricePerNight = basePrice + extrasPerRoom;
    const nights = useMemo(() => {
        if (!selectedRange.checkIn || !selectedRange.checkOut) return 0;
        return differenceInDays(selectedRange.checkOut, selectedRange.checkIn);
    }, [selectedRange.checkIn, selectedRange.checkOut]);

    // Updated total price: per night × nights × rooms
    const totalPriceAllNights = nights > 0 ? roomPricePerNight * nights * rooms : 0;


    const roomImages = room && room.images ? room.images : [];

    const getPrimaryImage = () => {
        if (room && room.previewImage) return room.previewImage;
        if (room && room.images && room.images.length > 0) return room.images[0];
        return "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop";
    };

    const relatedRooms: any[] = []; // Placeholder

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const data = await siteService.getRoomBanner();
                if (data.success && data.data) {
                    setBanner(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch banner:", error);
            }
        };

        const fetchBedConfig = async () => {
            try {
                const res = await siteService.getConfigBySlug('bed-types');
                // Check if status is true or success is true (handle various backend standards just in case)
                if (res && (res.status === true || res.success === true) && res.data) {
                    setBedConfig(res.data.configFields || []);
                }
            } catch (e) { console.error("Failed to fetch bed config", e); }
        };

        const fetchFaqs = async () => {
            try {
                const data = await siteService.getFaqs();
                if (data.success && Array.isArray(data.data)) {
                    setFaqData(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch FAQs:", error);
            }
        }

        fetchBanner();
        fetchBedConfig();
        if (slug) {
            fetchRoomBySlug(slug);
        }
        // fetchCart();
        fetchFaqs();
    }, [slug, fetchRoomBySlug,]);

    // Review Effect
    useEffect(() => {
        if (slug) {
            fetchReview({
                status: 'approved',
                slug: slug
            });
        }
    }, [slug])

    useEffect(() => {
        if (room) {
            setAdults(room.baseAdults || room.adults || 2);
            setChildren(room.baseChildren || 0);
        }
    }, [room]);

    useEffect(() => {
        if (!slug || !room) return;

        const fetchRoomAvailability = async () => {
            setAvailabilityLoading(true);
            try {
                const bookings = await bookingService.getRoomBookings(slug);
                setRoomBookings(bookings);
            } catch (err) {
                setRoomBookings([]);
            } finally {
                setAvailabilityLoading(false);
            }
        };

        fetchRoomAvailability();
    }, [slug, room]);



    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const offset = 100; // Sticky header offset
            const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    const blockedDates: Date[] = useMemo(() => {
        if (!Array.isArray(roomBookings) || roomBookings.length === 0) {
            return [];
        }

        const dates = new Set<string>();

        roomBookings.forEach((booking: any) => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);

            // Skip invalid dates
            if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return;

            let current = new Date(checkIn);
            while (current < checkOut) {
                dates.add(format(current, 'yyyy-MM-dd'));
                current.setDate(current.getDate() + 1);
            }
        });

        return Array.from(dates).map(dateStr => new Date(dateStr));
    }, [roomBookings]);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };
    useEffect(() => {
        if (selectedRange.checkIn) {
            setCheckInDate(format(selectedRange.checkIn, 'yyyy-MM-dd'));
        }
        if (selectedRange.checkOut) {
            setCheckOutDate(format(selectedRange.checkOut, 'yyyy-MM-dd'));
        }
    }, [selectedRange]);

    const handleRangeSelect = (checkIn: Date | null, checkOut: Date | null) => {
        setSelectedRange({ checkIn, checkOut });
        if (checkIn && checkOut) {
            setShowCalendar(false); // Auto-close when range is complete
        }
    };
    const handleBookRoom = async () => {
        if (!room || !selectedRange.checkIn || !selectedRange.checkOut) {
            showAlert.error('Please select check-in and check-out dates');
            return;
        }

        if (!isLoggedIn) {
            showAlert.error('Please login to book a room');
            openLoginModal();
            return;
        }

        // Calculate nights
        const nights = differenceInDays(selectedRange.checkOut, selectedRange.checkIn);
        if (nights <= 0) {
            showAlert.error('Check-out must be after check-in');
            return;
        }

        // Calculate price per night with extras
        const extraAdults = Math.max(0, adults - (room.baseAdults || 2));
        const extraChildren = Math.max(0, children - (room.baseChildren || 0));
        const extrasPerNight = extraAdults * (room.extraAdultPrice || 0) + extraChildren * (room.extraChildPrice || 0);
        const pricePerNight = (room.price || 0) + extrasPerNight;

        // Total for all nights and rooms
        const roomTotal = pricePerNight * nights * rooms;

        // Taxes & Service Charge (same as checkout logic)
        const tax = roomTotal * 0.10;
        const serviceCharge = roomTotal * 0.05;
        const grandTotal = roomTotal + tax + serviceCharge;

        // Format dates for URL
        const checkIn = format(selectedRange.checkIn, 'yyyy-MM-dd');
        const checkOut = format(selectedRange.checkOut, 'yyyy-MM-dd');

        // Build URL with all data
        const queryParams = new URLSearchParams({
            checkIn,
            checkOut,
            adults: adults.toString(),
            children: children.toString(),
            rooms: rooms.toString(),
            roomTotal: roomTotal.toFixed(2),
            tax: tax.toFixed(2),
            serviceCharge: serviceCharge.toFixed(2),
            grandTotal: grandTotal.toFixed(2),
        });

        // Navigate with all data
        router.push(`/room-checkout/${room.slug}?${queryParams.toString()}`);
    };


    // Show loading state
    if (roomLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#283862] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#283862] font-bold animate-pulse">Loading Room Details...</p>
                </div>
            </div>
        );
    }

    // Show 404 error if room not found
    if (!room || roomError) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-6 text-center px-4">
                    <div className="text-9xl font-bold text-[#283862]">404</div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#283862]">Room Not Found</h1>
                    <p className="text-gray-600 max-w-md">
                        {roomError || "The room you're looking for doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={() => router.push('/rooms')}
                        className="bg-[#283862] hover:bg-[#1a2542] text-white font-bold py-3 px-8 rounded-md transition-colors"
                    >
                        Browse All Rooms
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full pb-20">

            {/* --- LIGHTBOX --- */}
            <RoomLightbox
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                images={roomImages}
                photoIndex={photoIndex}
                setPhotoIndex={setPhotoIndex}
            />

            {/* --- HEADER --- */}
            <section className="bg-[#283862] pt-32 pb-16 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img src={getPrimaryImage()} className="w-full h-full object-cover" alt="Header" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl noto-geogia-font font-bold mb-4 leading-tight">{room ? room.title : "City Double Or Twin Room"}</h1>
                    <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-300">
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors">Home</span>
                        <span>/</span>
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors">Rooms Grid</span>
                        <span>/</span>
                        <span>{room && room.category && room.category.name ? room.category.name : "Classic"}</span>
                        <span>/</span>
                        <span className="text-white">{room ? room.name : "City Double Or Twin Room"}</span>
                    </div>
                </div>
            </section>

            <section className="bg-white max-w-[1400px] mx-auto px-4 md:px-6 lg:px-16 py-8 md:py-12 md:rounded-[20px] md:-mt-10 relative z-20 shadow-xl">

                {/* --- IMAGE GRID --- */}
                <RoomImageGrid
                    images={roomImages}
                    onOpenLightbox={openLightbox}
                />

                {/* --- NAVIGATION TABS --- */}
                <div className="sticky top-[80px] z-30 bg-white md:static flex gap-6 md:gap-8 border-b border-gray-200 pb-0 mb-10 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider overflow-x-auto no-scrollbar pt-4 md:pt-0">
                    {[
                        { label: "Room Info", ref: aboutRef },
                        { label: "Useful Info", ref: infoRef },
                        { label: "Amenities", ref: amenitiesRef },
                        { label: "FAQ", ref: faqRef },
                        { label: "Review & Rating", ref: reviewRef }
                    ].map((tab, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToSection(tab.ref)}
                            className="hover:text-[#c23535] cursor-pointer transition-colors whitespace-nowrap pb-4 border-b-2 border-transparent hover:border-[#c23535] focus:text-[#c23535] focus:border-[#c23535]"
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-12 relative">

                    {/* --- LEFT COLUMN: MAIN CONTENT --- */}
                    <div className="lg:w-2/3 space-y-12">

                        {/* About Section */}
                        <div ref={aboutRef} className="scroll-mt-32">
                            <h2 className="text-2xl md:text-3xl noto-geogia-font font-bold text-[#283862] mb-6">About This Room</h2>
                            {room && room.description ? (
                                <div
                                    className="text-gray-500 text-sm leading-relaxed mb-8"
                                    dangerouslySetInnerHTML={{ __html: room.description }}
                                />
                            ) : (
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    Angkor's Family Pool Suite is ideal for quality time together...
                                </p>
                            )}

                            {/* Info Bar */}
                            <div className="bg-[#283862] p-6 rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                        <PiArrowsOutSimple className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Size</div>
                                        <div className="font-bold">{room ? room.size.replace('m²', '').trim() : "100"} m²</div>
                                    </div>
                                </div>
                                {(() => {
                                    // Check if we should show bed info
                                    if (!room || !room.beds || typeof room.beds !== 'string') return null;

                                    const bedIds = room.beds.split(',').map(s => s.trim());
                                    let bedDisplay = room.beds;

                                    if (bedConfig.length > 0) {
                                        const labels = bedIds.map(id => {
                                            const match = bedConfig.find((c: any) => c._id && c._id.toString() === id);
                                            return match ? match.value : id;
                                        });
                                        bedDisplay = labels.join(', ');
                                    }

                                    // Hide if contains "Unknown"
                                    if (bedDisplay.toLowerCase().includes('unknown')) return null;

                                    return (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                                <PiBed className="text-2xl" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Beds</div>
                                                <div className="font-bold">{bedDisplay}</div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Useful Information Table */}
                        <div ref={infoRef} className="scroll-mt-32">
                            <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Useful Information</h3>
                            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                                {room && room.usefulInformation && room.usefulInformation.length > 0 ? (
                                    room.usefulInformation.map((row: any, idx: number) => (
                                        <div key={idx} className={`flex justify-between p-4 text-xs md:text-sm border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white'}`}>
                                            <span className="font-bold text-[#283862]">{row.name}</span>

                                            <span className="text-gray-500 font-medium text-right">{row.value}</span>

                                        </div>
                                    ))
                                ) : (
                                    [
                                        { label: "Value For Money", value: "4.2" },
                                        { label: "Distance From City Center", value: "0.2Km" },
                                        { label: "Cleanliness Rating", value: "4.9" },
                                    ].map((row, idx) => (
                                        <div key={idx} className={`flex justify-between p-4 text-xs md:text-sm border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white'}`}>
                                            <span className="font-bold text-[#283862]">{row.label}</span>
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-gray-500 font-medium">{row.value}</span>

                                                {row.label === "Cleanliness Rating" && (
                                                    <FaStar className="text-[#ffae1a]" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Promo Banner */}
                        {banner && (
                            <div className="relative rounded-sm overflow-hidden h-[250px] flex items-center group cursor-pointer shadow-md">
                                <img src={banner.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#283862]/90 to-transparent"></div>
                                <div className="relative z-10 p-8 md:p-12 max-w-xl">
                                    <h3 className="text-white text-xl md:text-2xl noto-geogia-font font-bold mb-4">{banner.title}</h3>
                                    <p className="text-gray-300 text-xs mb-6 leading-relaxed line-clamp-2">
                                        {banner.description}
                                    </p>
                                    <button className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[#c23535] transition-colors group-hover:translate-x-2 duration-300">
                                        {banner.buttonName || "Read More"} <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Amenities */}
                        <div ref={amenitiesRef} className="scroll-mt-32">
                            <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Amenities & Facilities</h3>
                            <RoomAmenities
                                roomAmenities={room && room.amenities ? room.amenities : []}
                            />
                        </div>

                        {/* FAQ */}
                        <div ref={faqRef} className="scroll-mt-32">
                            <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Frequently Asked Questions</h3>
                            <RoomFaq faqs={faqData} />
                        </div>

                        {/* Reviews & Rating sec */}
                        <div ref={reviewRef} className='rounded-lg border border-slate-200 '>
                            <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] p-6">Ratings & Reviews</h3>
                            <RoomOverAllReview reviews={filteredReview} />
                            {filteredReview && filteredReview.slice(0, 8).map((item: Reviews) => {
                                return <RoomReview item={item} key={item._id} />
                            })}
                            {/* View All Reviews Button */}
                            {filteredReview && filteredReview.length > 10 &&
                                <button
                                    onClick={() => router.push(`/room-all-review?slug=${slug}`)}
                                    className="w-full py-4 text-[#283862] font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    All {filteredReview.length} reviews →
                                </button>
                            }
                        </div>

                        {/* Nearby */}
                        <div>
                            <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Where To Go Nearby</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {room && room.landmarks && room.landmarks.length > 0 ? (
                                    room.landmarks.map((place: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-start border-b border-gray-200 pb-3 hover:border-[#c23535]/30 transition-colors group">
                                            <div className="flex items-start gap-3">
                                                <BsGeoAlt className="text-[#EDA337] mt-1 shrink-0 group-hover:text-[#c23535] transition-colors" />
                                                <span className="text-sm text-gray-600 font-medium group-hover:text-[#283862] transition-colors">
                                                    {place.landmark ? place.landmark.name : "Unknown Landmark"}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 font-bold">{place.distance}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No nearby places info available.</p>
                                )}
                            </div>
                        </div>

                        {/* Accommodation Rules */}
                        <div className="bg-[#1e2c4e] text-white p-8 rounded-sm shadow-md">
                            <h3 className="text-2xl noto-geogia-font font-bold mb-4 border-b border-gray-700 pb-4">Accommodation Rules</h3>
                            {room && room.accommodationRules ? (
                                <div
                                    className="text-gray-400 text-sm mb-6 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: room.accommodationRules }}
                                />
                            ) : (
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                    Located just minutes from Siem Reap Town centre...
                                </p>
                            )}
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN: SIDEBAR --- */}
                    <aside className="lg:w-1/3 relative">
                        <div className="sticky top-24 space-y-8">

                            {/* Booking Widget */}
                            <h3 className="text-2xl rounded-t-[8px] text-white bg-[#283862] mb-0 p-5 noto-geogia-font font-bold pb-4">
                                Book This Room
                            </h3>
                            <div className="bg-white rounded-b-[8px] overflow-hidden shadow-xl border border-[#0000001c]">
                                <div className="p-6 md:p-8 space-y-5">
                                    <div className="space-y-4 pt-2">

                                        {/* Custom Calendar Picker */}
                                        <div className="relative">
                                            <div
                                                onClick={() => setShowCalendar(!showCalendar)}
                                                className="cursor-pointer"
                                            >
                                                <div className="w-full border border-gray-300 rounded-lg bg-white p-4 hover:border-[#283862] transition-all duration-200 hover:shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium text-gray-700 mb-1">Check-In</div>
                                                            <div className="text-base font-semibold text-[#283862]">
                                                                {selectedRange.checkIn
                                                                    ? format(selectedRange.checkIn, 'EEE, MMM d')
                                                                    : 'Select date'}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-center mx-4">
                                                            <div className="text-xs text-gray-400 mb-1">→</div>
                                                            {selectedRange.checkIn && selectedRange.checkOut && nights > 0 && (
                                                                <div className="text-xs font-medium text-[#c23535] bg-[#c23535]/5 px-2 py-0.5 rounded">
                                                                    {nights} night{nights > 1 ? 's' : ''}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 text-right">
                                                            <div className="text-sm font-medium text-gray-700 mb-1">Check-Out</div>
                                                            <div className="text-base font-semibold text-[#283862]">
                                                                {selectedRange.checkOut
                                                                    ? format(selectedRange.checkOut, 'EEE, MMM d')
                                                                    : 'Select date'}
                                                            </div>
                                                        </div>

                                                        <div className="ml-4 text-gray-400">
                                                            <FaChevronDown className={`transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>


                                            {/* Calendar Dropdown */}
                                            <AnimatePresence>
                                                {showCalendar && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-0 right-0 mt-4 z-50"
                                                    >
                                                        <div className="relative">
                                                            <div className="p-1 bg-white rounded-lg shadow-xl">
                                                                <SimpleCalendar
                                                                    selectedRange={selectedRange}
                                                                    onRangeSelect={handleRangeSelect}
                                                                    bookedDates={blockedDates}
                                                                    onClose={() => setShowCalendar(false)}
                                                                />
                                                            </div>
                                                            {/* Close button for mobile */}
                                                            <button
                                                                onClick={() => setShowCalendar(false)}
                                                                className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <FaTimes className="text-gray-600 text-xs" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Rest of the booking controls remain the same */}


                                        {rooms >= (room?.maxRooms || 10) && (
                                            <div className="text-[10px] text-yellow-400 text-center py-1">
                                                Maximum booking limit reached
                                            </div>
                                        )}

                                        {/* Adults */}
                                        <div className="flex justify-between items-center p-3 rounded-sm border border-gray-300">
                                            <span className="text-sm text-black font-medium pl-1">Adults (per room)</span>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="text-black hover:text-[#EDA337] transition-colors">
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-sm font-bold w-8 text-center text-black">{adults}</span>
                                                <button onClick={() => setAdults(Math.min(maxAdults, adults + 1))} className="text-black hover:text-[#EDA337] transition-colors">
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        {extraAdultPrice > 0 && (
                                            <div className="text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold">
                                                +{formatPrice(extraAdultPrice)} per extra adult
                                            </div>
                                        )}

                                        {/* Children */}
                                        <div className="flex justify-between items-center p-3 rounded-sm border border-gray-300 mt-2">
                                            <span className="text-sm text-black font-medium pl-1">Children (per room)</span>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setChildren(Math.max(0, children - 1))} className="text-black hover:text-[#EDA337] transition-colors">
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-sm font-bold w-8 text-center text-black">{children}</span>
                                                <button onClick={() => setChildren(Math.min(maxChildren, children + 1))} className="text-black hover:text-[#EDA337] transition-colors">
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        {extraChildPrice > 0 && (
                                            <div className="text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold">
                                                +{formatPrice(extraChildPrice)} per extra child
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-[#00000029] my-4 pt-4 flex justify-between font-bold text-lg text-[#1e2c4e]">
                                        <span>Total (per night):</span>
                                        <span className="text-[#c23535]">{formatPrice(totalPriceAllNights)}</span>
                                    </div>

                                    <button
                                        onClick={handleBookRoom}
                                        disabled={!selectedRange.checkIn || !selectedRange.checkOut}
                                        className="w-full bg-[#1e2c4e] hover:bg-[#c23535] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 text-xs uppercase tracking-widest transition-colors rounded-sm shadow-md"
                                    >
                                        Book This Room
                                    </button>

                                    <div className="relative text-center">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-[#00000029]"></div>
                                        </div>
                                        <div className="relative inline-block bg-white px-4 text-xs text-black font-bold">OR</div>
                                    </div>

                                    <button
                                        onClick={() => router.push('/contact-us')}
                                        className="w-full bg-[#1e2c4e] hover:bg-[#c23535] text-white font-bold py-4 text-xs uppercase tracking-widest transition-colors rounded-sm shadow-md"
                                    >
                                        Send Enquiry
                                    </button>
                                </div>
                            </div>

                            {/* Location Widget */}
                            <div className="bg-[#1e2c4e] p-8 text-white rounded-sm shadow-xl border border-gray-700/50">
                                <h3 className="text-xl noto-geogia-font font-bold mb-6 pb-4 border-b border-gray-600">Location</h3>
                                <div className="h-[200px] bg-gray-700 mb-6 overflow-hidden relative group cursor-pointer rounded-sm border border-gray-600">
                                    <img src={room && room.locationImage ? room.locationImage : "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2670&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80" alt="Map" />
                                </div>
                                <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">{room ? room.locationName : "Location Name"}</div>
                                <h4 className="text-lg font-bold mb-4 text-[#c23535]">Checkin & Explore</h4>
                                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                    {room ? room.locationDescription : "At Anantara Angkor Resort..."}
                                </p>
                            </div>

                        </div>
                    </aside>
                </div>

            </section>
        </main>
    );
};
