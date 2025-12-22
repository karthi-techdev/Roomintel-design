"use client";

import React, { useState, useMemo } from 'react';
import Roombg from "../../../public/image/rooms-bg.jpg"
import { HiCursorArrowRays } from "react-icons/hi2";
import { TfiStar } from "react-icons/tfi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbNorthStar } from "react-icons/tb";
import { useEffect } from "react";



import { FaFilter } from "react-icons/fa";

import {
  FaStar,
  FaTh,
  FaList,
  FaChevronDown,
  FaCheck
} from 'react-icons/fa';
import {
  PiBed,
  PiUsers,
  PiArrowsOutSimple
} from 'react-icons/pi';
import { motion } from 'framer-motion';

// --- TYPES ---

interface Room {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  size: number;
  beds: { count: number; type: string }[];
  adults: number;
  category: string;
  location: string;
  date: string; // Added for sorting
}

// --- DATA ---

const roomsData: Room[] = [
  {
    id: 1,
    name: "City Double Or Twin Room",
    image: "/image/rooms/room-1.jpg",
    price: 150,
    rating: 5,
    reviews: 5,
    description: "Business, Family, Terrace",
    size: 100,
    beds: [{ count: 2, type: "Double Bed" }],
    adults: 3,
    category: "Luxury",
    location: "Australia",
    date: "2023-10-01"
  },
  {
    id: 2,
    name: "Superior Double Room",
    image: "/image/rooms/room-2.jpg",
    price: 240,
    rating: 5,
    reviews: 5,
    description: "Couple, Family, Luxury",
    size: 100,
    beds: [{ count: 1, type: "King Bed" }],
    adults: 2,
    category: "Couple",
    location: "Argentina",
    date: "2023-09-15"
  },
  {
    id: 3,
    name: "Classic Family Suite",
    image: "/image/rooms/room-3.jpg",
    price: 320,
    rating: 4,
    reviews: 12,
    description: "Family, Luxury, Terrace",
    size: 150,
    beds: [{ count: 2, type: "Queen Bed" }],
    adults: 4,
    category: "Family",
    location: "Australia",
    date: "2023-11-20"
  },
  {
    id: 4,
    name: "Ocean View Terrace",
    image: "/image/rooms/room-4.jpg",
    price: 450,
    rating: 5,
    reviews: 8,
    description: "Couple, Family, Luxury",
    size: 120,
    beds: [{ count: 1, type: "King Bed" }],
    adults: 2,
    category: "Terrace",
    location: "Australia",
    date: "2023-08-05"
  },
  {
    id: 5,
    name: "Business Executive Room",
    image: "/image/rooms/room-5.jpg",
    price: 180,
    rating: 4,
    reviews: 15,
    description: "Business, Classic, Couple, Luxury, Terrace",
    size: 85,
    beds: [{ count: 1, type: "Queen Bed" }],
    adults: 1,
    category: "Business",
    location: "United States",
    date: "2023-12-01"
  },
  {
    id: 6,
    name: "Mountain Retreat",
    image: "/image/rooms/room-6.jpg",
    price: 210,
    rating: 5,
    reviews: 22,
    description: "Business, Couple, Family",
    size: 95,
    beds: [{ count: 1, type: "King Bed" }],
    adults: 2,
    category: "Classic",
    location: "Canada",
    date: "2023-01-15"
  },
  {
    id: 7,
    name: "Urban Loft",
    image: "/image/rooms/room-7.avif",
    price: 275,
    rating: 4,
    reviews: 9,
    description: "Business, Family, Luxury",
    size: 110,
    beds: [{ count: 1, type: "Queen Bed" }],
    adults: 2,
    category: "Couple",
    location: "Germany",
    date: "2023-05-10"
  },
  {
    id: 8,
    name: "Grand Luxury Suite",
    image: "/image/rooms/room-8.webp",
    price: 850,
    rating: 5,
    reviews: 3,
    description: "Classic, Couple, Luxury, Terrace",
    size: 200,
    beds: [{ count: 1, type: "California King" }],
    adults: 2,
    category: "Luxury",
    location: "United States",
    date: "2023-12-25"
  },
  {
    id: 9,
    name: "Family Garden Villa",
    image: "/image/rooms/room-9.webp",
    price: 380,
    rating: 5,
    reviews: 18,
    description: "Business, Classic, Luxury",
    size: 160,
    beds: [{ count: 2, type: "Queen Bed" }, { count: 1, type: "Single Bed" }],
    adults: 5,
    category: "Family",
    location: "Argentina",
    date: "2023-06-20"
  },
  {
    id: 10,
    name: "Berlin Terrace Penthouse",
    image: "/image/rooms/room-10.avif",
    price: 600,
    rating: 5,
    reviews: 7,
    description: "Business, Classic, Family, Luxury",
    size: 140,
    beds: [{ count: 1, type: "King Bed" }],
    adults: 2,
    category: "Terrace",
    location: "Germany",
    date: "2023-09-01"
  },
  {
    id: 11,
    name: "Cozy Cabin",
    image: "/image/rooms/room-11.jpg",
    price: 130,
    rating: 3,
    reviews: 40,
    description: "Classic, Couple, Luxury, Terrace",
    size: 60,
    beds: [{ count: 1, type: "Double Bed" }],
    adults: 2,
    category: "Classic",
    location: "Canada",
    date: "2022-12-10"
  },
  {
    id: 12,
    name: "Corporate Suite",
    image: "/image/rooms/room-12.webp",
    price: 220,
    rating: 4,
    reviews: 14,
    description: "Business, Couple, Family, Terrace",
    size: 90,
    beds: [{ count: 1, type: "King Bed" }],
    adults: 1,
    category: "Business",
    location: "United States",
    date: "2023-10-15"
  }
];

