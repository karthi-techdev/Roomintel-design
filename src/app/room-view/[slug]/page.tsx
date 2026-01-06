"use client";

import React, { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaStar,
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
import { BsGeoAlt, BsClock } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { siteService } from '../../../api/siteService'; // Keep for faqs/banner if needed
import RoomLightbox from '../../../components/room-view/RoomLightbox';
import RoomImageGrid from '../../../components/room-view/RoomImageGrid';
import RoomFaq from '../../../components/room-view/RoomFaq';
import RoomAmenities from '../../../components/room-view/RoomAmenities';
import { useRoomStore } from '@/store/useRoomStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { showAlert } from '@/utils/alertStore';
import { useCurrency } from '@/hooks/useCurrency';
import { Reviews, useReviewStore } from '@/store/useReviewStore';
import RoomReview from '@/components/room-view/RoomReview';
import RoomOverAllReview from '@/components/room-view/RoomOverAllReview';

export default function RoomView({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { formatPrice, currencyIcon } = useCurrency();



    const { selectedRoom: room, loading: roomLoading, error: roomError, fetchRoomBySlug } = useRoomStore();
    const { addToCart, fetchCart } = useCartStore();
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

    // --- STATE ---

    // Fetch Banner and Room Data
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
                // Fetch config for beds
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
        fetchCart();
        fetchFaqs();
    }, [slug, fetchRoomBySlug, fetchCart]);

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

    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
    const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

    // FAQ State
    const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

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

    // Calculate per-room extras
    const extraAdultsCount = Math.max(0, adults - baseAdults);
    const extraChildrenCount = Math.max(0, children - baseChildren);
    const extrasPerRoom = (extraAdultsCount * extraAdultPrice) + (extraChildrenCount * extraChildPrice);

    const roomPricePerNight = basePrice + extrasPerRoom;
    const totalPrice = roomPricePerNight * rooms;

    const roomImages = room && room.images ? room.images : [];

    const relatedRooms: any[] = []; // Placeholder

    // --- HANDLERS ---

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const offset = 100; // Sticky header offset
            const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const handleBookRoom = async () => {
        if (!room) return;

        // Check if user is logged in
        if (!isLoggedIn) {
            showAlert.error('Please login to book a room');
            openLoginModal();
            return;
        }

        const roomsCount = rooms;
        const totalBase = roomPricePerNight * roomsCount;
        const taxes = totalBase * 0.10;
        const serviceCharge = totalBase * 0.05;
        const grandTotal = totalBase + taxes + serviceCharge;


        // Construct Cart Item matching usage in other components or define interface
        // Assuming update to useCartStore handles this object
        const cartItem: any = {
            roomId: room._id,
            roomSlug: slug,
            roomName: room.title || room.name || "Room",
            roomTitle: room.title || room.name,
            image: room.previewImage || room.images?.[0] || "",
            price: basePrice,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guestDetails: {
                rooms: rooms,
                adults: adults,
                children: children
            },
            rateConfig: {
                baseAdults,
                baseChildren,
                maxAdults,
                maxChildren,
                extraAdultPrice,
                extraChildPrice
            },
            financials: {
                baseTotal: totalBase,
                extrasTotal: 0,
                taxes: taxes,
                serviceCharge: serviceCharge,
                discountAmount: 0,
                grandTotal: grandTotal,
                currency: currencyIcon
            },
            totalAmount: grandTotal
        };

        // If useCartStore uses a different structure, we should align.
        // Based on previous file, it was saving a large object.
        // For now, I will pass this object.

        await addToCart(cartItem);
        router.push('/room-cart');
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
                    <img src={room && room.previewImage ? room.previewImage : "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Header" />
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
                                            <span className="text-gray-500 font-medium text-right">{row.value}</span>
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
                                return <RoomReview item={item} />
                            })}
                            {/* View All Reviews Button */}
                            {filteredReview && filteredReview.length > 10 &&
                                <button className="w-full py-4 text-[#283862] font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
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
                            <h3 className="text-2xl rounded-t-[8px] text-[white] bg-[#283862] mb-0 p-5 noto-geogia-font font-bold pb-4 ">Book This Room</h3>
                            <div className="bg-[white] rounded-b-[8px]  overflow-hidden text-white shadow-xl border border border-[#0000001c]">

                                <div className="p-6 md:p-8 space-y-5">

                                    <div className="space-y-4 pt-2">
                                        {/* Date Selection */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-[black] uppercase tracking-wider">Check-In</label>
                                                <input
                                                    type="date"
                                                    value={checkInDate}
                                                    onChange={(e) => setCheckInDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full border border-gray-300 rounded-sm p-3 text-sm text-black focus:outline-none focus:border-[#EDA337]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-[black] uppercase tracking-wider">Check-Out</label>
                                                <input
                                                    type="date"
                                                    value={checkOutDate}
                                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                                    min={checkInDate}
                                                    className="w-full border border-gray-300 rounded-sm p-3 text-sm text-black focus:outline-none focus:border-[#EDA337]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center  p-3 rounded-sm border border-gray-300">
                                            <span className="text-sm text-[black] font-medium pl-1">Number</span>
                                            <div className="flex items-center gap-4 text-gray-300">
                                                <button
                                                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                                                    className=" text-[black] hover:text-[#EDA337] transition-colors"
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center text-black">{rooms}</span>
                                                <button
                                                    onClick={() => setRooms(Math.min(room?.maxRooms || 10, rooms + 1))}
                                                    className="text-[black] hover:text-[#EDA337] transition-colors"
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        {rooms >= (room?.maxRooms || 10) && (
                                            <div className="text-[10px] text-yellow-400 text-center py-1">
                                                Maximum booking limit reached
                                            </div>
                                        )}
                                        <div className="text-[10px] text-[black] text-right uppercase tracking-wider font-bold">
                                            x {formatPrice(basePrice)} = {formatPrice(basePrice * rooms)}
                                        </div>

                                        <div className="flex justify-between items-center p-3 rounded-sm border border-gray-300">
                                            <span className="text-sm text-[black] font-medium pl-1">Adults (per room)</span>
                                            <div className="flex items-center gap-4 text-gray-300">
                                                <button
                                                    onClick={() => setAdults(Math.max(1, adults - 1))}
                                                    className="hover:text-[#EDA337] text-[black] transition-colors"
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center text-[black]">{adults}</span>
                                                <button
                                                    onClick={() => setAdults(Math.min(maxAdults, adults + 1))}
                                                    className="hover:text-[#EDA337] text-[black] transition-colors"
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        {extraAdultPrice > 0 && (
                                            <div className="text-[10px] text-[black] text-gray-400 text-right uppercase tracking-wider font-bold">
                                                +{formatPrice(extraAdultPrice)} per extra adult
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center p-3 rounded-sm border border-gray-300 mt-2">
                                            <span className="text-sm text-[black] font-medium pl-1">Children (per room)</span>
                                            <div className="flex items-center gap-4 text-gray-300">
                                                <button
                                                    onClick={() => setChildren(Math.max(0, children - 1))}
                                                    className="hover:text-[#EDA337] text-[black] transition-colors"
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center text-[black]">{children}</span>
                                                <button
                                                    onClick={() => setChildren(Math.min(maxChildren, children + 1))}
                                                    className="hover:text-[#EDA337] text-[black] transition-colors"
                                                >
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
                                        <span>Total:</span>
                                        <span className='text-[#c23535]'>{formatPrice(totalPrice)}</span>
                                    </div>

                                    <button
                                        onClick={handleBookRoom}
                                        className="w-full bg-[#1e2c4e] hover:bg-[#c23535] text-white font-bold py-4 text-xs uppercase tracking-widest transition-colors rounded-sm shadow-md cursor-pointer"
                                    >
                                        Book This Room
                                    </button>

                                    <div className="relative text-center ">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-[#00000029]"></div>
                                        </div>
                                        <div className="relative inline-block bg-[white] px-4 text-xs text-[black] font-bold">OR</div>
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
