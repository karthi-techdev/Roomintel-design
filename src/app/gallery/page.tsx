"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';

interface GalleryProps {
  onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onBack }) => {
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Spaces', 'Activities', 'Pools', 'Restaurants', 'Spa'];

  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
      category: "Pools",
      title: "Infinity Pool View"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
      category: "Spaces",
      title: "Luxury Bedroom"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop",
      category: "Spaces",
      title: "Garden Villa Exterior"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
      category: "Pools",
      title: "Tropical Poolside"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop",
      category: "Spaa",
      title: "Relaxing Spa Treatment"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
      category: "Restaurants",
      title: "Fine Dining"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop",
      category: "Spaces",
      title: "Mountain Chalet"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
      category: "Activities",
      title: "Beachfront Relaxation"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
      category: "Restaurants",
      title: "Gourmet Experience"
    }
  ];

  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  // Lightbox Handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div className="bg-[#FAFAFA] w-full font-sans pb-20 min-h-screen">

      {/* --- HEADER --- */}
      <div className="bg-[#283862] min-h-[250px]  sm:min-h-[300px] lg:min-h-[600px] flex items-center justify-center text-white text-center px-4 relative overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 opacity-40">
    <img src="/image/gallery/background-image.webp" className="w-full h-full object-cover" alt="Header" />
  </div>

  {/* CENTER CONTENT */}
  <div className="relative z-10 flex flex-col items-center justify-center">
    <h1 className="text-[22px] sm:text-[25px] md:text-[30px] lg:text-[60px] font-serif font-bold mb-4 drop-shadow-lg">
      Gallery Grid
    </h1>

    <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
      <span className="hover:text-brand-red cursor-pointer transition-colors" onClick={onBack}>
        Home
      </span>
      <span>/</span>
      <span className="text-white">Gallery</span>
    </div>
  </div>
</div>



      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-20">

        {/* --- FILTER BUTTONS --- */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative px-6 py-3 text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm ${filter === cat
                  ? 'bg-[#283862] text-white shadow-lg transform -translate-y-1'
                  : 'bg-white text-gray-500 hover:text-[#283862] hover:bg-gray-50 border border-gray-100'
                }`}
            >
              {cat}
              {filter === cat && (
                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#283862]"></div>
              )}
            </button>
          ))}
        </div>

        {/* --- MASONRY GRID --- */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredImages.map((img, index) => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid relative group cursor-pointer rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#283862]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <FaPlus />
                  </div>
                  <h3 className="text-white font-serif text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{img.title}</h3>
                  <span className="text-gray-300 text-xs uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">{img.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors p-2"
              onClick={closeLightbox}
            >
              <FaTimes size={30} />
            </button>

            <button
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-brand-red transition-colors p-3 rounded-full bg-white/5 hover:bg-white/10"
              onClick={prevImage}
            >
              <FaChevronLeft size={24} />
            </button>

            <div className="max-w-5xl w-full max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].title}
                className="max-w-full max-h-[80vh] object-contain rounded-sm shadow-2xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white font-serif text-2xl">{filteredImages[lightboxIndex].title}</h3>
                <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">{filteredImages[lightboxIndex].category}</p>
              </div>
            </div>

            <button
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-brand-red transition-colors p-3 rounded-full bg-white/5 hover:bg-white/10"
              onClick={nextImage}
            >
              <FaChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-0 right-0 text-center text-white/30 text-xs font-bold tracking-widest pointer-events-none">
              {lightboxIndex + 1} of {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
