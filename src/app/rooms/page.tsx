"use client";

import React, { useState, useMemo } from 'react';
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
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2574&auto=format&fit=crop",
    price: 150,
    rating: 5,
    reviews: 5,
    description: "On this easy to moderate walking tour, you will discover selected sections of the ancient trails of...",
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
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2574&auto=format&fit=crop",
    price: 240,
    rating: 5,
    reviews: 5,
    description: "On this easy to moderate walking tour, you will discover selected sections of the ancient trails of...",
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
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop",
    price: 320,
    rating: 4,
    reviews: 12,
    description: "Enjoy a spacious family suite with modern amenities and a beautiful view of the surrounding nature.",
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
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2574&auto=format&fit=crop",
    price: 450,
    rating: 5,
    reviews: 8,
    description: "Wake up to the sound of the ocean in this premium terrace suite featuring a private balcony.",
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
    image: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=2574&auto=format&fit=crop",
    price: 180,
    rating: 4,
    reviews: 15,
    description: "Designed for productivity and comfort, featuring a dedicated workspace and high-speed internet.",
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
    image: "https://images.unsplash.com/photo-1512918760532-3ed465901861?q=80&w=2670&auto=format&fit=crop",
    price: 210,
    rating: 5,
    reviews: 22,
    description: "Escape to the mountains in this cozy classic room with a fireplace and stunning views.",
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
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2670&auto=format&fit=crop",
    price: 275,
    rating: 4,
    reviews: 9,
    description: "Modern loft style living in the heart of the city, perfect for couples or solo travelers.",
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
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2670&auto=format&fit=crop",
    price: 850,
    rating: 5,
    reviews: 3,
    description: "The ultimate luxury experience with a private butler, jacuzzi, and panoramic city views.",
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
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop",
    price: 380,
    rating: 5,
    reviews: 18,
    description: "Direct access to the resort gardens, creating a safe and fun environment for children.",
    size: 160,
    beds: [{ count: 2, type: "Queen Bed" }, {count: 1, type: "Single Bed"}],
    adults: 5,
    category: "Family",
    location: "Argentina",
    date: "2023-06-20"
  },
  {
    id: 10,
    name: "Berlin Terrace Penthouse",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop",
    price: 600,
    rating: 5,
    reviews: 7,
    description: "Enjoy private rooftop access and dining under the stars in this exclusive penthouse.",
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
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2657&auto=format&fit=crop",
    price: 130,
    rating: 3,
    reviews: 40,
    description: "A rustic yet comfortable cabin experience for those looking to disconnect.",
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
    image: "https://images.unsplash.com/photo-1522771753035-4a5042325b66?q=80&w=2574&auto=format&fit=crop",
    price: 220,
    rating: 4,
    reviews: 14,
    description: "Everything a business traveler needs, including meeting space access and concierge service.",
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

export default function RoomsGrid() {
  // --- STATE ---
  const [priceRange, setPriceRange] = useState(9900);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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

  const handleLocationChange = (location: string) => {
    setCurrentPage(1);
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location) 
        : [...prev, location]
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
    switch(sortBy) {
      case 'priceAsc': return 'Price: Low to High';
      case 'priceDesc': return 'Price: High to Low';
      default: return 'Date: Newest First';
    }
  };
  
  return (
    <div className="w-full pb-20 font-sans">
      {/* --- Page Header --- */}
      <div className="relative h-[350px] w-full bg-brand-navy flex flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2525&auto=format&fit=crop" 
             alt="Header Background" 
             className="w-full h-full object-cover"
           />
        </div>
        <div className="z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Rooms Grid</h1>
          <div className="flex items-center justify-center gap-3 text-sm font-bold tracking-widest uppercase text-gray-300">
            <span className="hover:text-brand-red cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span className="text-white">Rooms Grid</span>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-[1350px] mx-auto px-6 pt-20 bg-white rounded-[10px]">
        <div className="flex flex-col lg:flex-row gap-12 pb-20">
          
          {/* --- Sidebar --- */}
          <aside className="w-full lg:w-1/4 space-y-12">
            
            {/* Price Filter */}
            <div className="bg-white p-8 shadow-sm rounded-sm border border-gray-100">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-8 relative">
                Price
                <span className="absolute -bottom-2 left-0 w-10 h-[2px] bg-[#c23535]"></span>
              </h3>
              
              <div className="mb-6">
                <input 
                  type="range" 
                  min="0" 
                  max="9900" 
                  step="50"
                  value={priceRange} 
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c23535]"
                />
              </div>
              <div className="text-gray-500 font-medium">
                $0 - ${priceRange}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white p-8 shadow-sm rounded-sm border border-gray-100">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-8 relative">
                Category
                <span className="absolute -bottom-2 left-0 w-10 h-[2px] bg-[#c23535]"></span>
              </h3>
              
              <div className="space-y-4">
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

            {/* Location Filter */}
            <div className="bg-white p-8 shadow-sm rounded-sm border border-gray-100">
              <h3 className="text-2xl font-serif font-bold text-[#283862] mb-8 relative">
                Location
                <span className="absolute -bottom-2 left-0 w-10 h-[2px] bg-[#c23535]"></span>
              </h3>
              
              <div className="space-y-4">
                {locations.map((loc, idx) => {
                  const isChecked = selectedLocations.includes(loc);
                  return (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group select-none">
                      <div className={`relative w-5 h-5 border-2 rounded-[2px] flex items-center justify-center transition-colors group-hover:border-[#c23535] ${isChecked ? 'bg-[#c23535] border-[#c23535]' : 'border-[#c23535]'}`}>
                         <input 
                            type="checkbox" 
                            className="peer appearance-none absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            checked={isChecked}
                            onChange={() => handleLocationChange(loc)}
                         />
                         <FaCheck className={`text-white text-xs ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <span className={`transition-colors group-hover:text-[#c23535] ${isChecked ? 'text-[#c23535] font-semibold' : 'text-gray-500'}`}>{loc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* --- Grid Content --- */}
          <main className="w-full lg:w-3/4">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200 gap-4">
              <div className="text-[#283862] font-bold text-lg font-serif">
                {filteredAndSortedRooms.length} Rooms Available
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>Sort By</span>
                  <div className="relative">
                    <button 
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-sm bg-white hover:border-[#c23535] transition-colors min-w-[180px] justify-between"
                    >
                      {getSortLabel()} <FaChevronDown className="text-xs" />
                    </button>
                    {isSortOpen && (
                      <div className="absolute right-0 top-full mt-1 w-[180px] bg-white border border-gray-200 shadow-lg z-20 rounded-sm py-1">
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-600 hover:text-[#c23535]" onClick={() => handleSortChange('newest')}>Date: Newest First</div>
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-600 hover:text-[#c23535]" onClick={() => handleSortChange('priceAsc')}>Price: Low to High</div>
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-600 hover:text-[#c23535]" onClick={() => handleSortChange('priceDesc')}>Price: High to Low</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`w-10 h-10 flex items-center justify-center rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-[#c23535] text-white' : 'bg-white text-gray-500 border border-gray-300 hover:text-[#c23535]'}`}
                  >
                    <FaTh />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`w-10 h-10 flex items-center justify-center rounded-sm transition-colors ${viewMode === 'list' ? 'bg-[#c23535] text-white' : 'bg-white text-gray-500 border border-gray-300 hover:text-[#c23535]'}`}
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
                        <FaStar className="text-yellow-400" />
                        <span>({room.rating})</span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-0 right-0 bg-[#c23535] text-white px-4 py-2 font-bold font-serif text-lg">
                        ${room.price}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 ${viewMode === 'list' ? 'w-full md:w-3/5 flex flex-col justify-center' : ''}`}>
                      <h3 className="text-2xl font-serif font-bold text-[#283862] mb-3 group-hover:text-[#c23535] transition-colors cursor-pointer">
                        {room.name}
                      </h3>
                      
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {room.description}
                      </p>

                      <div className="flex flex-wrap gap-4 md:gap-6 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <PiArrowsOutSimple className="text-lg text-[#c23535]" />
                          <span>Size: {room.size} m²</span>
                        </div>
                        
                        {room.beds.map((bed, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <PiBed className="text-lg text-[#c23535]" />
                            <span>Beds: {bed.count} {bed.type}</span>
                          </div>
                        ))}

                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                          <PiUsers className="text-lg text-[#c23535]" />
                          <span>Adults: {room.adults} Adults</span>
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

