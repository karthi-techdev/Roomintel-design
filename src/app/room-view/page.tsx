"use client";


import React, { useState, useRef } from 'react';
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
  PiBed, 
  PiUsers, 
  PiArrowsOutSimple,
  PiCoffee,
  PiWifiHigh,
  PiTelevision,
  PiShower,
  PiCoatHanger,
  PiFirstAid,
  PiLockKey,
  PiSwimmingPool,
  PiSpeakerHifi,
  PiBarbell,
  PiStorefront
} from 'react-icons/pi';
import { BsGeoAlt, BsClock } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';


export default function RoomView() {
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
  const [rooms, setRooms] = useState(1);
  const [children, setChildren] = useState(0);

  // FAQ State
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Related Rooms Carousel State
  const [relatedIndex, setRelatedIndex] = useState(0);

  // --- CONSTANTS ---

  const basePrice = 1590;
  const childPrice = 150;
  const totalPrice = (basePrice * rooms) + (children * childPrice);

  const roomImages = [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2525&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop"
  ];

  const amenities = [
    { name: "Snack Bar", icon: <PiCoffee /> },
    { name: "Door Operator", icon: <PiLockKey /> },
    { name: "Luggage Storage", icon: <PiStorefront /> },
    { name: "Smoking", icon: <PiCoffee /> }, 
    { name: "Shops", icon: <PiStorefront /> },
    { name: "Ironing Services", icon: <PiCoatHanger /> },
    { name: "Laundry Services", icon: <PiCoatHanger /> },
    { name: "Postal Services", icon: <PiStorefront /> },
    { name: "Beauty Salon", icon: <PiUsers /> },
    { name: "Wired Internet", icon: <PiWifiHigh /> },
    { name: "Asian Breakfast", icon: <PiCoffee /> },
    { name: "Internet Services", icon: <PiWifiHigh /> },
    { name: "Coffee Shop", icon: <PiCoffee /> },
    { name: "Bar", icon: <PiCoffee /> },
    { name: "Massage", icon: <PiUsers /> },
    { name: "Dry Cleaning", icon: <PiCoatHanger /> },
    { name: "Meeting Room", icon: <PiUsers /> },
    { name: "Restaurants", icon: <PiCoffee /> },
    { name: "Gym", icon: <PiBarbell /> },
    { name: "Karaoke", icon: <PiSpeakerHifi /> },
    { name: "Spa", icon: <PiSwimmingPool /> },
    { name: "Swimming Pool", icon: <PiSwimmingPool /> },
  ];

  const faqs = [
    { question: "Where Can I Get Some Room In Hotel?", answer: "You can book directly through our website or contact our front desk." },
    { question: "Why Do We Use It In Hotel?", answer: "Our services are designed to provide maximum comfort and luxury." },
    { question: "Where Does It Come From Hotel?", answer: "Our heritage dates back to 1920, established by the grand families of New York." },
    { question: "What Is Lorem Ipsum Hotel?", answer: "It is a long established fact that a reader will be distracted by the readable content." },
    { question: "Why Do We Use It In Hotel?", answer: "To ensure every guest experiences the pinnacle of hospitality." },
  ];

  const nearbyPlaces = [
    { name: "Museum of Cham Sculpture", dist: "800m" },
    { name: "Han River Bridge", dist: "800m" },
    { name: "Da Nang Cathedral", dist: "800m" },
    { name: "Dragon Bridge", dist: "800m" },
    { name: "Museum of Cham Sculpture", dist: "800m" },
    { name: "Han River Bridge", dist: "800m" },
    { name: "Da Nang Cathedral", dist: "800m" },
    { name: "Dragon Bridge", dist: "800m" },
    { name: "My Khe Beach", dist: "800m" },
    { name: "Museum of Cham Sculpture", dist: "800m" },
  ];

  const relatedRooms = [
    { id: 1, name: "Deluxe King Size", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800", price: "1,370", features: "Business, Family, Terrace", area: 250, beds: 2, adults: 3 },
    { id: 2, name: "Ocean View Suite", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", price: "1,850", features: "Ocean, Couple, Luxury", area: 180, beds: 1, adults: 2 },
    { id: 3, name: "Garden Villa", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800", price: "1,200", features: "Nature, Family, Quiet", area: 300, beds: 3, adults: 5 },
    { id: 4, name: "City Penthouse", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800", price: "2,500", features: "City, Luxury, Party", area: 400, beds: 2, adults: 4 },
    { id: 5, name: "Cozy Studio", image: "https://images.unsplash.com/photo-1522771753035-4a5042325b66?q=80&w=800", price: "950", features: "Budget, Solo, Cozy", area: 60, beds: 1, adults: 1 }
  ];

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

  return (
    <main className="w-full   pb-20">
      
      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-[#c23535] transition-colors p-2"
            >
                <FaTimes size={30} />
            </button>

            <button 
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#c23535] transition-colors p-4 bg-black/50 rounded-full"
            >
                <FaChevronLeft size={24} />
            </button>

            <img 
                src={roomImages[photoIndex]} 
                alt="Full View" 
                className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
            />

            <button 
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#c23535] transition-colors p-4 bg-black/50 rounded-full"
            >
                <FaChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm font-bold tracking-widest">
                {photoIndex + 1} / {roomImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* --- HEADER --- */}
      <section className="bg-[#283862] pt-32 pb-16 text-white text-center px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-30">
             <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
         </div>
         <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl noto-geogia-font font-bold mb-4 leading-tight">City Double Or Twin Room</h1>
            <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-300">
                <span className="hover:text-[#c23535] cursor-pointer transition-colors">Home</span>
                <span>/</span>
                <span className="hover:text-[#c23535] cursor-pointer transition-colors">Rooms Grid</span>
                <span>/</span>
                <span>Classic</span>
                <span>/</span>
                <span className="text-white">City Double Or Twin Room</span>
            </div>
         </div>
      </section>

      <section className="bg-white max-w-[1400px] mx-auto px-4 md:px-6 lg:px-16 py-8 md:py-12 md:rounded-[20px] md:-mt-10 relative z-20 shadow-xl">
        
        {/* --- IMAGE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[600px] mb-12">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-sm cursor-pointer" onClick={() => openLightbox(0)}>
                <img src={roomImages[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Main Room" />
            </div>
            <div className="hidden md:block relative group overflow-hidden rounded-sm cursor-pointer" onClick={() => openLightbox(1)}>
                <img src={roomImages[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Room Detail 1" />
            </div>
            <div className="hidden md:block relative group overflow-hidden rounded-sm cursor-pointer" onClick={() => openLightbox(2)}>
                <img src={roomImages[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Room Detail 2" />
            </div>
            <div className="hidden md:block relative group overflow-hidden rounded-sm cursor-pointer" onClick={() => openLightbox(3)}>
                <img src={roomImages[3]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Room Detail 3" />
            </div>
            <div className="relative group overflow-hidden rounded-sm cursor-pointer" onClick={() => openLightbox(4)}>
                <div className="absolute inset-0 bg-[#283862]/60 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-[#283862] px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#c23535] hover:text-white transition-colors rounded-sm">See All Photos</span>
                </div>
                <img src={roomImages[4]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Room Detail 4" />
                {/* Mobile 'See All' badge substitute */}
                <div className="md:hidden absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-sm">
                   + {roomImages.length - 2} Photos
                </div>
            </div>
        </div>

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
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        Angkor's Family Pool Suite is ideal for quality time together, with ample living space both indoors and out. Two ensuite bedrooms open onto a stylish living and dining room. Kids can splash in the enclosed garden pool while parents hideaway in the spa room complete with Jacuzzi. It's details like these that place us among the best resorts in Siem Reap.
                    </p>
                    
                    {/* Info Bar */}
                    <div className="bg-[#283862] p-6 rounded-sm flex flex-col md:flex-row gap-8 md:gap-16 text-white shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                <PiArrowsOutSimple className="text-2xl" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Size</div>
                                <div className="font-bold">100 m²</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                <PiBed className="text-2xl" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Beds</div>
                                <div className="font-bold">2 Beds, 1 Double</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center text-[#c23535] shrink-0">
                                <PiUsers className="text-2xl" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Adults</div>
                                <div className="font-bold">3 Adults</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Useful Information Table */}
                <div ref={infoRef} className="scroll-mt-32">
                    <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Useful Information</h3>
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                        {[
                            { label: "Value For Money", value: "4.2" },
                            { label: "Distance From City Center", value: "0.2Km" },
                            { label: "Cleanliness Rating", value: "4.9" },
                            { label: "Distance From Airport", value: "15Km" },
                            { label: "Nearest Airport", value: "International Airport" },
                        ].map((row, idx) => (
                            <div key={idx} className={`flex justify-between p-4 text-xs md:text-sm border-b border-gray-100 last:border-0 ${idx % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white'}`}>
                                <span className="font-bold text-[#283862]">{row.label}</span>
                                <span className="text-gray-500 font-medium text-right">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promo Banner */}
                <div className="relative rounded-sm overflow-hidden h-[250px] flex items-center group cursor-pointer shadow-md">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#283862]/90 to-transparent"></div>
                    <div className="relative z-10 p-8 md:p-12 max-w-xl">
                        <h3 className="text-white text-xl md:text-2xl noto-geogia-font font-bold mb-4">Travel Experience When Booking A Room At Hotelian Hotel</h3>
                        <p className="text-gray-300 text-xs mb-6 leading-relaxed line-clamp-2">
                            Wishing to keep the pristine nature of the island intact, not one tree has been moved — as evidenced by the villas growing up around them. The design pays homage.
                        </p>
                        <button className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[#c23535] transition-colors group-hover:translate-x-2 duration-300">
                            Read More <FaChevronRight/>
                        </button>
                    </div>
                </div>

                {/* Amenities */}
                <div ref={amenitiesRef} className="scroll-mt-32">
                    <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Amenities & Facilities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                        {amenities.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-gray-500 group">
                                <span className="text-[#EDA337] text-lg group-hover:text-[#c23535] transition-colors">{item.icon}</span>
                                <span className="text-xs md:text-sm font-medium group-hover:text-[#283862] transition-colors">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div ref={faqRef} className="scroll-mt-32">
                    <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-[#34425a] rounded-sm overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                                    className="w-full flex justify-between items-center p-4 text-left transition-colors bg-[#3f4e66] hover:bg-[#4a5a75]"
                                >
                                    <span className="font-bold text-white text-xs md:text-sm pr-4">{faq.question}</span>
                                    <div className="w-6 h-6 rounded-full bg-[#EDA337] flex items-center justify-center text-[#283862] text-xs shrink-0">
                                        {activeAccordion === idx ? <FaMinus /> : <FaPlus />}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {activeAccordion === idx && (
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 text-xs md:text-sm text-gray-300 bg-[#34425a] border-t border-gray-600/50 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nearby */}
                <div>
                    <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-6">Where To Go Nearby</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {nearbyPlaces.map((place, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-gray-200 pb-3 hover:border-[#c23535]/30 transition-colors group">
                                <div className="flex items-start gap-3">
                                    <BsGeoAlt className="text-[#EDA337] mt-1 shrink-0 group-hover:text-[#c23535] transition-colors" />
                                    <span className="text-sm text-gray-600 font-medium group-hover:text-[#283862] transition-colors">{place.name}</span>
                                </div>
                                <span className="text-xs text-gray-400 font-bold">{place.dist}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Accommodation Rules */}
                <div className="bg-[#283862] text-white p-8 rounded-sm shadow-md">
                    <h3 className="text-2xl noto-geogia-font font-bold mb-4 border-b border-gray-700 pb-4">Accommodation Rules</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Located just minutes from Siem Reap Town centre, and with a quiet boutique setting, Anantara Angkor boasts the best meeting venues in Siem Reap. Our versatile meeting spaces, both indoors and out.
                    </p>
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm mb-2 text-[#EDA337]">Other Regulations</h4>
                        <ul className="space-y-3 text-xs text-gray-400">
                            <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-[#EDA337] mt-1.5 shrink-0"></span> Pre-booked accommodation as per the itinerary on 9 nights in B&Bs</li>
                            <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-[#EDA337] mt-1.5 shrink-0"></span> Full breakfast each morning</li>
                            <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-[#EDA337] mt-1.5 shrink-0"></span> Walk selected eastern sections of Turkey's Lycian Way</li>
                        </ul>
                    </div>
                </div>

                {/* Reviews List */}
                <div ref={commentsRef} className="scroll-mt-32">
                    <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-8 pb-4 border-b border-gray-200">3 Comments</h3>
                    <div className="space-y-10">
                        {[1, 2, 3].map((item, idx) => (
                            <div key={idx} className="flex gap-4 md:gap-6 group">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 border-2 border-transparent group-hover:border-[#c23535] transition-all">
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + idx}?q=80&w=150&auto=format&fit=crop`} className="w-full h-full object-cover" alt="User" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-[#283862] text-base md:text-lg">Charles</h4>
                                        <button className="text-[10px] font-bold text-[#c23535] uppercase tracking-widest border border-[#c23535] px-3 py-1 rounded-sm hover:bg-[#c23535] hover:text-white transition-colors">Reply</button>
                                    </div>
                                    <div className="text-[10px] md:text-xs text-[#EDA337] font-bold uppercase tracking-wider mb-3">June 20, 2025 at 8:24 am</div>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        This was a last-minute booking as my previous booking didnt work out, and I wasnt sure what to expect being a hostel.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment Form */}
                <div className="bg-[#34425a] p-6 md:p-10 rounded-sm text-white shadow-md">
                    <h3 className="text-2xl noto-geogia-font font-bold mb-2">Leave A Comment</h3>
                    <p className="text-xs text-gray-400 mb-8">Your email address will not be published. Required fields are marked *</p>
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <textarea placeholder="Your Comment..." className="w-full h-32 bg-[#3f4e66] border border-gray-600 rounded-sm p-4 text-sm focus:outline-none focus:border-[#EDA337] text-white placeholder-gray-400 resize-none"></textarea>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input type="text" placeholder="Enter your name..." className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm p-4 text-sm focus:outline-none focus:border-[#EDA337] text-white placeholder-gray-400" />
                            <input type="email" placeholder="Email" className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm p-4 text-sm focus:outline-none focus:border-[#EDA337] text-white placeholder-gray-400" />
                        </div>
                        <div className="flex items-center gap-2">
                             <input type="checkbox" id="save-info" className="accent-[#EDA337] w-4 h-4 cursor-pointer" />
                             <label htmlFor="save-info" className="text-xs text-gray-400 cursor-pointer select-none">Save my name, email, and website in this browser for the next time I comment.</label>
                        </div>
                        <div className="flex gap-1 text-[#EDA337] text-xs py-2">
                             <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-600" />
                        </div>
                        <button type="button" className="bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold px-10 py-4 text-xs uppercase tracking-widest transition-colors rounded-sm shadow-lg w-full md:w-auto">
                            Post Comment
                        </button>
                    </form>
                </div>

            </div>

            {/* --- RIGHT COLUMN: SIDEBAR --- */}
            <aside className="lg:w-1/3 relative">
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
                                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                                    className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm text-white text-sm p-4 placeholder-gray-400 focus:outline-none focus:border-[#EDA337]" 
                                />
                                <input 
                                    type="email" 
                                    placeholder="Your Email" 
                                    value={bookingForm.email}
                                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                                    className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm text-white text-sm p-4 placeholder-gray-400 focus:outline-none focus:border-[#EDA337]" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Phone Number" 
                                    value={bookingForm.phone}
                                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                                    className="w-full bg-[#3f4e66] border border-gray-600 rounded-sm text-white text-sm p-4 placeholder-gray-400 focus:outline-none focus:border-[#EDA337]" 
                                />
                            </div>
                            
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center bg-[#3f4e66] p-3 rounded-sm border border-gray-600">
                                    <span className="text-sm font-medium pl-1">Number</span>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="hover:text-[#EDA337] transition-colors"><FaMinus size={10} /></button>
                                        <span className="text-sm font-bold w-4 text-center text-white">{rooms}</span>
                                        <button onClick={() => setRooms(rooms + 1)} className="hover:text-[#EDA337] transition-colors"><FaPlus size={10} /></button>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold">x ${basePrice} = ${basePrice * rooms}</div>
                                
                                <div className="flex justify-between items-center bg-[#3f4e66] p-3 rounded-sm border border-gray-600">
                                    <span className="text-sm font-medium pl-1">Children</span>
                                    <div className="flex items-center gap-4 text-gray-300">
                                        <button onClick={() => setChildren(Math.max(0, children - 1))} className="hover:text-[#EDA337] transition-colors"><FaMinus size={10} /></button>
                                        <span className="text-sm font-bold w-4 text-center text-white">{children}</span>
                                        <button onClick={() => setChildren(children + 1)} className="hover:text-[#EDA337] transition-colors"><FaPlus size={10} /></button>
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold">x ${childPrice} = ${children * childPrice}</div>
                            </div>

                            <div className="border-t border-gray-700 my-4 pt-4 flex justify-between font-bold text-lg text-[#EDA337]">
                                <span>Total:</span>
                                <span>${totalPrice}</span>
                            </div>

                            <button className="w-full bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold py-4 text-xs uppercase tracking-widest transition-colors rounded-sm shadow-md">
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
                        <div className="h-[200px] bg-gray-700 mb-6 overflow-hidden relative group cursor-pointer rounded-sm border border-gray-600">
                            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80" alt="Map" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-[#EDA337] flex items-center justify-center shadow-lg animate-bounce">
                                    <FaMapMarkerAlt className="text-[#283862]" />
                                </div>
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Location description</div>
                        <h4 className="text-lg font-bold mb-4 text-[#EDA337]">Checkin & Explore</h4>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            At Anantara Angkor Resort, our dedication to sustainability imbues every moment of the guest experience. We are blessed to call such a beautiful part of the world home.
                        </p>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-3"><FaCheck className="text-[#EDA337]" size={12} /> Excellent Location — Inner City</li>
                            <li className="flex items-center gap-3"><FaCheck className="text-[#EDA337]" size={12} /> Popular Area</li>
                        </ul>
                    </div>

                </div>
            </aside>
        </div>

        {/* --- RELATED ROOMS CAROUSEL --- */}
        <div className="mt-20">
            <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-6">
                <h2 className="text-2xl md:text-3xl noto-geogia-font font-bold text-[#283862]">You May Interested Room</h2>
                <div className="flex gap-2">
                    <button onClick={prevRelated} className="w-10 h-10 border border-gray-300 hover:border-[#c23535] hover:bg-[#c23535] hover:text-white rounded-sm flex items-center justify-center transition-colors">
                        <FaChevronLeft />
                    </button>
                    <button onClick={nextRelated} className="w-10 h-10 border border-gray-300 hover:border-[#c23535] hover:bg-[#c23535] hover:text-white rounded-sm flex items-center justify-center transition-colors">
                        <FaChevronRight />
                    </button>
                </div>
            </div>
            
            {/* Carousel Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <AnimatePresence mode='popLayout'>
                     {visibleRelated.map((item, idx) => (
                         <motion.div 
                             key={`${item.id}-${idx}`}
                             initial={{ opacity: 0, x: 50 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: -50 }}
                             transition={{ duration: 0.3 }}
                             className={`group cursor-pointer bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${idx === 2 ? 'hidden lg:block' : ''} ${idx === 1 ? 'hidden md:block' : ''}`}
                         >
                             <div className="relative h-64 overflow-hidden mb-6">
                                 <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                                 <div className="absolute top-4 left-4 bg-[#283862]/90 text-white text-xs font-bold px-3 py-1 flex items-center gap-1 rounded-sm shadow-md">
                                     <FaStar className="text-[#EDA337]" /> (5)
                                 </div>
                             </div>
                             <div className="px-6 pb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl noto-geogia-font font-bold text-[#283862] group-hover:text-[#c23535] transition-colors">{item.name}</h3>
                                    <div className="text-xs font-bold text-[#EDA337] mt-1 bg-[#EDA337]/10 px-2 py-1 rounded-sm">From ${item.price}</div>
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <PiArrowsOutSimple className="text-[#c23535]" /> {item.features}
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 border-t border-gray-100 pt-4">
                                    <div className="flex gap-4">
                                        <span className="flex items-center gap-1"><PiArrowsOutSimple /> {item.area} m²</span>
                                        <span className="flex items-center gap-1"><PiBed /> {item.beds} Beds</span>
                                        <span className="flex items-center gap-1"><PiUsers /> {item.adults} Adults</span>
                                    </div>
                                    <button className="text-[#283862] hover:text-[#c23535] uppercase flex items-center gap-1 transition-colors">Book Now <FaChevronRight className="text-[10px]" /></button>
                                </div>
                             </div>
                         </motion.div>
                     ))}
                 </AnimatePresence>
            </div>
        </div>

      </section>
    </main>
  );
};
