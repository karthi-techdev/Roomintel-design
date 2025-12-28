import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface RoomLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    photoIndex: number;
    setPhotoIndex: React.Dispatch<React.SetStateAction<number>>;
}

const RoomLightbox: React.FC<RoomLightboxProps> = ({ isOpen, onClose, images, photoIndex, setPhotoIndex }) => {
    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev + 1) % images.length);
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <button
                        onClick={onClose}
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
                        src={images[photoIndex]}
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
                        {photoIndex + 1} / {images.length}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RoomLightbox;
