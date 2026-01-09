"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  FaRegCalendarAlt,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  // FaTwitter,
} from 'react-icons/fa';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { PiArrowsOutSimple, PiBathtub, PiBed, PiCar, PiCoffee, PiSwimmingPool, PiTelevision, PiWifiHigh } from 'react-icons/pi';
import { RiDoubleQuotesL, RiFacebookBoxFill } from 'react-icons/ri';
import {  getImageUrl } from '../utils/getImage';
import { RiDoubleQuotesR } from "react-icons/ri";
import { IoIosArrowRoundBack, IoIosArrowRoundForward, IoLogoLinkedin } from 'react-icons/io';
import { FaStar } from "react-icons/fa6";
import { FaStarHalfStroke } from "react-icons/fa6";


import { showAlert } from '../utils/alertStore';
import { useSliderStore } from '../store/useSliderStore';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCurrency } from '@/hooks/useCurrency';
import { useAccommodationStore } from '@/store/useAccomodationStore';
import { Reviews, useReviewStore } from '@/store/useReviewStore';



interface SlideData {
  image: string;
  title: string;
  subtitle: string;
  buttonName?: string;
  buttonUrl?: string;
}

export default function Home() {
  const { formatPrice } = useCurrency();
  const { fetchReview, reviews } = useReviewStore();
  const [testimonialData, setTestimonialData] = useState<Reviews[]>()

  useEffect(() => {
    fetchReview({ status: 'approved' });
  }, []);

  useEffect(() => {
    if (reviews) {
      const topReviews = reviews.filter(item => item.rating > 3);
      const visibleMax: Reviews[] = topReviews.length > 10 ? topReviews.slice(0, 10) : topReviews;
      setTestimonialData(visibleMax);
    }
  }, [reviews])


  const { slides, fetchActiveSlides, loading } = useSliderStore();
  const { accommodations, fetchAccommodations, isLoading: accommodationsLoading } = useAccommodationStore();
  const router = useRouter();

  const handleCheckAvailability = () => {
    const params = new URLSearchParams();
    if (formData.arrival) params.append('arrival', formData.arrival);
    if (formData.departure) params.append('departure', formData.departure);
    if (formData.adults) params.append('adults', formData.adults);
    if (formData.children) params.append('children', formData.children);

    router.push(`/rooms?${params.toString()}`);
  };

  useEffect(() => {
    fetchActiveSlides();
    fetchAccommodations();
  }, [fetchActiveSlides, fetchAccommodations]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    arrival: '',
    departure: '',
    adults: '',
    children: ''
  });

  const arrivalRef = useRef<HTMLInputElement>(null);
  const departureRef = useRef<HTMLInputElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Testimonial carousel
  const [testimonialIndex, setTestimonialIndex] = useState(0);


  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { default: axiosInstance } = await import('../api/axiosInstance');
        const res = await axiosInstance.get('/site/bookings/booked-dates');
        if (res.data.status) {
          const dates = res.data.data.map((d: string) => new Date(d));
          setBookedDates(dates);
        }
      } catch (err) {
        console.error("Failed to fetch booked dates", err);
      }
    };
    fetchBookedDates();
  }, []);

  const carouselTestimonials: Reviews[] | undefined = testimonialData;


  useEffect(() => {
    if (!testimonialData || testimonialData.length === 0) return;

    const interval = setInterval(() => {
      if (carouselTestimonials) {
        setTestimonialIndex((prev) =>
          // (prev + 1) % testimonialData.length
          (prev + 1) % carouselTestimonials.length
        );
      }
    }, 4000); // 4 sec
    return () => clearInterval(interval);
    }, [testimonialData]);

  if (loading || slides.length === 0) {
    return <div className="w-full h-screen flex justify-center items-center">Loading...</div>;
  }

  const rooms = accommodations.map((acc: any) => ({
    id: acc._id,
    name: acc.title,
    price: acc.price,
    description: acc.description,
    amenities: {
      beds: acc.beds || 1,
      baths: acc.bathroom || 1,
      area: 45 // Default area as it's not in the backend model yet
    },
    image: getImageUrl(
    acc.image,
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop"
  ),
  }));
