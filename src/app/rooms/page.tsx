"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Roombg from "../../../public/image/rooms-bg.jpg";
import { HiCursorArrowRays } from "react-icons/hi2";
import { TfiStar } from "react-icons/tfi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbNorthStar } from "react-icons/tb";
import { FaChevronRight, FaFilter, FaStar, FaTh, FaList, FaChevronDown, FaCheck } from "react-icons/fa";
import { PiBed, PiUsers, PiArrowsOutSimple } from 'react-icons/pi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRoomStore, Room as StoreRoom } from '@/store/useRoomStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { siteService } from '@/api/siteService';
import { useCurrency } from '@/hooks/useCurrency';
import { useReviewStore } from '@/store/useReviewStore';
// --- TYPES ---
interface Room {
  id: string | number;
  slug: string;
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
  date: string;
}

// --- CONSTANTS ---
const locations = ["Argentina", "Australia", "Canada", "Germany", "United States"];


export default function RoomsGrid() {
  // --- STATE ---
  const { rooms: rawRooms, categories: rawCategories, loading: storeLoading, fetchRooms, fetchCategories } = useRoomStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [bedConfig, setBedConfig] = useState<{ _id?: string; key: string; value: string }[]>([]);

  // Dynamic filter options
  const [sizes, setSizes] = useState<number[]>([]);
  const [bedsOptions, setBedsOptions] = useState<string[]>([]);
  const [adultsOptions, setAdultsOptions] = useState<string[]>([]);

  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { fetchReview ,reviews} = useReviewStore();
  console.log('=========reviews',reviews)
  // Filters
  const [maxPrice, setMaxPrice] = useState(10000); // Will be updated from rooms data
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
  const [selectedAdults, setSelectedAdults] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Currency
  const { formatPrice } = useCurrency();

  // Initial Fetch
  useEffect(() => {
    fetchRooms();
    fetchCategories();
    fetchReview({status : 'approved'})


    // Fetch bed configuration
    const fetchBedConfig = async () => {
      try {
        const res = await siteService.getConfigBySlug('bed-types');
        console.log('Bed config response:', res);
        if (res && (res.status === true || res.success === true) && res.data) {
          const bedFields = res.data.configFields || [];
          console.log('Bed fields:', bedFields);
          setBedConfig(bedFields);

          // Set bed options from config
          const bedLabels = bedFields
            .map((field: any) => field.value)
            .filter((value: string) => value && !value.toLowerCase().includes('unknown'));
          console.log('Bed labels for filter:', bedLabels);
          setBedsOptions(bedLabels);
        }
      } catch (e) {
        console.error("Failed to fetch bed config", e);
      }
    };
    fetchBedConfig();
  }, []);

  // Debug: Log filter options when they change
  useEffect(() => {
    console.log('Filter options updated:', {
      sizes,
      bedsOptions,
      adultsOptions
    });
  }, [sizes, bedsOptions, adultsOptions]);

  // Map Data from Store
  useEffect(() => {
    if (rawCategories) {
      setCategories(rawCategories.map((c: any) => c.name));
    }

    if (rawRooms) {
      const mappedRooms: Room[] = rawRooms.map((r: StoreRoom) => {
        // Convert bed IDs to labels
        let bedLabel = "Standard";
        if (r.beds && typeof r.beds === 'string' && bedConfig.length > 0) {
          const bedIds = r.beds.split(',').map(s => s.trim());
          const labels = bedIds.map(id => {
            const match = bedConfig.find((c: any) => c._id && c._id.toString() === id);
            return match ? match.value : id;
          });
          bedLabel = labels.join(', ');
        } else if (r.beds) {
          bedLabel = r.beds;
        }

        return {
          id: r._id,
          slug: r.slug,
          name: r.name || r.title,
          image: r.previewImage || (r.images && r.images[0]) || "/image/rooms/room-1.jpg",
          price: r.price || 0,
          rating: 5, // Mock data
          reviews: 0, // Mock data
          description: r.description,
          size: parseInt(r.size) || 100,
          beds: [{ count: 1, type: bedLabel }],
          adults: r.maxAdults || r.adults,
          category: r.category?.name || "Uncategorized",
          location: r.locationName || "Unknown",
          date: r.createdAt || new Date().toISOString()
        };
      });
      setRooms(mappedRooms);

      // Extract unique sizes from rooms (ascending order)
      const uniqueSizes = Array.from(new Set(mappedRooms.map(r => r.size)))
        .filter(size => size && size > 0)
        .sort((a, b) => a - b);
      console.log('Unique sizes:', uniqueSizes);
      setSizes(uniqueSizes);

      // Extract unique adults from rooms (ascending order, formatted)
      console.log('Raw rooms for adults:', rawRooms.map((r: any) => ({
        name: r.name,
        maxAdults: r.maxAdults,
        adults: r.adults
      })));

      const allMaxAdults = rawRooms.map((r: any) => r.maxAdults);
      console.log('All maxAdults values:', allMaxAdults);

      const uniqueAdultsNumbers = Array.from(new Set(allMaxAdults))
        .filter(adults => adults && adults > 0)
        .sort((a, b) => a - b);
      console.log('Unique adult numbers:', uniqueAdultsNumbers);

      const uniqueAdults = uniqueAdultsNumbers
        .map(adults => `${adults} Adult${adults > 1 ? 's' : ''}`);
      console.log('Unique adults options:', uniqueAdults);
      setAdultsOptions(uniqueAdults);

      // Calculate max price from rooms
      const prices = mappedRooms.map(r => r.price).filter(p => p > 0);
      if (prices.length > 0) {
        const calculatedMaxPrice = Math.max(...prices);
        console.log('Max price from rooms:', calculatedMaxPrice);
        setMaxPrice(calculatedMaxPrice);
        // Set initial price range to max price
        setPriceRange(calculatedMaxPrice);
      }
    }
  }, [rawRooms, rawCategories, storeLoading, bedConfig]);

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

  // Pagination removed - showing all rooms

  // Helper function to generate pastel colors based on room ID
  const getPastelColor = (id: string | number): string => {
    const pastelColors = [
      '#FFE5E5', // Pastel Pink
      '#E5F3FF', // Pastel Blue
      '#FFF5E5', // Pastel Peach
      '#E5FFE5', // Pastel Mint
      '#F5E5FF', // Pastel Lavender
      '#FFE5F5', // Pastel Rose
      '#E5FFFF', // Pastel Cyan
      '#FFFFE5', // Pastel Yellow
      '#FFE5D9', // Pastel Coral
      '#E5E5FF', // Pastel Periwinkle
    ];

    // Convert ID to a number for consistent color selection
    const idString = String(id);
    const hash = idString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return pastelColors[hash % pastelColors.length];
  };

  // --- HANDLERS ---

  const handleCategoryChange = (category: string) => {
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
    setPriceRange(Number(e.target.value));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsSortOpen(false);
  };

  // --- FILTER & SORT LOGIC ---

  const filteredAndSortedRooms = useMemo(() => {
    // 1. Filter
    let result = rooms.filter(room => {
      // Price Filter
      const matchesPrice = room.price <= priceRange;

      // Category Filter
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(room.category);

      // Location Filter
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(room.location);

      // Size Filter
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(room.size);

      // Beds Filter
      const matchesBeds = selectedBeds.length === 0 || selectedBeds.some(selectedBed => {
        // Check if any of the room's bed types match the selected bed type
        return room.beds.some(bed => {
          // Case-insensitive comparison
          return bed.type.toLowerCase().includes(selectedBed.toLowerCase()) ||
            selectedBed.toLowerCase().includes(bed.type.toLowerCase());
        });
      });

      return matchesPrice && matchesCategory && matchesLocation && matchesSize && matchesBeds;
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
  }, [rooms, priceRange, selectedCategories, selectedLocations, selectedSizes, selectedBeds, sortBy]);

  // --- SHOW ALL ROOMS (No Pagination) ---

  const getSortLabel = () => {
    switch (sortBy) {
      case 'priceAsc': return 'Price: Low to High';
      case 'priceDesc': return 'Price: High to Low';
      default: return 'Date: Newest First';
    }
  };

  return (
    <div className="w-full pb-20  ">
      {/* --- Page Header --- */}
      <div className="relative h-[600px] w-full bg-brand-navy flex items-center justify-center text-white text-center px-4 overflow-hidden mb-4">

        {/* Background Image */}
        <div className="absolute inset-0 opacity-40">
          <img
            src={Roombg.src}
            alt="Header Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* CENTER CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <h1 className="noto-geogia-font font-bold text-[#ffffffba] text-2xl sm:text-3xl md:text-4xl lg:text-[60px] mb-4 sm:mb-5 md:mb-6 lg:mb-[30px] drop-shadow-lg">
            Our Rooms
          </h1>

          <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-[#ffffffba]">
            <Link href="/">
              <span className="hover:text-brand-red cursor-pointer transition-colors">
                Home
              </span>
            </Link>
            <span>/</span>
            <span>Rooms</span>
          </div>
        </div>

      </div>





      {/* --- Main Content --- */}
      <div className="max-w-[1450px] p-6 mx-auto lg:pt-20 bg-white rounded-[10px]">
        <div className="flex flex-col justify-between px-10 lg:flex-row  pb-20">

          {/* --- Sidebar --- */}



          <aside className="hidden lg:block w-full lg:w-[20%] border border-[#0000002e] border border-[#00000014] px-[30px] py-[20px] space-y-12 sticky top-24 h-fit">

            {/* Price Filter */}
            <div className="bg-white">
              <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-4 relative">
                Price
              </h3>

              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="50"
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg lg:h-[14px] rounded-[5px] appearance-none cursor-pointer accent-[#c23535]"
                />
              </div>
              <div className="text-gray-500 font-medium">
                {formatPrice(0)} - {formatPrice(priceRange)}
              </div>
            </div>
            <span className='bg-[#0000001f] flex h-[1px]'></span>

            {/* Category Filter */}
            <div className="bg-white">
              <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-8 relative">
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
            <span className='bg-[#0000001f] flex h-[1px]'></span>




            <div className="bg-white ">
              <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-4">
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
            <span className='bg-[#0000001f] flex h-[1px]'></span>

            <div className="bg-white">
              <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-4">
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
            <span className='bg-[#0000001f] flex h-[1px]'></span>

            <div className="bg-white">
              <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-4">
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
                  <h3 className="text-2xl noto-geogia-font font-bold text-[#283862]">
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
                  <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-2 relative">
                    Price
                  </h3>

                  <div className="mb-6">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="50"
                      value={priceRange}
                      onChange={handlePriceChange}
                      className="w-full h-2 bg-gray-200 rounded-lg lg:h-[14px] rounded-[5px] appearance-none cursor-pointer accent-[#c23535]"
                    />
                  </div>
                  <div className="text-gray-500 font-medium">
                    {formatPrice(0)} - {formatPrice(priceRange)}
                  </div>
                </div>
                <span className='bg-[#0000001f] mb-[10px] flex h-[2px]'></span>

                {/* Category Filter */}
                <div className="bg-white">
                  <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-8 relative">
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
                <span className='bg-[#0000001f] flex h-[1px]'></span>




                <div className="bg-white ">
                  <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-2">
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
                <span className='bg-[#0000001f] mt-[10px] flex h-[2px]'></span>

                <div className="bg-white">
                  <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-2">
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
                <span className='bg-[#0000001f] mt-[10px] flex h-[2px]'></span>

                <div className="bg-white">
                  <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-2">
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

              <div className="flex justify-between items-center gap-3 mt-5 whitespace-nowrap md:flex-row md:items-center md:gap-6">

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
                <div className="flex gap-2 min-w-max md:flex hidden">
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
            {filteredAndSortedRooms.length > 0 ? (
              <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {filteredAndSortedRooms.map((room) => (
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
                    <div
                      className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full md:w-2/5 h-64 md:h-auto' : 'h-64'}`}
                      style={{ backgroundColor: getPastelColor(room.id) }}
                    >
                      <Link href={`/room-view/${room.slug}`}>
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                          onError={(e) => {
                            // Hide the broken image icon
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </Link>

                      {/* Rating Badge */}
                      <div className="absolute top-4 left-4 bg-[#283862] text-white py-1 px-3 flex items-center gap-1 flex items-center justify-center text-xs font-bold shadow-lg z-10 rounded-[30px]">
                        <TfiStar className="text-yellow-400" />
                        <span>({room.rating})</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 ${viewMode === 'list' ? 'w-full md:w-3/5 flex flex-col justify-center' : ''}`}>
                      <div className='flex justify-between text-center'>
                        <Link href={`/room-view/${room.slug}`}>
                          <h3 className="text-[12px] md:text-[14px] lg:text-[16px] noto-geogia-font font-bold text-[#283862] mb-3 group-hover:text-[#c23535] transition-colors cursor-pointer">
                            {room.name}
                          </h3>
                        </Link>
                        <span>From {formatPrice(room.price)}</span>

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

                          {room.beds
                            .filter((bed) => bed.type && !bed.type.toLowerCase().includes('unknown'))
                            .map((bed, idx) => (
                              console.log('bed', bed),
                              <div key={idx} className="flex gap-[5px] items-center">
                                <PiBed className="text-[12px] text-[#c23535]" />
                                <span className='text-[10px]'>Beds:{bed.type}</span>
                              </div>
                            ))}

                        </div>
                        <div className="group flex justify-center gap-[10px] bg-[#e1d8d869] mt-[10px] rounded-[5px] px-[10px] py-[6px] cursor-pointer transition-all duration-300 hover:bg-[#e1d8d8a5]">
                          <button
                            onClick={() => {
                              if (isLoggedIn) {
                                router.push(`/room-view/${room.slug}`);
                              } else {
                                useAuthStore.getState().openLoginModal();
                              }
                            }}
                            className="px-6 py-3 bg-[#c23535] text-white font-bold uppercase text-xs rounded-lg hover:bg-[#a82d2d] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            Book Now
                          </button>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full h-60 flex flex-col items-center justify-center text-gray-500">
                <p className="text-xl noto-geogia-font mb-2">No rooms found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination removed - showing all rooms */}

          </main>
        </div>
      </div>
    </div>
  );
};

