"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import galleryService, { GalleryItem, GalleryCategory } from '../../api/galleryService';
import { getImageUrl } from '../../utils/getImage';

interface GalleryProps {
  onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onBack }) => {
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [galleryRes, categoryRes] = await Promise.all([
          galleryService.getGalleries(),
          galleryService.getCategories()
        ]);

        if (galleryRes.success) {
          setGalleries(galleryRes.data);
        }
        if (categoryRes.success) {
          const catNames = categoryRes.data.map((c: GalleryCategory) => c.name);
          setCategories(['All', ...catNames]);
        }
      } catch (err) {
        console.error("Error fetching gallery data:", err);
        setError("Failed to load gallery items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredImages = filter === 'All'
    ? galleries
    : galleries.filter(img => img.galleryCategory.name === filter);

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
    <div className=" w-full   pb-20 min-h-screen">

      {/* --- HEADER --- */}
      <div className="min-h-[250px]  sm:min-h-[300px] lg:min-h-[600px] flex items-center justify-center text-white text-center px-4 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-40">
          <img src="/image/gallery/background-image.webp" className="w-full h-full object-cover" alt="Header" />
        </div>

        {/* CENTER CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <h1 className="text-[22px] sm:text-[25px] md:text-[30px] lg:text-[60px] noto-geogia-font font-bold mb-4 drop-shadow-lg">
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#283862] border-t-brand-red rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Loading Gallery...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-brand-red font-bold">{error}</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-sm">
            No images found in this category.
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filteredImages.map((img, index) => (
                <motion.div
                  layout
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid relative group cursor-pointer rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={getImageUrl(img.image, '/image/placeholder.jpg')}
                    alt={img.name}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-[#283862]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      <FaPlus />
                    </div>
                    <h3 className="text-white noto-geogia-font text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{img.name}</h3>
                    <span className="text-gray-300 text-xs uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">{img.galleryCategory.name}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

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
                src={getImageUrl(filteredImages[lightboxIndex].image, '/image/placeholder.jpg')}
                alt={filteredImages[lightboxIndex].name}
                className="max-w-full max-h-[80vh] object-contain rounded-sm shadow-2xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white noto-geogia-font text-2xl">{filteredImages[lightboxIndex].name}</h3>
                <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">{filteredImages[lightboxIndex].galleryCategory.name}</p>
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