console.log('rooms',rooms)


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

  const roomData = [
    {
      id: 1,
      name: "Junior Suite",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2670&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Family Room",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2674&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Double Room",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2670&auto=format&fit=crop"
    }
  ];



  const nextSlideCarousel = () => {
    setCurrentIndex((prev) => (prev + 1) % rooms.length);
  };

  const prevSlideCarousel = () => {
    if (rooms.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const getSlidePosition = (index: number) => {
    if (index === currentIndex) return "center";
    if (index === (currentIndex - 1 + rooms.length) % rooms.length) return "left";
    if (index === (currentIndex + 1) % rooms.length) return "right";
    return "hidden";
  };

  if (accommodationsLoading || accommodations.length === 0) {
    if (accommodationsLoading) return <div className="w-full h-[500px] flex justify-center items-center">Loading Accommodations...</div>;
    // return null; // Or some fallback
  }

  const activeRoom = rooms[currentIndex] || rooms[0];

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



  return (
    <main className="w-full">

      <section className="relative w-full h-[850px] overflow-hidden">
        {/* Background Image with Transition */}
        {/* Background Image with Transition */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide} // Ensures animation triggers on slide change
              src={currentData.image || "/image/666.jpg"} // Dynamic image from store, fallback to old one
              alt={currentData.title || "Hero Background"}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>

          {/* Subtle overlay to make text readable */}
          <div className="absolute inset-0 bg-black/10 z-10"></div>
        </div>

        {/* Hero Content - Centered Left */}
        <div className="relative h-[380px] sm:h-[420px] md:h-[480px] lg:h-[600px] w-full bg-brand-navy flex items-center justify-center text-white text-center px-4 overflow-hidden mb-4">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:max-w-4xl"
            >
              <h1 className="noto-geogia-font font-bold text-[#ffffffba] text-2xl sm:text-3xl md:text-4xl lg:text-[60px] mb-4 sm:mb-5 md:mb-6 lg:mb-[30px] drop-shadow-lg">
                {currentData.title}
              </h1>

              <p className="text-white text-[10px] md:text-[18px] lg:text-[20px] font-normal md:mb-12 max-w-2xl leading-relaxed opacity-95">
                {currentData.subtitle}
              </p>

              <a
                href={currentData.buttonUrl || "/rooms"}
                className="inline-block bg-white hover:bg-gray-100 text-[#222] font-bold h-[55px] px-10 rounded-[4px] text-[13px] tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl flex items-center justify-center w-fit pt-[18px]"
              >
                {currentData.buttonName || "View Rooms"}
              </a>
            </motion.div>
          </AnimatePresence>

        </div>


        {/* Floating Elements Container (Bottom) */}
        <div className="absolute bottom-12 mt-10 md:mt-0 left-0 right-0 z-20 px-6 lg:px-16 max-w-[1800px] mx-auto w-full flex justify-between items-end pointer-events-none">
          {/* Booking Bar - Left/Center */}
          <div className="bg-white rounded-[6px] shadow-2xl p-6 lg:p-8 w-full max-w-[1100px] pointer-events-auto">
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end" onSubmit={(e) => { e.preventDefault(); handleCheckAvailability(); }}>
              {/* Arrival Date */}
              <div className="flex flex-col gap-3">
                <label className="text-[#1a1a1a] font-bold text-[14px] tracking-wide">Arrival Date</label>
                <div className="relative group cursor-pointer z-50">
                  {/* Arrival Date */}
                  <DatePicker
                    selected={formData.arrival ? new Date(formData.arrival) : null}
                    onChange={(date: Date | null) =>
                      handleInputChange('arrival', date ? date.toISOString().split('T')[0] : '')
                    }
                    excludeDates={bookedDates}
                    placeholderText="Arrival Date"
                    className="..."
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                  />
                  <FaRegCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg pointer-events-none" />
                </div>
              </div>
              {/* Departure Date */}
              <div className="flex flex-col gap-3">
                <label className="text-[#1a1a1a] font-bold text-[14px] tracking-wide">Departure Date</label>
                <div className="relative cursor-pointer z-50">
                  <DatePicker
                    selected={formData.departure ? new Date(formData.departure) : null}
                    onChange={(date: Date | null) => handleInputChange('departure', date ? date.toISOString().split('T')[0] : '')}
                    excludeDates={bookedDates}
                    placeholderText="Departure Date"
                    className="w-full h-[50px] pl-4 pr-10 bg-white border border-gray-200 rounded-[4px] text-gray-600 placeholder-gray-500 text-[14px] focus:outline-none focus:border-brand-blue transition-colors cursor-pointer"
                    dateFormat="yyyy-MM-dd"
                    minDate={formData.arrival ? new Date(formData.arrival) : new Date()}
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
      <div className='before:absolute before:-top-[12px] before:left-5 before:w-[88%] md:before:w-[95%] lg:before:w-[97%]  before:h-[13px] before:content-[""] before:bg-white/45 before:rounded-t-[8px] w-full relative'>
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
                  className="text-2xl xl:text-2xl font-normal leading-snug  "
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
                  className="text-4xl xl:text-[3.25rem] noto-geogia-font text-[#283862] leading-[1.2] font-semibold"
                >
                  We Invite guests to celebrate life
                </motion.h2>

                {/* Description Text */}
                <div className="text-gray-500 text-[15px] leading-relaxed space-y-6 font-light">
                  <p>
                    Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality. Delightful herbs and flavors consolidate surfaces to pacify wide based palates.
                  </p>
                  <p>
                    Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality.
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-4">
                  <span className="font-cursive text-4xl text-gray-500">Kathy A. Xemn</span>
                </div>

              </div>
            </div>
          </div>

          <div className="mx-5 py-20 bg-white overflow-hidden flex flex-col items-center mx-5 my-5 rounded-[10px]">
            {/* Header */}
            <div className="text-center mb-16 px-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
                <span className="text-[#c23535] text-xs font-bold tracking-[0.15em] uppercase">Accomodation</span>
                <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
              </div>
              <h2 className="text-4xl md:text-[3.5rem] noto-geogia-font text-[#283862] font-bold">Our Rooms & Suits</h2>
            </div>

            {/* Carousel Container */}
            <div className="relative w-full h-[500px] max-w-[1800px] flex justify-center items-center mb-8">
              {rooms.map((room, index) => {
                const position = getSlidePosition(index);
                if (position === 'hidden') return null;

                const isCenter = position === 'center';
                const isLeft = position === 'left';

                // Animation variants
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
                    className="absolute w-[80%] md:w-[60%] lg:w-[45%] h-full rounded-md overflow-visible shadow-xl"
                  >
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    {!isCenter && (
                      <div
                        className="absolute inset-0 bg-black/30 md:bg-black/30 transition-colors flex items-center justify-center cursor-pointer group"
                        onClick={isLeft ? prevSlideCarousel : nextSlideCarousel}
                      >
                        {isLeft ? (
                          <div className="absolute bottom-0 translate-y-full left-1/2 -translate-x-24 md:hidden">
                            <BsArrowLeft className="text-white text-6xl opacity-90 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2 duration-300 drop-shadow-lg" />
                          </div>
                        ) : (
                          <div className="absolute bottom-0 translate-y-full left-1/2 translate-x-24 md:hidden">
                            <BsArrowRight className="text-white text-6xl opacity-90 group-hover:opacity-100 transition-all transform group-hover:translate-x-2 duration-300 drop-shadow-lg" />
                          </div>
                        )}
                        {isLeft ? (
                          <BsArrowLeft className="hidden md:block text-white text-6xl opacity-90 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2 duration-300 drop-shadow-lg" />
                        ) : (
                          <BsArrowRight className="hidden md:block text-white text-6xl opacity-90 group-hover:opacity-100 transition-all transform group-hover:translate-x-2 duration-300 drop-shadow-lg" />
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Mobile Navigation controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 md:hidden z-30">
                <button onClick={prevSlideCarousel} className="w-10 h-10 rounded-full bg-white/90 text-brand-navy flex items-center justify-center shadow-lg">
                  <BsArrowLeft />
                </button>
                <button onClick={nextSlideCarousel} className="w-10 h-10 rounded-full bg-white/90 text-brand-navy flex items-center justify-center shadow-lg">
                  <BsArrowRight />
                </button>
              </div>
            </div>

            {/* Room Details Section */}
            <div className="w-full max-w-[1200px] px-6 lg:px-0 mt-8">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeRoom?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row gap-8 md:gap-16 items-start lg:px-30"
                >
                  {/* Left: Price & Title */}
                  <div className="w-full md:w-1/3 flex flex-col">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-[#c23535] font-bold uppercase tracking-widest text-xs">Price from {formatPrice(activeRoom?.price)} Night</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl noto-geogia-font text-[#283862] font-bold leading-tight">
                      {activeRoom?.name}
                    </h3>
                  </div>

                  {/* Right: Amenities & Description */}
                  <div className="w-full md:w-2/3 flex flex-col gap-6">
                    {/* Icons */}
                    <div className="flex flex-row items-center gap-1 md:gap-8 border-b border-gray-100 pb-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <PiBed className="text-2xl" />
                        <span className="text-sm">{activeRoom?.amenities?.beds} beds</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <PiBathtub className="text-2xl" />
                        <span className="text-sm">{activeRoom?.amenities?.baths} Bathroom</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <PiArrowsOutSimple className="text-2xl" />
                        <span className="text-sm">{activeRoom?.amenities?.area} m2</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-[15px] leading-relaxed">
                      {activeRoom?.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <section className="py-30 px-6 lg:px-16 w-full overflow:hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
              <span className="text-[#c23535] text-xs font-bold tracking-[0.15em] uppercase">Amenities</span>
              <div className="w-8 md:w-12 h-[1px] bg-[#c23535]"></div>
            </div>
            <h2 className="text-4xl md:text-[3.5rem] noto-geogia-font text-white font-bold">Make Your Stay Memorable</h2>
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
                  <h4 className="text-white text-xl font-bold  ">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* <div className='before:absolute before:-top-[12px] before:left-5 before:w-[91%] md:before:w-[95%] lg:before:w-[97%] before:h-[13px] before:content-[""] before:bg-white/45 before:rounded-t-[8px]  after:left-5 after:w-[91%] md:after:w-[95%] lg:after:w-[97%] after:h-[13px] after:content-[""] after:bg-white/45 after:rounded-b-[8px] after:absolute after:top-auto  w-full relative'>
        <section className="bg-white py-20 lg:py-32 overflow-hidden   rounded-[10px]">
          
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-32 lg:mb-48">
            <div className="flex flex-col lg:flex-row items-center">
             
              <div className="w-full lg:w-[40%] relative mb-16 lg:mb-0">
               
                <span className="hidden lg:block absolute -left-12 top-10 -rotate-90 origin-top-left text-xs font-bold tracking-[0.3em] text-gray-300 uppercase">
                  Restaurant
                </span>

                <div className="relative mr-8 lg:mr-16">
                  <img
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop"
                    alt="Restaurant"
                    className="w-full h-[400px] lg:h-[550px] object-cover"
                  />
                  <div className="absolute -bottom-10 -right-4 z-0  lg:-right-12 border-[12px] border-[#f8f9fa]  w-[200px] lg:w-[300px] h-[150px] lg:h-[320px]">
                    <img
                      src="https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=2664&auto=format&fit=crop"
                      alt="Food"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
             

              <div className="w-full lg:w-[60%] bg-[#F8F9FA] mt-52 relative lg:-ml-12 z-10">
               
                <div className="bg-[#F8F9FA] pl-0 md:pl-10 pt-10 pb-10 lg:pl-16 lg:pt-16 lg:pb-16 relative">
                  
                  <span className="hidden lg:block absolute -left-0 top-1/2 -translate-y-1/2 -rotate-90 text-lg font-bold tracking-[0.3em] text-gray-300 uppercase">
                    Fresh Food
                  </span>
                  <div className='pl-5 md:pl-15'>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-[1px] bg-[#c23535]"></div>
                      <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Eat & Drink</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl noto-geogia-font text-[#283862] font-bold leading-tight mb-8">
                      Indulge in exceptional <br /> & Local Foodies
                    </h2>

                    <p className="text-gray-500 text-sm mb-10 font-medium tracking-wide">
                      Open Daily : 7.30 am - 11.00pm
                    </p>
                    <button className="bg-white hover:bg-[#c23535] hover:text-white border border-gray-200 text-[#283862] font-bold py-4 px-8 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 shadow-sm">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
            <div className="flex flex-col lg:flex-row-reverse items-center">
             
              <div className="w-full lg:w-1/2 relative mb-16 lg:mb-0">
                <div className="relative ml-8 lg:ml-16">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop"
                    alt="Spa"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                  />
                  <div className="absolute -bottom-10 -left-4 lg:-left-12 z-20 border-[8px] border-[#f8f9fa]  w-[200px] lg:w-[280px] h-[150px] lg:h-[200px]">
                    <img
                      src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2565&auto=format&fit=crop"
                      alt="Spa Products"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

             
              <div className="w-full lg:w-1/2 relative lg:-mr-12 z-10">
                <div className="bg-[#F8F9FA] p-10 lg:p-16">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-[1px] bg-[#c23535]"></div>
                    <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Wellness</span>
                  </div>

                  <h2 className="text-4xl lg:text-5xl noto-geogia-font text-[#283862] font-bold leading-tight mb-8">
                    A truly luxurious <br /> experience for <br /> the senses
                  </h2>

                  <p className="text-gray-500 text-sm font-medium tracking-wide leading-relaxed">
                    For special rates please contact the <br /> front office : +1800-456-7890
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div> */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Resort Coastal View"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay matching the dark navy brand color */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/80 to-brand-navy/60"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 lg:px-16 flex items-center justify-end">
          <div className="max-w-xl text-left md:text-left">
            {/* Label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[#c23535]"></div>
              <span className="text-white text-xs font-bold tracking-[0.25em] uppercase">Our Offer</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl md:text-[4rem] noto-geogia-font text-white font-bold mb-6 leading-tight">
              Summer Offer
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed mb-10 font-light">
              Benefit from a 10% discount, making your reservations with a minimum of 3 days in advance
            </p>

            {/* Button */}
            <button className="bg-[#c23535] text-white text-[11px] font-bold tracking-[0.2em] uppercase px-9 py-4 rounded-[2px] transition-colors shadow-lg">
              Find Out More
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12 md:py-14 lg:py-20 rounded-[10px] md:px-5">

        {/* ================= Testimonials ================= */}
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8 max-w-4xl ml-5 md:ml-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[2px] bg-[#c23535]" />
              <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">
                Testimonials
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-[3.5rem] noto-geogia-font text-[#283862] font-bold mb-6">
              What Our Customer Says
            </h2>

            <p className="text-gray-500 text-[15px] leading-relaxed max-w-3xl">
              Our objective at Bluebell is to bring together our visitor's societies and spirits with our own.
            </p>
          </div>

          {testimonialData && testimonialData.length > 0 ? (
            <div className="max-w-[1400px] mx-auto px-0 pt-10">

              {/* CAROUSEL WINDOW: This clips the side cards perfectly */}
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{
                    // Moves by 50% because each card is 50% width on desktop
                    transform: `translateX(-${testimonialIndex * 50}%)`,
                  }}
                >
                  {carouselTestimonials && carouselTestimonials.map((data) => (
                    <div
                      key={data._id}
                      className="w-full md:w-1/2 flex-shrink-0 px-4" // px-4 creates the gap between cards
                    >
                      {/* CARD: Ensure no 'border' class is present here */}
                      <div className="group bg-white rounded-[2.5rem] p-10 md:p-14 shadow-sm border border-solid border-[#ccc] hover:shadow-lg transition-all duration-500 flex flex-col relative overflow-hidden h-full ">

                        {/* Decorative Quote */}
                        <div className="absolute -top-6 -right-6 text-slate-50 text-9xl pointer-events-none group-hover:text-red-50 transition-colors">
                          <RiDoubleQuotesR />
                        </div>

                        <div className="relative z-10">
                          {/* Rating Section */}
                          <div className="flex justify-between items-start mb-8">
                            <div className="flex flex-col gap-3">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    className={`text-sm transition-all duration-500 ${star <= data.rating ? "text-[#c23535] scale-110" : "text-gray-200"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[#283862] text-[10px] font-black tracking-widest uppercase py-1 px-4 bg-slate-50 rounded-full w-fit">
                                Verified Guest
                              </span>
                            </div>
                            <div className="text-[#c23535] text-4xl opacity-20 group-hover:opacity-100 transition-opacity">
                              <RiDoubleQuotesR />
                            </div>
                          </div>

                          <p className="text-slate-500 text-lg leading-relaxed mb-10 italic font-medium">
                            "{data?.comment}"
                          </p>
                        </div>

                        {/* Reviewer Profile */}
                        <div className="flex items-center gap-4 relative z-10 pt-6 mt-auto">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <img
                              src="./image/housekeeping-1.avif"
                              alt="User"
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                          </div>
                          <div>
                            <h4 className="text-[#283862] font-black uppercase text-sm tracking-tight">
                              {data?.userId?.name}
                            </h4>
                            <p className="text-[#c23535] text-[10px] font-bold uppercase tracking-widest">
                              Executive Suite Guest
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls - Placed outside the overflow-hidden div */}
              <div className="flex justify-center items-center gap-6 mt-12">
                <button
                  onClick={() => setTestimonialIndex(prev => Math.max(0, prev - 1))}
                  disabled={testimonialIndex === 0}
                  className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-[#283862] hover:bg-[#283862] hover:text-white transition-all group shadow-xl shadow-slate-100 disabled:opacity-30"
                >
                  <IoIosArrowRoundBack size={30} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Progress Indicators */}
                {carouselTestimonials &&
                  <div className="flex gap-2">
                    {Array.from({ length: Math.ceil(carouselTestimonials.length / 2) }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${testimonialIndex === i ? 'w-8 bg-[#c23535]' : 'w-2 bg-slate-200'
                          }`}
                      />
                    ))}
                  </div>}
                {carouselTestimonials &&
                  <button
                    onClick={() => setTestimonialIndex(prev => (prev + 1) % (carouselTestimonials.length - 1))}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-[#283862] hover:bg-[#283862] hover:text-white transition-all group shadow-xl shadow-slate-100"
                  >
                    <IoIosArrowRoundForward size={30} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                }
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No reviews found</div>
          )}
        </div>


      </section>
    </main>
  );
}