const categories = ["Business", "Classic", "Couple", "Family", "Luxury", "Terrace"];
const locations = ["Argentina", "Australia", "Canada", "Germany", "United States"];
const sizes = [100, 150, 200, 250];
const bedsOptions = ["2 Beds", "1 Bed", "1 King Bed", "1 Double Bed",];
const adultsOptions = ["4 Adults", "3 Adults", "2 Adults", "1 Adult",];

export default function RoomsGrid() {
  // --- STATE ---
  const [priceRange, setPriceRange] = useState(9900);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
  const [selectedAdults, setSelectedAdults] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  // Sorting: 'newest', 'priceAsc', 'priceDesc'
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- HANDLERS ---

  const handleCategoryChange = (category: string) => {
    setCurrentPage(1); // Reset to page 1 on filter change
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeChange = (size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleBedsChange = (bed: string) => {
    setSelectedBeds(prev =>
      prev.includes(bed)
        ? prev.filter(b => b !== bed)
        : [...prev, bed]
    );
  };

  const handleAdultsChange = (adult: string) => {
    setSelectedAdults(prev =>
      prev.includes(adult)
        ? prev.filter(a => a !== adult)
        : [...prev, adult]
    );
  };



  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setPriceRange(Number(e.target.value));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsSortOpen(false);
    setCurrentPage(1);
  };

  // --- FILTER & SORT LOGIC ---

  const filteredAndSortedRooms = useMemo(() => {
    // 1. Filter
    let result = roomsData.filter(room => {
      // Price Filter
      const matchesPrice = room.price <= priceRange;

      // Category Filter
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(room.category);

      // Location Filter
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(room.location);

      return matchesPrice && matchesCategory && matchesLocation;
    });

    // 2. Sort
    result.sort((a, b) => {
      if (sortBy === 'priceAsc') {
        return a.price - b.price;
      } else if (sortBy === 'priceDesc') {
        return b.price - a.price;
      } else {
        // 'newest' based on date string
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [priceRange, selectedCategories, selectedLocations, sortBy]);

  // --- PAGINATION LOGIC ---

  const totalPages = Math.ceil(filteredAndSortedRooms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredAndSortedRooms.slice(indexOfFirstItem, indexOfLastItem);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'priceAsc': return 'Price: Low to High';
      case 'priceDesc': return 'Price: High to Low';
      default: return 'Date: Newest First';
    }
  };

  return (
    <div className="w-full pb-20 font-sans">
      {/* --- Page Header --- */}
      <div className="relative h-[300px] w-full bg-brand-navy flex flex-col text-white overflow-hidden">

        {/* Background Image Wrapper */}
        <div className="absolute inset-0 opacity-40 flex items-end">
          <div className="relative w-full h-[220px]">
            <img
              src={Roombg.src}
              alt="Header Background"
              className="w-full h-full object-cover [mask-image:linear-gradient(to_top,transparent,black_35%)] [-webkit-mask-image:linear-gradient(to_top,transparent,black_35%)]"
            />
          </div>
        </div>
      </div>

      <div className="h-[150px] sm:h-[150px] md:h-[260px] lg:h-[300px] flex justify-start items-center px-4 sm:px-6 md:px-10 lg:px-10">
        <div className="z-10">
          <h1 className="font-serif font-bold underline text-[#ffffffba] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-5 md:mb-6 lg:mb-[30px]">
            Rooms Grid
          </h1>
          <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-[#ffffffba]">
            <span className="hover:text-brand-red cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span>Rooms Grid</span>
          </div>
        </div>
      </div>


      {/* --- Main Content --- */}
      <div className="max-w-[1450px] p-6 mx-auto lg:pt-20 bg-white rounded-[10px]">
        <div className="flex flex-col lg:flex-row gap-12 pb-20">

          {/* --- Sidebar --- */}



          <aside className="hidden lg:block w-full lg:w-[15%] space-y-12">

            {/* Price Filter */}
            <div className="bg-white">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-4 relative">
                Price
              </h3>

              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="9900"
                  step="50"
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg lg:h-[14px] rounded-[5px] appearance-none cursor-pointer accent-[#c23535]"
                />
              </div>
              <div className="text-gray-500 font-medium">
                $0 - ${priceRange}
              </div>
            </div>
            <span className='bg-[#00000033] flex h-[2px]'></span>

            {/* Category Filter */}
            <div className="bg-white">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-8 relative">
                Category
              </h3>

              <div className="space-y-3">
                {categories.map((cat, idx) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group select-none">
                      <div className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center transition-colors group-hover:border-[#c23535] ${isChecked ? 'bg-[#c23535] border-brand-red' : 'border-[#c23535]'}`}>
                        <input
                          type="checkbox"
                          className="peer appearance-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleCategoryChange(cat)}
                        />
                        <FaCheck className={`text-white text-xs ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <span className={`transition-colors group-hover:text-brand-red ${isChecked ? 'text-brand-red font-semibold' : 'text-gray-500'}`}>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <span className='bg-[#00000033] flex h-[2px]'></span>




            <div className="bg-white ">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-4">
                Size
              </h3>

              <div className="space-y-3">
                {sizes.map((size, idx) => {
                  const isChecked = selectedSizes.includes(size);

                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer select-none"
                    >
                      <div
                        className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center
                ${isChecked ? "bg-[#c23535] border-[#c23535]" : "border-[#c23535]"}`}
                      >
                        <input
                          type="checkbox"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleSizeChange(size)}
                        />
                        {isChecked && <FaCheck className="text-white text-xs" />}
                      </div>

                      <span
                        className={`${isChecked ? "text-[#c23535] font-semibold" : "text-gray-500"
                          }`}
                      >
                        {size} M
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <span className='bg-[#00000033] flex h-[2px]'></span>

            <div className="bg-white">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-4">
                Beds
              </h3>

              <div className="space-y-4">
                {bedsOptions.map((bed, idx) => {
                  const isChecked = selectedBeds.includes(bed);

                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer select-none"
                    >
                      <div
                        className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center
                ${isChecked ? "bg-[#c23535] border-[#c23535]" : "border-[#c23535]"}`}
                      >
                        <input
                          type="checkbox"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleBedsChange(bed)}
                        />
                        {isChecked && <FaCheck className="text-white text-xs" />}
                      </div>

                      <span
                        className={`${isChecked ? "text-[#c23535] font-semibold" : "text-gray-500"
                          }`}
                      >
                        {bed}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <span className='bg-[#00000033] flex h-[2px]'></span>

            <div className="bg-white">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-4">
                Adults
              </h3>

              <div className="space-y-4">
                {adultsOptions.map((adult, idx) => {
                  const isChecked = selectedAdults.includes(adult);

                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer select-none"
                    >
                      <div
                        className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center
                ${isChecked ? "bg-[#c23535] border-[#c23535]" : "border-[#c23535]"}`}
                      >
                        <input
                          type="checkbox"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleAdultsChange(adult)}
                        />
                        {isChecked && <FaCheck className="text-white text-xs" />}
                      </div>

                      <span
                        className={`${isChecked ? "text-[#c23535] font-semibold" : "text-gray-500"
                          }`}
                      >
                        {adult}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* MOBILE FILTER POPUP */}
          
          {isFilterOpen && (

            <>
            
            
              {/* BACKDROP */}
              <div
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setIsFilterOpen(false)}
                
              />
              

              {/* POPUP */}
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                className="fixed top-[68px] right-0 h-[calc(100vh-68px)] w-[90%] max-w-[380px] bg-white z-50 overflow-y-auto p-6 space-y-12 lg:hidden"
              >
                {/* CLOSE HEADER */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif font-bold text-[#283862]">
                    Filter
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-white mb-3">
                  <h3 className="text-2xl font-serif font-bold text-[#283862] mb-2 relative">
                    Price
                  </h3>

                  <div className="mb-6">
                    <input
                      type="range"
                      min="0"
                      max="9900"
                      step="50"
                      value={priceRange}
                      onChange={handlePriceChange}
                      className="w-full h-2 bg-gray-200 rounded-lg lg:h-[14px] rounded-[5px] appearance-none cursor-pointer accent-[#c23535]"
                    />
                  </div>
                  <div className="text-gray-500 font-medium">
                    $0 - ${priceRange}
                  </div>
                </div>
                <span className='bg-[#00000033] mb-[10px] flex h-[2px]'></span>

                {/* Category Filter */}
                <div className="bg-white">
                  <h3 className="text-2xl font-serif font-bold text-[#283862] mb-8 relative">
                    Category
                  </h3>

                  <div className="space-y-3">
                    {categories.map((cat, idx) => {
                      const isChecked = selectedCategories.includes(cat);
                      return (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group select-none">
                          <div className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center transition-colors group-hover:border-[#c23535] ${isChecked ? 'bg-[#c23535] border-brand-red' : 'border-[#c23535]'}`}>
                            <input
                              type="checkbox"
                              className="peer appearance-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              checked={isChecked}
                              onChange={() => handleCategoryChange(cat)}
                            />
                            <FaCheck className={`text-white text-xs ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                          </div>
                          <span className={`transition-colors group-hover:text-brand-red ${isChecked ? 'text-brand-red font-semibold' : 'text-gray-500'}`}>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <span className='bg-[#00000033] flex h-[2px]'></span>




                <div className="bg-white ">
                  <h3 className="text-2xl font-serif font-bold text-[#283862] mb-2">
                    Size
                  </h3>

                  <div className="space-y-3">
                    {sizes.map((size, idx) => {
                      const isChecked = selectedSizes.includes(size);

                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <div
                            className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center
                ${isChecked ? "bg-[#c23535] border-[#c23535]" : "border-[#c23535]"}`}
                          >
                            <input
                              type="checkbox"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              checked={isChecked}
                              onChange={() => handleSizeChange(size)}
                            />
                            {isChecked && <FaCheck className="text-white text-xs" />}
                          </div>

                          <span
                            className={`${isChecked ? "text-[#c23535] font-semibold" : "text-gray-500"
                              }`}
                          >
                            {size} M
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <span className='bg-[#00000033] mt-[10px] flex h-[2px]'></span>

                <div className="bg-white">
                  <h3 className="text-2xl font-serif font-bold text-[#283862] mb-2">
                    Beds
                  </h3>

                  <div className="space-y-4">
                    {bedsOptions.map((bed, idx) => {
                      const isChecked = selectedBeds.includes(bed);

                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <div
                            className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center
                ${isChecked ? "bg-[#c23535] border-[#c23535]" : "border-[#c23535]"}`}
                          >
                            <input
                              type="checkbox"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              checked={isChecked}
                              onChange={() => handleBedsChange(bed)}
                            />
                            {isChecked && <FaCheck className="text-white text-xs" />}
                          </div>

                          <span
                            className={`${isChecked ? "text-[#c23535] font-semibold" : "text-gray-500"
                              }`}
                          >
                            {bed}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <span className='bg-[#00000033] mt-[10px] flex h-[2px]'></span>

                <div className="bg-white">
                  <h3 className="text-2xl font-serif font-bold text-[#283862] mb-2">
                    Adults
                  </h3>

                  <div className="space-y-4">
                    {adultsOptions.map((adult, idx) => {
                      const isChecked = selectedAdults.includes(adult);

                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <div
                            className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center
                ${isChecked ? "bg-[#c23535] border-[#c23535]" : "border-[#c23535]"}`}
                          >
                            <input
                              type="checkbox"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              checked={isChecked}
                              onChange={() => handleAdultsChange(adult)}
                            />
                            {isChecked && <FaCheck className="text-white text-xs" />}
                          </div>

                          <span
                            className={`${isChecked ? "text-[#c23535] font-semibold" : "text-gray-500"
                              }`}
                          >
                            {adult}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.aside>
            </>
          )}


          {/* --- Grid Content --- */}
          <main className="w-full lg:w-3/4">

            {/* Top Toolbar */}
            <div className="flex justify-between items-center gap-2 lg:hidden">
              {/* ROOMS COUNT – MOBILE */}
              <span className="text-[#283862] font-bold text-sm">
                {filteredAndSortedRooms.length} Rooms Available
              </span>

              {/* FILTER BUTTON */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 text-sm text-gray-500 
               border border-gray-300 px-3 py-2 
               rounded-sm hover:border-[#c23535]"
              >
                <FaFilter />
                Filter
              </button>
            </div>

            <div className="flex flex-col gap-4 mb-10 pb-6 border-b border-gray-200 md:flex-row md:items-center md:justify-between">

              <div className="hidden lg:block text-[#283862] font-bold text-lg text-center md:text-left">
                {filteredAndSortedRooms.length} Rooms Available
              </div>

              <div className="flex justify-between items-center gap-3 mt-5 overflow-x-auto whitespace-nowrap md:overflow-visible md:flex-row md:items-center md:gap-6">

                {/* SORT */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="whitespace-nowrap">Sort By</span>

                  <div className="relative">
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="flex items-center justify-between gap-2 border border-gray-300 px-3 py-2 rounded-sm bg-white hover:border-[#c23535] transition-colors w-full"
                    >
                      {getSortLabel()} <FaChevronDown className="text-xs" />
                    </button>

                    {isSortOpen && (
                      <div className="absolute left-0 top-full mt-1 w-[180px] bg-white border border-gray-200 shadow-lg z-20 rounded-sm py-1">
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer hover:text-[#c23535]" onClick={() => handleSortChange('newest')}>Date: Newest First</div>
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer hover:text-[#c23535]" onClick={() => handleSortChange('priceAsc')}>Price: Low to High</div>
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer hover:text-[#c23535]" onClick={() => handleSortChange('priceDesc')}>Price: High to Low</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* GRID / LIST */}
                <div className="flex gap-2 min-w-max">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-9 h-9 flex items-center justify-center rounded-sm transition-colors ${viewMode === 'grid'
                      ? 'bg-[#c23535] text-white'
                      : 'bg-white text-gray-500 border border-gray-300 hover:text-[#c23535]'
                      }`}
                  >
                    <FaTh />
                  </button>

                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-9 h-9 flex items-center justify-center rounded-sm transition-colors ${viewMode === 'list'
                      ? 'bg-[#c23535] text-white'
                      : 'bg-white text-gray-500 border border-gray-300 hover:text-[#c23535]'
                      }`}
                  >
                    <FaList />
                  </button>
                </div>

              </div>

            </div>


            {/* Room Cards Grid */}
            {currentRooms.length > 0 ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {currentRooms.map((room) => (
                  <motion.div
                    key={room.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white group rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                  >
                    {/* Image Section */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full md:w-2/5 h-64 md:h-auto' : 'h-64'}`}>
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Rating Badge */}
                      <div className="absolute top-4 left-4 bg-[#283862] text-white py-1 px-3 flex items-center gap-1 flex items-center justify-center text-xs font-bold shadow-lg z-10 rounded-[30px]">
                        <TfiStar className="text-yellow-400" />
                        <span>({room.rating})</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 ${viewMode === 'list' ? 'w-full md:w-3/5 flex flex-col justify-center' : ''}`}>
                      <div className='flex justify-between text-center'>
                        <h3 className="text-[12px] md:text-[14px] lg:text-[16px] font-serif font-bold text-[#283862] mb-3 group-hover:text-[#c23535] transition-colors cursor-pointer">
                          {room.name}
                        </h3>
                        <span>From $1.590</span>

                      </div>

                      <div className="mb-6">

                        {/* GRID VIEW PARAGRAPH */}
                        {viewMode === "grid" && (
                          <div className="flex gap-1 items-center">
                            <TbNorthStar />
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                              {room.description}
                            </p>
                          </div>
                        )}

                        {/* LIST VIEW PARAGRAPH */}
                        {viewMode === "list" && (
                          <div className="flex gap-2 items-start">
                            <p className="text-gray-600 text-[16px] leading-relaxed">
                              {room.description} — On this easy to moderate walking tour, you will discover selected sections of the ancient trails of Lycia, otherwise known as the Lycian Way, revealing the region’s ancient heritage and wild beauty.
                            </p>
                          </div>
                        )}



                      </div>

                      <div className='flex justify-between border-t-2 border-[#00000017] items-center'>

                        <div className="flex flex-wrap gap-[10px]  border-gray-100 pt-4">
                          <div className="flex gap-[5px] items-center">
                            <PiArrowsOutSimple className="text-[12px] text-[#c23535]" />
                            <span className='text-[10px]'>Size: {room.size} m²</span>
                          </div>

                          {room.beds.map((bed, idx) => (
                            <div key={idx} className="flex gap-[5px] items-center">
                              <PiBed className="text-[12px] text-[#c23535]" />
                              <span className='text-[10px]'>Beds: {bed.count} {bed.type}</span>
                            </div>
                          ))}

                          <div className="flex gap-[5px] items-center">
                            <PiUsers className="text-[12px] text-[#c23535]" />
                            <span className='text-[10px]'>Adults: {room.adults} Adults</span>
                          </div>
                        </div>
                        <div className="group flex  justify-center gap-[10px] bg-[#e1d8d869] mt-[10px] rounded-[5px] px-[8px] py-[3px] cursor-pointer transition-all duration-300 hover:bg-[#e1d8d8a5]">
                          <a href="" className="text-sm transition-colors duration-300 group-hover:text-[#c23535]">book</a>
                          <IoIosArrowRoundForward className="text-[20px] transition-transform duration-300 group-hover:translate-x-1" />
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full h-60 flex flex-col items-center justify-center text-gray-500">
                <p className="text-xl font-serif mb-2">No rooms found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center gap-2">
                {/* Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 flex items-center justify-center font-bold rounded-full transition-all duration-300 shadow-md
                        ${currentPage === page
                        ? 'bg-[#c23535] text-white scale-110'
                        : 'bg-white text-[#c23535] hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

