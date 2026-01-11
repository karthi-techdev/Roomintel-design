"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Roombg from "../../../public/image/rooms-bg.jpg";
import { HiCursorArrowRays } from "react-icons/hi2";
import { TfiStar } from "react-icons/tfi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbNorthStar } from "react-icons/tb";
import { FaChevronRight, FaFilter, FaStar, FaTh, FaList, FaChevronDown, FaCheck, FaShareAlt, FaShare } from "react-icons/fa";
import { PiBed, PiUsers, PiArrowsOutSimple } from 'react-icons/pi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRoomStore, Room as StoreRoom } from '@/store/useRoomStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { siteService } from '@/api/siteService';
import { useReviewStore } from '@/store/useReviewStore';
import { calculateStatsByRoom } from '@/utils/common';
import { ArrowRight, BedDouble, Heart, Maximize, Search, ShoppingCart, Star, Users } from 'lucide-react';
import { IND_CURRENCY } from '@/utils/constant';
import ShareModal from '@/components/socialMedia/ShareModal';
import useMyWishListStore from '@/store/useMyWishListstore';
import { authService } from '@/api/authService';
import { Suspense } from 'react';
import RoomsGridContent from './RoomGridContent';
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
const sizes = [100, 150, 200, 250];
const bedsOptions = ["2 Beds", "1 Bed", "1 King Bed", "1 Double Bed",];
const adultsOptions = ["4 Adults", "3 Adults", "2 Adults", "1 Adult",];


