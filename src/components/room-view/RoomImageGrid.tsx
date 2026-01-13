import React from 'react';
// Rebuild trigger
import { getImageUrl } from '../../utils/getImage';

interface RoomImageGridProps {
    images: string[];
    onOpenLightbox: (index: number) => void;
}

const RoomImageGrid: React.FC<RoomImageGridProps> = ({ images, onOpenLightbox }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[600px] mb-12">
            {[...Array(5)].map((_, index) => {
                const img = images[index];
                const isMain = index === 0;

                return (
                    <div key={index}
                        className={`${isMain ? "md:col-span-2 md:row-span-2" : "hidden md:block"} relative group overflow-hidden rounded-sm ${!img ? 'bg-gray-200' : 'cursor-pointer'}`}
                        onClick={() => img && onOpenLightbox(index)}>

                        {img ? (
                            <>
                                <img src={getImageUrl(img)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Room Image ${index + 1}`} />
                                {index === 4 && (
                                    <div className="absolute inset-0 bg-[#283862]/60 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="bg-white text-[#283862] px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#c23535] hover:text-white transition-colors rounded-sm">See All Photos</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                {/* Optional: Add an icon or logo here if desired */}
                                <span className="text-xs uppercase tracking-widest font-bold opacity-50">AvensStay</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default RoomImageGrid;
