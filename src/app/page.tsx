"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  FaRegCalendarAlt,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaTwitter,
} from 'react-icons/fa';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { PiArrowsOutSimple, PiBathtub, PiBed, PiCar, PiCoffee, PiSwimmingPool, PiTelevision, PiWifiHigh } from 'react-icons/pi';
import { RiDoubleQuotesL, RiFacebookBoxFill } from 'react-icons/ri';
import { IoLogoLinkedin } from 'react-icons/io';


interface SlideData {
  image: string;
  title: string;
  subtitle: string;
}

export default function Home() {

  const slides: SlideData[] = [
    {
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop",
      title: "Mountains Legacy Stay",
      subtitle: "Food indulgence in mind, come next door and sate your desires with our ever changing internationally and seasonally."
    },
    {
      image: "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2525&auto=format&fit=crop",
      title: "Oceanfront Paradise",
      subtitle: "Wake up to the sound of waves and experience ultimate relaxation in our premium oceanfront suites."
    },
    {
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2525&auto=format&fit=crop",
      title: "Tropical Garden Villa",
      subtitle: "Immerse yourself in nature with our secluded garden villas, offering private pools and lush greenery."
    }
  ];

  const rooms = [
    {
      id: 1,
      name: "Junior Suite",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop",
      price: 150,
      description: "Our Junior Suites offer a perfect blend of comfort and luxury, featuring a spacious living area and a private balcony with stunning views/.",
      amenities: {
        beds: 1,
        baths: 1,
        area: 45
      }
    },
    {
      id: 2,
      name: "Family Room",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2574&auto=format&fit=crop",
      price: 250,
      description: "Designed with families in mind, this spacious room offers multiple beds and a cozy atmosphere for a memorable stay.",
      amenities: {
        beds: 3,
        baths: 2,
        area: 75
      }
    },
    {
      id: 3,
      name: "Double Room",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2574&auto=format&fit=crop",
      price: 180,
      description: "Ideal for couples or solo travelers, our Double Rooms provide a tranquil retreat with modern amenities and elegant decor.",
      amenities: {
        beds: 2,
        baths: 1,
        area: 35
      }
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    arrival: '',
    departure: '',
    adults: '',
    children: ''
  });
  const [pageSections, setPageSections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const arrivalRef = useRef<HTMLInputElement>(null);
  const departureRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/page-sections?page=home');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setPageSections(data.data.filter((s: any) => s.status === 'active'));
        } else {
          setError(data.message || 'Failed to fetch sections');
        }
      } catch (error: any) {
        console.error('Error fetching page sections:', error);
        setError(`Failed to connect to backend: ${error.message}`);
      }
    };
    fetchSections();
  }, []);

  // Carousel Navigation
  const nextSlide = () => {
    if (!slides?.length) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (!slides?.length) return;
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.type = 'date';
    e.target.showPicker?.();
  };

  const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      e.target.type = 'text';
    }
  };

  const currentData = slides[currentSlide];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlideCarousel = () => {
    setCurrentIndex((prev) => (prev + 1) % rooms.length);
  };

  const prevSlideCarousel = () => {
    setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const getSlidePosition = (index: number) => {
    if (index === currentIndex) return "center";
    if (index === (currentIndex - 1 + rooms.length) % rooms.length) return "left";
    if (index === (currentIndex + 1) % rooms.length) return "right";
    return "hidden";
  };

  const activeRoom = rooms[currentIndex];

  const amenities = [
    {
      icon: <PiWifiHigh />,
      title: "High Speed Wifi",
      desc: "With our service you may enjoy the finest life in our resort."
    },
    {
      icon: <PiCar />,
      title: "Pick & Drop Facility",
      desc: "With our service you may enjoy the finest life in our resort."
    },
    {
      icon: <PiTelevision />,
      title: "Smart TV",
      desc: "With our service you may enjoy the finest life in our resort."
    },
    {
      icon: <PiSwimmingPool />,
      title: "Swimming Pool",
      desc: "With our service you may enjoy the finest life in our resort."
    },
    {
      icon: <PiCoffee />,
      title: "Breakfast Included",
      desc: "With our service you may enjoy the finest life in our resort."
    },
    {
      icon: <PiBathtub />,
      title: "Shower Bathtub",
      desc: "With our service you may enjoy the finest life in our resort."
    }
  ];

  const renderSection = (type: string) => {
    switch (type) {
      case 'slider':
        return (
          <section key="slider" className="relative w-full h-[850px] overflow-hidden">
            {/* Background Image with Transition */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode='popLayout'>
                <motion.img
                  key={currentSlide}
                  src={currentData.image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  alt="Luxury Resort Background"
                  className="w-full h-[140%] object-cover absolute inset-0"
                />
              </AnimatePresence>
              {/* Subtle overlay to make text pop against the blue water/sky */}
              <div className="absolute inset-0 bg-black/10 z-10"></div>
            </div>

            {/* Hero Content - Centered Left */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16  w-full max-w-[1800px] mt-0 lg:mt-18 mx-auto pb-115 md:pb-40">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="md:max-w-4xl"
                >
                  <h1 className="text-lg md:text-5xl lg:text-[5.4rem] font-serif text-white mb-2 md:mb-6 leading-[1.1] drop-shadow-lg">
                    {currentData.title}
                  </h1>
                  <p className="text-white text-sm md:text-[1.47rem] font-normal md:mb-12 max-w-2xl leading-relaxed opacity-95">
                    {currentData.subtitle}
                  </p>

                  <button className="bg-white hover:bg-gray-100 text-[#222] font-bold h-[55px] px-10 rounded-[4px] text-[13px] tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl">
                    View Rooms
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Elements Container (Bottom) */}
            <div className="absolute bottom-12 mt-10 md:mt-0 left-0 right-0 z-20 px-6 lg:px-16 max-w-[1800px] mx-auto w-full flex justify-between items-end pointer-events-none">
              {/* Booking Bar - Left/Center */}
              <div className="bg-white rounded-[6px] shadow-2xl p-6 lg:p-8 w-full max-w-[1100px] pointer-events-auto">
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end" onSubmit={(e) => e.preventDefault()}>
                  {/* Arrival Date */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[#1a1a1a] font-bold text-[14px] tracking-wide">Arrival Date</label>
                    <div className="relative group cursor-pointer" onClick={() => arrivalRef.current?.focus()}>
                      <input
                        ref={arrivalRef}
                        type={formData.arrival ? "date" : "text"}
                        value={formData.arrival}
                        onChange={(e) => handleInputChange('arrival', e.target.value)}
                        onFocus={handleDateFocus}
                        onBlur={handleDateBlur}
                        placeholder="Arrival Date"
                        className="w-full h-[50px] pl-4 pr-10 bg-white border border-gray-200 rounded-[4px] text-gray-600 placeholder-gray-500 text-[14px] focus:outline-none focus:border-brand-blue transition-colors cursor-pointer"
                      />
                      <FaRegCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none" />
                    </div>
                  </div>
                  {/* Departure Date */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[#1a1a1a] font-bold text-[14px] tracking-wide">Departure Date</label>
                    <div className="relative cursor-pointer" onClick={() => departureRef.current?.focus()}>
                      <input
                        ref={departureRef}
                        type={formData.departure ? "date" : "text"}
                        value={formData.departure}
                        onChange={(e) => handleInputChange('departure', e.target.value)}
                        onFocus={handleDateFocus}
                        onBlur={handleDateBlur}
                        placeholder="Departure Date"
                        className="w-full h-[50px] pl-4 pr-10 bg-white border border-gray-200 rounded-[4px] text-gray-600 placeholder-gray-500 text-[14px] focus:outline-none focus:border-brand-blue transition-colors cursor-pointer"
                      />
                      <FaRegCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none" />
                    </div>
                  </div>

                  {/* Adults */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[#1a1a1a] font-bold text-[14px] tracking-wide">Adults</label>
                    <div className="relative">
                      <select
                        value={formData.adults}
                        onChange={(e) => handleInputChange('adults', e.target.value)}
                        className="w-full h-[50px] pl-4 pr-8 bg-white border border-gray-200 rounded-[4px] text-gray-500 text-[14px] appearance-none focus:outline-none focus:border-brand-blue cursor-pointer"
                      >
                        <option value="" disabled hidden>Adults</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[#1a1a1a] font-bold text-[14px] tracking-wide">Children</label>
                    <div className="relative">
                      <select
                        value={formData.children}
                        onChange={(e) => handleInputChange('children', e.target.value)}
                        className="w-full h-[50px] pl-4 pr-8 bg-white border border-gray-200 rounded-[4px] text-gray-500 text-[14px] appearance-none focus:outline-none focus:border-brand-blue cursor-pointer"
                      >
                        <option value="" disabled hidden>Children</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3+</option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="h-full flex items-end">
                    <button
                      type="submit"
                      className="w-full h-[50px] bg-[#c23535] text-white font-bold text-[14px] rounded-[4px] shadow-sm transition-colors tracking-wide hover:bg-[#a12b2b]"
                      onClick={() => alert(`Checking availability for:\nCheck-in: ${formData.arrival}\nCheck-out: ${formData.departure}\nAdults: ${formData.adults}\nChildren: ${formData.children}`)}
                    >
                      Check Availability
                    </button>
                  </div>

                </form>
              </div>

              {/* Slider Navigation Arrows - Bottom Right */}
              <div className="hidden xl:flex flex-col gap-4 mb-2 pointer-events-auto shrink-0 ml-6">
                {/* Right Arrow (Next) */}
                <button
                  onClick={nextSlide}
                  className="w-[60px] h-[60px] rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-[#c23535] hover:text-brand-dark transition-all duration-300  z-30"
                >
                  <FaChevronRight className="text-xl ml-1" />
                </button>
                {/* Left Arrow (Prev) */}
                <button
                  onClick={prevSlide}
                  className="w-[60px] h-[60px] rounded-full border border-white/80 text-white flex items-center justify-center hover:bg-[#c23535] hover:text-brand-dark transition-all duration-300 z-30"
                >
                  <FaChevronLeft className="text-xl mr-1" />
                </button>
              </div>

            </div>
          </section>
        );
      case 'bannerone':
        return (
          <div key="bannerone" className='before:absolute before:-top-[12px] before:left-5 before:w-[88%] md:before:w-[95%] lg:before:w-[97%]  before:h-[13px] before:content-[""] before:bg-white/45 before:rounded-t-[8px] w-full relative'>
            <section className='rounded-t-[10px] rounded-b-none bg-white overflow-hidden relative'>
              <div className='mx-0 md:mx-5  w-full flex flex-col lg:flex-row min-h-[700px] '>
                {/* 1. Image Section (Left) */}
                <div className="w-full md:w-[95%] lg:w-[25%] relative min-h-[400px] lg:min-h-full">
                  <img
                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop"
                    alt="Snowy Chalet"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 2. Dark Blue Card Section (Middle) */}
                <div className="w-full md:w-[95%] lg:w-[25%] bg-[#283862] p-10 lg:p-10
                 xl:p-14 flex flex-col justify-center text-white">
                  <div className="flex flex-col gap-6">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-2xl xl:text-2xl font-normal leading-snug font-sans"
                    >
                      A Luxurious Way to Meet with nature. The comfort and the needs of our guests come before all else here.
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-gray-300 text-sm leading-relaxed"
                    >
                      We have varities of room and suits according your need
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <button className="mt-6 bg-[#c23535] text-white font-bold h-[50px] px-8 rounded-[4px] text-[13px] tracking-widest uppercase transition-colors w-max">
                        Discover More
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* 3. White Content Section (Right) */}
                <div className="w-full  bg-white p-10 xl:p-20 flex flex-col justify-center">
                  <div className="flex flex-col gap-8">

                    {/* Subheader */}
                    <div className="flex items-center gap-1">
                      <span className="w-12 h-[2px] bg-[#c23535]"></span>
                      <span className="text-end text-[#c23535] text-xs lg:text-sm font-bold tracking-[0.15em] uppercase">
                        Welcome to Bluebell
                      </span>
                    </div>

                    {/* Main Headline */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-4xl xl:text-[3.25rem] font-serif text-[#283862] leading-[1.2] font-semibold"
                    >
                      We Invite guests to celebrate life
                    </motion.h2>

                    {/* Description Text */}
                    <div className="text-gray-500 text-[15px] leading-relaxed space-y-6 font-light">
                      <p>
                        Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality. Delightful herbs and flavors consolidate textures to pacify wide based palates.
                      </p>
                      <p>
                        Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean inspired food mixed with New York attitude.
                      </p>
                    </div>

                    {/* Signature */}
                    <div className="mt-4">
                      <span className="font-cursive text-4xl text-gray-500">Kathy A. Xemn</span>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'room':
        return (
          <section key="room" className='rounded-t-[10px] bg-white overflow-hidden py-20 flex flex-col items-center mx-5 my-5'>
            {/* Header */}
            <div className="text-center mb-16 px-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
                <span className="text-[#c23535] text-xs font-bold tracking-[0.15em] uppercase">Accommodation</span>
                <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
              </div>
              <h2 className="text-4xl md:text-[3.5rem] font-serif text-[#283862] font-bold">Our Rooms & Suites</h2>
            </div>

            {/* Carousel Container */}
            <div className="relative w-full h-[500px] max-w-[1800px] flex justify-center items-center mb-8">
              {rooms.map((room, index) => {
                const position = getSlidePosition(index);
                if (position === 'hidden') return null;

                const isCenter = position === 'center';
                const isLeft = position === 'left';

                const variants = {
                  center: { x: "0%", scale: 1, opacity: 1, zIndex: 20 },
                  left: { x: "-65%", scale: 0.85, opacity: 1, zIndex: 10 },
                  right: { x: "65%", scale: 0.85, opacity: 1, zIndex: 10 }
                };

                return (
                  <motion.div
                    key={room.id}
                    initial="center"
                    animate={position}
                    variants={variants}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute w-[80%] md:w-[60%] lg:w-[45%] h-full rounded-md overflow-hidden shadow-xl"
                  >
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    {!isCenter && (
                      <div
                        className="absolute inset-0 bg-black/30 transition-colors flex items-center justify-center cursor-pointer group"
                        onClick={isLeft ? prevSlideCarousel : nextSlideCarousel}
                      >
                        {isLeft ? (
                          <BsArrowLeft className="hidden md:inline text-white text-6xl opacity-90 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2 duration-300 drop-shadow-lg" />
                        ) : (
                          <BsArrowRight className="hidden md:inline text-white text-6xl opacity-90 group-hover:opacity-100 transition-all transform group-hover:translate-x-2 duration-300 drop-shadow-lg" />
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Room Details Section */}
            <div className="w-full max-w-[1200px] px-6 lg:px-0 mt-8">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeRoom.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row gap-8 md:gap-16 items-start lg:px-30"
                >
                  <div className="w-full md:w-1/3 flex flex-col">
                    <span className="text-[#c23535] font-bold uppercase tracking-widest text-xs">Price from ${activeRoom.price} Night</span>
                    <h3 className="text-3xl md:text-4xl font-serif text-[#283862] font-bold leading-tight">{activeRoom.name}</h3>
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col gap-6">
                    <div className="flex flex-row items-center gap-1 md:gap-8 border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <PiBed className="text-2xl" />
                        <span className="text-sm">{activeRoom.amenities.beds} beds</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <PiBathtub className="text-2xl" />
                        <span className="text-sm">{activeRoom.amenities.baths} Bathroom</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <PiArrowsOutSimple className="text-2xl" />
                        <span className="text-sm">{activeRoom.amenities.area} m2</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-[15px] leading-relaxed">{activeRoom.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        );
      case 'bannertwo':
        return (
          <section key="bannertwo" className="py-30 px-6 lg:px-16 w-full overflow:hidden">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
                  <span className="text-[#c23535] text-xs font-bold tracking-[0.15em] uppercase">Amenities</span>
                  <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
                </div>
                <h2 className="text-4xl md:text-[3.5rem] font-serif text-white font-bold">Make Your Stay Memorable</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                {amenities.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-5 group"
                  >
                    <div className="text-[#c23535] text-5xl pt-1 transition-transform duration-300 group-hover:-translate-y-1">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-white text-xl font-bold font-sans">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'bannerthree':
        return (
          <div key="bannerthree" className='before:absolute before:-top-[12px] before:left-5 before:w-[91%] md:before:w-[95%] lg:before:w-[97%] before:h-[13px] before:content-[""] before:bg-white/45 before:rounded-t-[8px]  after:left-5 after:w-[91%] md:after:w-[95%] lg:after:w-[97%] after:h-[13px] after:content-[""] after:bg-white/45 after:rounded-b-[8px] after:absolute after:top-auto  w-full relative'>
            <section className="bg-white py-20 lg:py-32 overflow-hidden rounded-[10px]">
              {/* Restaurant */}
              <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-32 lg:mb-48">
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="w-full lg:w-[40%] relative mb-16 lg:mb-0">
                    <span className="hidden lg:block absolute -left-12 top-10 -rotate-90 origin-top-left text-xs font-bold tracking-[0.3em] text-gray-300 uppercase">Restaurant</span>
                    <div className="relative mr-8 lg:mr-16">
                      <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9" alt="Restaurant" className="w-full h-[400px] lg:h-[550px] object-cover" />
                      <div className="absolute -bottom-10 -right-4 z-0 lg:-right-12 border-[12px] border-[#f8f9fa] w-[200px] lg:w-[300px] h-[150px] lg:h-[320px]">
                        <img src="https://images.unsplash.com/photo-1555126634-323283e090fa" alt="Food" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-[60%] bg-[#F8F9FA] mt-52 relative lg:-ml-12 z-10">
                    <div className="bg-[#F8F9FA] pl-0 md:pl-10 pt-10 pb-10 lg:pl-16 lg:pt-16 lg:pb-16 relative">
                      <div className='pl-5 md:pl-15'>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-8 h-[1px] bg-[#c23535]"></div>
                          <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Eat & Drink</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-serif text-[#283862] font-bold leading-tight mb-8">Indulge in exceptional <br /> & Local Foodies</h2>
                        <p className="text-gray-500 text-sm mb-10 font-medium tracking-wide">Open Daily : 7.30 am - 11.00pm</p>
                        <button className="bg-white hover:bg-[#c23535] hover:text-white border border-gray-200 text-[#283862] font-bold py-4 px-8 text-[11px] tracking-[0.2em] uppercase shadow-sm">Read More</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wellness */}
              <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
                <div className="flex flex-col lg:flex-row-reverse items-center">
                  <div className="w-full lg:w-1/2 relative mb-16 lg:mb-0">
                    <div className="relative ml-8 lg:ml-16">
                      <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874" alt="Spa" className="w-full h-[400px] lg:h-[500px] object-cover" />
                      <div className="absolute -bottom-10 -left-4 lg:-left-12 z-20 border-[8px] border-[#f8f9fa] w-[200px] lg:w-[280px] h-[150px] lg:h-[200px]">
                        <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91" alt="Spa Products" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 relative lg:-mr-12 z-10">
                    <div className="bg-[#F8F9FA] p-10 lg:p-16">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-[1px] bg-[#c23535]"></div>
                        <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Wellness</span>
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-serif text-[#283862] font-bold leading-tight mb-8">A truly luxurious <br /> experience for <br /> the senses</h2>
                      <p className="text-gray-500 text-sm font-medium tracking-wide leading-relaxed">For special rates please contact the <br /> front office : +1800-456-7890</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'bannerfour':
        return (
          <section key="bannerfour" className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" alt="Offer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#283862]/90 via-[#283862]/80 to-[#283862]/60"></div>
            </div>
            <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 lg:px-16 flex items-center justify-end">
              <div className="max-w-xl text-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[2px] bg-[#c23535]"></div>
                  <span className="text-white text-xs font-bold tracking-[0.25em] uppercase">Our Offer</span>
                </div>
                <h2 className="text-5xl md:text-[4rem] font-serif text-white font-bold mb-6 leading-tight">Summer Offer</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-10 font-light">Benefit from a 10% discount, making your reservations with a minimum of 3 days in advance</p>
                <button className="bg-[#c23535] text-white text-[11px] font-bold tracking-[0.2em] uppercase px-9 py-4 rounded-[2px] transition-colors shadow-lg">Find Out More</button>
              </div>
            </div>
          </section>
        );
      case 'testimonials':
        return (
          <div key="testimonials"
            className="relative w-full before:absolute before:-top-[12px] before:left-5 before:w-[91%] sm:before:w-[93%] md:before:w-[95%] lg:before:w-[97%] before:h-[13px] before:content-[''] before:bg-white/45 before:rounded-t-[8px] after:absolute after:-bottom-[13px] after:left-5 after:w-[91%] sm:after:w-[93%] md:after:w-[95%] lg:after:w-[97%] after:h-[13px] after:content-[''] after:bg-white/45 after:rounded-b-[8px] after:z-10"
          >
            <section className="bg-white py-10 sm:py-12 md:py-14 lg:py-20 rounded-[10px] md:px-5">
              <div className="max-w-[1200px] mx-auto">
                <div className="mb-16 max-w-4xl ml-5 md:ml-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-[2px] bg-[#c23535]" />
                    <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Testimonials</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-[3.5rem] font-serif text-[#283862] font-bold mb-6">What Our Customer Says</h2>
                  <p className="text-gray-500 text-[15px] leading-relaxed max-w-3xl">Our objective at Bluebell is to bring together our visitor's societies and spirits with our own.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="bg-[#F9F9F9] p-8 sm:p-10 md:p-14 border border-gray-100/50">
                      <div className="text-[#c23535] text-4xl mb-6 opacity-80"><RiDoubleQuotesL /></div>
                      <h3 className="text-xl sm:text-2xl font-serif text-[#283862] font-bold mb-4">My Favourite Place</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-8">The team at Baroque is incredibly dedicated, knowledgeable, and helpful.</p>
                      <div className="w-full h-[1px] bg-gray-200 mb-6" />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" className="w-full h-full object-cover grayscale" />
                        </div>
                        <span className="text-[#c23535] text-xs font-bold tracking-[0.15em] uppercase">Berber Smith</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="w-full">
      {pageSections.length > 0 ? (
        pageSections.map((section: any) => renderSection(section.type))
      ) : error ? (
        <div className="w-full h-screen flex flex-col items-center justify-center p-10 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Issue</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-400">Please ensure the backend server is running on port 5000.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-[#c23535] text-white px-6 py-2 rounded shadow hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        // Fallback or Loading state
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c23535]"></div>
        </div>
      )}
    </main>
  );
}
