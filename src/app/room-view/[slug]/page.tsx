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
} from 'react-icons/fa';
import {
    PiCheckCircle,
    PiArrowsOutSimple,
    PiBed,
    PiUsers,
} from 'react-icons/pi';
import { BsGeoAlt, BsClock } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { siteService } from '../../../api/siteService';
import { authService } from '../../../api/authService'; // Add authService import
import RoomLightbox from '../../../components/room-view/RoomLightbox';
import RoomImageGrid from '../../../components/room-view/RoomImageGrid';
import RoomFaq from '../../../components/room-view/RoomFaq';
import RoomAmenities from '../../../components/room-view/RoomAmenities';


export default function RoomView({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();

    // --- REFS FOR SCROLLING ---
    const aboutRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const amenitiesRef = useRef<HTMLDivElement>(null);
    const faqRef = useRef<HTMLDivElement>(null);
    const commentsRef = useRef<HTMLDivElement>(null);

    // --- STATE ---

    // Booking Widget State
    const [bookingForm, setBookingForm] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [room, setRoom] = useState<any>(null);

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

        const fetchRoom = async () => {
            if (!slug) return;
            try {
                console.log("Fetching room for slug:", slug);
                const data = await siteService.getRoomBySlug(slug);
                console.log("Room API Response:", data);
                if (data.success) {
                    setRoom(data.data);
                } else {
                    console.error("Room fetch was unsuccessful:", data);
                }
            } catch (error) {
                console.error("Failed to fetch room:", error);
            }
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

        const fetchUser = () => {
            const user = authService.getCurrentUser();
            if (user) {
                setBookingForm(prev => ({
                    ...prev,
                    name: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : ''),
                    email: user.email || '',
                    phone: user.phone || ''
                }));
            }
        };

        fetchBanner();
        fetchRoom();
        fetchFaqs();
        fetchUser();
    }, [slug]);

    const [rooms, setRooms] = useState(1);
    const [children, setChildren] = useState(0);

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

    // --- CONSTANTS ---

    const basePrice = room ? room.price : 1590;
    const childPrice = 150;
    const totalPrice = (basePrice * rooms) + (children * childPrice);

    const roomImages = room && room.images ? room.images : [];

    // Remove static amenities and nearby places
    // Remove static related rooms if you want strictly dynamic data
    // For now we will check if room has relatedRooms (not implemented in backend model yet usually)
    // or just leave the related section empty/hidden if we strictly follow "dynamic data only".
    // I will comment out the static list for now or empty it.
    const relatedRooms: any[] = [];


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

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev + 1) % roomImages.length);
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    };

    const nextRelated = () => {
        setRelatedIndex((prev) => (prev + 1) % relatedRooms.length);
    };

    const prevRelated = () => {
        setRelatedIndex((prev) => (prev - 1 + relatedRooms.length) % relatedRooms.length);
    };

    // Determine how many items to show based on screen width (simplified logic for React)
    // For simplicity, we just slice the array. In a real responsive carousel, we might track window width.
    // Here we will use a responsive grid inside the carousel view, showing 1, 2, or 3 items but shifting by 1 index.
    const getVisibleRelatedRooms = () => {
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(relatedRooms[(relatedIndex + i) % relatedRooms.length]);
        }
        return items;
    };

    const visibleRelated = getVisibleRelatedRooms();

    if (!room) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#283862] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#283862] font-bold animate-pulse">Loading Room Details...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="w-full   pb-20">

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
                        { label: "Comments", ref: commentsRef }
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
                            <div className="bg-[#283862] p-6 rounded-sm flex flex-col md:flex-row gap-8 md:gap-16 text-white shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                        <PiArrowsOutSimple className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Size</div>
                                        <div className="font-bold">{room ? room.size : "100"} m²</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                        <PiBed className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Beds</div>
                                        <div className="font-bold">{room ? room.beds : "2 Beds"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                        <PiUsers className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Adults</div>
                                        <div className="font-bold">{room ? room.adults : 3} Adults</div>
                                    </div>
                                </div>
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

                        {/* Nearby */}
                        <div>
                            {/* ... Keep Nearby as static or fetch ... */}
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
                        <div className="bg-[#283862] text-white p-8 rounded-sm shadow-md">
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
                            {/* ... */}
                        </div>

                        {/* Comments Section ... */}
                        {/* ... */}

                    </div>

                    {/* --- RIGHT COLUMN: SIDEBAR --- */}
                    <aside className="lg:w-1/3 relative">
                        {/* ... Sidebar Content ... */}
                        <div className="sticky top-24 space-y-8">

                            {/* Booking Widget */}
                            <div className="bg-[#283862] rounded-sm overflow-hidden text-white shadow-xl border border-gray-700/50">
                                <div className="bg-[#EDA337] p-5 flex justify-between items-center font-bold">
                                    <span className="text-sm uppercase tracking-wider">Starting At:</span>
                                    <span className="text-2xl noto-geogia-font">${basePrice}</span>
                                </div>
                                <div className="p-6 md:p-8 space-y-5">
                                    <h3 className="text-2xl noto-geogia-font font-bold mb-4 pb-4 border-b border-gray-700">Book This Room</h3>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={bookingForm.name}
                                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                            className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm text-white text-sm p-4 placeholder-gray-400 focus:outline-none focus:border-[#EDA337]"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            value={bookingForm.email}
                                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                            className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm text-white text-sm p-4 placeholder-gray-400 focus:outline-none focus:border-[#EDA337]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                            value={bookingForm.phone}
                                            onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                            className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm text-white text-sm p-4 placeholder-gray-400 focus:outline-none focus:border-[#EDA337]"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-between items-center bg-[#3f4e66] p-3 rounded-sm border border-gray-600">
                                            <span className="text-sm font-medium pl-1">Number</span>
                                            <div className="flex items-center gap-4 text-gray-300">
                                                <button
                                                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                                                    className="hover:text-[#EDA337] transition-colors"
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center text-white">{rooms}</span>
                                                <button
                                                    onClick={() => setRooms(rooms + 1)}
                                                    className="hover:text-[#EDA337] transition-colors"
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold">
                                            x ${basePrice} = ${basePrice * rooms}
                                        </div>

                                        <div className="flex justify-between items-center bg-[#3f4e66] p-3 rounded-sm border border-gray-600">
                                            <span className="text-sm font-medium pl-1">Children</span>
                                            <div className="flex items-center gap-4 text-gray-300">
                                                <button
                                                    onClick={() => setChildren(Math.max(0, children - 1))}
                                                    className="hover:text-[#EDA337] transition-colors"
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center text-white">{children}</span>
                                                <button
                                                    onClick={() => setChildren(children + 1)}
                                                    className="hover:text-[#EDA337] transition-colors"
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold">
                                            x ${childPrice} = ${children * childPrice}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-700 my-4 pt-4 flex justify-between font-bold text-lg text-[#EDA337]">
                                        <span>Total:</span>
                                        <span>${totalPrice}</span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            // Create cart item object
                                            const cartItem = {
                                                roomSlug: slug,
                                                roomName: room?.name || "Room",
                                                roomTitle: room?.title || room?.name,
                                                roomImage: room?.previewImage || room?.images?.[0] || "",
                                                price: basePrice,
                                                amenities: room?.amenities || [],
                                                guestDetails: {
                                                    rooms: rooms,
                                                    adults: room?.adults || 2, // Default adults from room or 2
                                                    children: children,
                                                },
                                                contact: bookingForm
                                            };

                                            // Save to localStorage
                                            if (typeof window !== 'undefined') {
                                                localStorage.setItem('room_cart', JSON.stringify(cartItem));
                                            }

                                            // Navigate to cart
                                            router.push('/room-cart');
                                        }}
                                        className="w-full bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold py-4 text-xs uppercase tracking-widest transition-colors rounded-sm shadow-md cursor-pointer"
                                    >
                                        Book This Room
                                    </button>

                                    <div className="relative text-center my-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-700"></div>
                                        </div>
                                        <div className="relative inline-block bg-[#283862] px-4 text-xs text-gray-500 font-bold">OR</div>
                                    </div>

                                    <button className="w-full bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold py-4 text-xs uppercase tracking-widest transition-colors rounded-sm shadow-md">
                                        Send Enquiry
                                    </button>
                                </div>
                            </div>

                            {/* Location Widget */}
                            <div className="bg-[#34425a] p-8 text-white rounded-sm shadow-xl border border-gray-700/50">
                                <h3 className="text-xl noto-geogia-font font-bold mb-6 pb-4 border-b border-gray-600">Location</h3>
                                {/* ... map image ... */}
                                <div className="h-[200px] bg-gray-700 mb-6 overflow-hidden relative group cursor-pointer rounded-sm border border-gray-600">
                                    <img src={room && room.locationImage ? room.locationImage : "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2670&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80" alt="Map" />
                                </div>
                                <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">{room ? room.locationName : "Location Name"}</div>
                                <h4 className="text-lg font-bold mb-4 text-[#EDA337]">Checkin & Explore</h4>
                                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                    {room ? room.locationDescription : "At Anantara Angkor Resort..."}
                                </p>
                            </div>

                        </div>
                    </aside>
                </div>

                {/* ... Related Rooms ... */}

            </section>
        </main>
    );
};