export default function RoomsGrid() {
  const userId = authService.getCurrentUser();

  // --- STATE ---
  const { rooms: rawRooms, categories: rawCategories, loading: storeLoading, fetchRooms, fetchCategories } = useRoomStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [bedConfig, setBedConfig] = useState<{ _id?: string; key: string; value: string }[]>([]);
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { fetchReview, reviews } = useReviewStore();
  // Filters
  const [priceRange, setPriceRange] = useState(100000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
  const [selectedAdults, setSelectedAdults] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [roomSlug, setRoomSlug] = useState<string>('');
  const [currentOrigin, setCurrentOrigin] = useState("");
  const { addWishList, removeWishlist, fetchWishlists, wishlists } = useMyWishListStore();
  //Share social media
  useEffect(() => {
    fetchWishlistTrigger();
  }, [userId?._id,]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);


  function fetchWishlistTrigger() {
    if (userId?._id) {
      fetchWishlists({ userId: userId._id, isDeleted: true });
    }
  }

  // Initial Fetch
  useEffect(() => {
    fetchRooms();
    fetchCategories();
    fetchReview({ status: 'approved' })

    // Fetch bed configuration
    const fetchBedConfig = async () => {
      try {
        const res = await siteService.getConfigBySlug('bed-types');
        if (res && (res.status === true || res.success === true) && res.data) {
          setBedConfig(res.data.configFields || []);
        }
      } catch (e) {
        console.error("Failed to fetch bed config", e);
      }
    };
    fetchBedConfig();
  }, []);

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
          adults: r.adults,
          category: r.category?.name || "Uncategorized",
          location: r.locationName || "Unknown",
          date: r.createdAt || new Date().toISOString()
        };
      });
      setRooms(mappedRooms);
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      const matchesBeds = selectedBeds.length === 0 || selectedBeds.some(sel => {
        const totalBeds = room.beds.reduce((acc, b) => acc + b.count, 0);
        const bedTypes = room.beds.map(b => b.type.toLowerCase()).join(" ");

        if (sel === "2 Beds") return totalBeds === 2;
        if (sel === "1 Bed") return totalBeds === 1;
        if (sel === "1 King Bed") return totalBeds === 1 && bedTypes.includes("king");
        if (sel === "1 Double Bed") return totalBeds === 1 && bedTypes.includes("double");
        return false;
      });

      // Adults Filter
      const matchesAdults = selectedAdults.length === 0 || selectedAdults.some(sel => {
        const num = parseInt(sel);
        return room.adults >= num; // Change === to >=
      });

      return matchesPrice && matchesCategory && matchesLocation && matchesSize && matchesBeds && matchesAdults;
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
  }, [rooms, priceRange, selectedCategories, selectedLocations, selectedSizes, selectedBeds, selectedAdults, sortBy]);
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

  const handleShowShareModel = (slug: string) => {
    setIsShareOpen(true);
    setRoomSlug(slug);
  }

  const handleWishlist = async (roomId: string | number) => {

    if (!userId?._id) {
      useAuthStore.getState().openLoginModal();
      return;
    }

    const wishlistItem = wishlists.find(w => String(w.roomId._id) === String(roomId));

    try {
      if (wishlistItem) {
        await removeWishlist(wishlistItem._id);
      } else {
        await addWishList({
          userId: userId._id,
          roomId: String(roomId),
        });
      }
      fetchWishlistTrigger();
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  }

  const wishlistRoomIds = useMemo(() => {
    return new Set(
      wishlists.map(w => String(w.roomId._id))
    );
  }, [wishlists]);


  // export default function RoomsPage() {
    return (
      <div className="w-full pb-20  ">
        <Suspense fallback={<div>Loading rooms...</div>}>
          <RoomsGridContent />
        </Suspense>
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          shareUrl={`${currentOrigin}/rooms/${roomSlug}`}
        />
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
            <h1 className="noto-geogia-font font-bold underline text-[#ffffffba] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-5 md:mb-6 lg:mb-[30px]">
              Rooms Grid
            </h1>
            <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-[#ffffffba]">
              <Link href="/"><span className="hover:text-brand-red cursor-pointer transition-colors">Home</span></Link>
              <span>/</span>
              <span>Rooms Grid</span>
            </div>
          </div>
        </div>


        {/* --- Main Content --- */}
        <div className="max-w-[1550px] mx-auto px-4 lg:px-10 py-12 bg-[#f0f0f0] ">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* --- Sidebar --- */}



            <aside className="hidden lg:block lg:w-[25%] sticky top-28 h-fit space-y-10 bg-[#fff] p-5 rounded-[0.8rem]">

              {/* Price Filter */}
              <div className="bg-white">
                <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-4 relative">
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
                  {IND_CURRENCY}0 - {IND_CURRENCY}{priceRange}
                </div>
              </div>
              <span className='bg-[#00000033] flex h-[2px]'></span>

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
              <span className='bg-[#00000033] flex h-[2px]'></span>




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
              <span className='bg-[#00000033] flex h-[2px]'></span>

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
              <span className='bg-[#00000033] flex h-[2px]'></span>

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
                        max="9900"
                        step="50"
                        value={priceRange}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg lg:h-[14px] rounded-[5px] appearance-none cursor-pointer accent-[#c23535]"
                      />
                    </div>
                    <div className="text-gray-500 font-medium">
                      {IND_CURRENCY}0 - {IND_CURRENCY}{priceRange}
                    </div>
                  </div>
                  <span className='bg-[#00000033] mb-[10px] flex h-[2px]'></span>

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
                  <span className='bg-[#00000033] flex h-[2px]'></span>




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
                  <span className='bg-[#00000033] mt-[10px] flex h-[2px]'></span>

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
                  <span className='bg-[#00000033] mt-[10px] flex h-[2px]'></span>

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
            <main className="w-full lg:w-[75%] bg-[#fff] p-5 rounded-[0.8rem]">

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
              {currentRooms.length > 0 ? (
                <div className={`grid gap-10 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {currentRooms.map((room) => {
                    const roomId: string | number = room.id;
                    const overAllRating = calculateStatsByRoom(reviews, roomId);
                    const isFav = wishlists.length > 0 && wishlistRoomIds.has(String(room.id));
                    return (
                      <motion.div
                        key={room.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`group bg-white rounded-[0.8rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex ${viewMode === 'list' ? 'flex-col md:flex-row min-h-[320px]' : 'flex-col'
                          }`}
                      >
                        {/* --- IMAGE SECTION --- */}
                        <div
                          className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full md:w-[40%] h-72 md:h-auto' : 'h-72'
                            }`}
                        >
                          <Link href={`/room-view/${room.slug}`}>
                            <img
                              src={room.image}
                              alt={room.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </Link>

                          {/* Float Badges: Rating & Wishlist */}
                          <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                            <div className="bg-slate-900/80 backdrop-blur-md text-white py-1.5 px-4 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl">
                              {overAllRating?.avgRating === "0.0" ? (
                                <>
                                  <span className="text-indigo-400 text-sm">✨</span>
                                  <span>New Arrival</span>
                                </>
                              ) : (
                                <>
                                  <Star size={12} className="fill-amber-400 text-amber-400" />
                                  <span>{overAllRating?.avgRating} Rating</span>
                                </>
                              )}
                            </div>
                            <div className="absolute top-0 right-0 flex flex-col gap-3">
                              <button
                                onClick={() => handleWishlist(room.id)}
                                className="group p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white transition-all duration-300 shadow-lg border border-white/10"
                              >
                                <Heart
                                  size={20}
                                  className={`transition-all duration-300 
                                ${isFav
                                      ? 'fill-[#c23535] text-[#c23535]' // If Favorite: Red fill & Red border
                                      : 'fill-none text-white group-hover:text-[#c23535]' // Not Fav: White border, Red border on hover
                                    }`}
                                />
                              </button>
                              <button onClick={() => handleShowShareModel(room.slug)} className="flex items-center justify-center rounded-full h-[46px] w-[46px] p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 text-slate-600 hover:text-red-500 group">
                                <FaShare className="text-lg group-active:scale-90 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* --- CONTENT SECTION --- */}
                        <div className={`p-8 flex flex-col justify-between ${viewMode === 'list' ? 'w-full md:w-[60%]' : ''}`}>
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-4">
                              <Link href={`/room-view/${room.slug}`}>
                                <h3 className="text-xl font-black text-[#283862] leading-tight group-hover:text-[#c23535] transition-colors line-clamp-2 uppercase tracking-tight">
                                  {room.name}
                                </h3>
                              </Link>
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Starting At</span>
                                <span className="text-2xl font-black text-[#283862] tracking-tighter">{IND_CURRENCY}{room.price}</span>
                              </div>
                            </div>

                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                              {room.description}
                            </p>

                            {/* Amenities Display */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 py-5 border-y border-slate-200 mb-6">
                              <div className="flex items-center gap-2 text-slate-400 group/icon">
                                <Maximize size={16} className="text-[#c23535] transition-transform group-hover/icon:scale-110" />
                                <span className="text-[12px] font-bold font-black uppercase tracking-tighter text-slate-600">{room.size} m²</span>
                              </div>

                              {room.beds.map((bed, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-slate-400 group/icon">
                                  <BedDouble size={16} className="text-[#c23535] transition-transform group-hover/icon:scale-110" />
                                  <span className="text-[12px] font-bold font-black uppercase tracking-tighter text-slate-600">{bed.type}</span>
                                </div>
                              ))}

                              <div className="flex items-center gap-2 text-slate-400 group/icon">
                                <Users size={16} className="text-[#c23535] transition-transform group-hover/icon:scale-110" />
                                <span className="text-[12px] font-bold font-black uppercase tracking-tighter text-slate-600">{room.adults} Guests</span>
                              </div>
                            </div>
                          </div>

                          {/* --- ACTION BUTTONS --- */}
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                if (isLoggedIn) {
                                  router.push(`/room-view/${room.slug}`);
                                } else {
                                  useAuthStore.getState().openLoginModal();
                                }
                              }}
                              className="flex-[4] bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-[#c23535] transition-all duration-300 flex items-center justify-center gap-3 group/btn shadow-xl shadow-slate-200 uppercase text-[11px] tracking-[0.15em]"
                            >
                              Reserve Now
                              <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
                            </button>

                            {/* <button
                            className="flex-1 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors group/cart"
                            title="Add to wishlist"
                          >
                            <ShoppingCart size={20} className="group-hover/cart:scale-110 transition-transform" />
                          </button> */}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* --- EMPTY STATE --- */
                <div className="w-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Search size={40} className="text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">No Matches Found</h3>
                  <p className="text-slate-400 max-w-xs font-medium">We couldn't find any rooms matching your current filters. Try resetting them!</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-8 text-[#c23535] font-black text-sm uppercase tracking-widest border-b-2 border-[#c23535] pb-1 hover:text-slate-900 hover:border-slate-900 transition-all"
                  >
                    Clear All Filters
                  </button>
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
  }