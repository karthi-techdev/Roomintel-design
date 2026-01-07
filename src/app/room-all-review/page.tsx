"use client";

import Image from "next/image";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import image from "../../../public/blog-images/blog-image-4.avif";
import { useState, useEffect } from "react";
import { useRoomStore } from "@/store/useRoomStore";
import { useReviewStore, Reviews } from "@/store/useReviewStore";
import RoomReview from '@/components/room-view/RoomReview';
import RoomOverAllReview from '@/components/room-view/RoomOverAllReview';

export default function ReviewImage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const slug = searchParams.get('slug') || '';
  const { selectedRoom, fetchRoomBySlug } = useRoomStore();
  const { reviews, fetchReview } = useReviewStore();

  const getPrimaryImage = () => {
    if (selectedRoom) {
      if (selectedRoom.previewImage) return selectedRoom.previewImage;
      if (selectedRoom.images && selectedRoom.images.length) return selectedRoom.images[0];
    }
    return image;
  };

  useEffect(() => {
    if (slug) {
      fetchRoomBySlug(slug);
      fetchReview({ status: 'approved', slug }).then(() => {
        setCurrentPage(1);
      }).catch(() => {});
    }
  }, [slug, fetchRoomBySlug, fetchReview]);

  const roomReviews: Reviews[] = reviews
    ? reviews.filter(
        (r) => r?.bookingId?.room?.slug === slug || (selectedRoom && r?.bookingId?.room?._id === selectedRoom._id)
      )
    : [];

  const totalPages = Math.max(1, Math.ceil((roomReviews?.length || 0) / pageSize));

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPaginationNumbers = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      const mobilePages = [1, 2, 3];
      if (currentPage > 3 && currentPage < totalPages) {
        return [...mobilePages, currentPage, totalPages];
      }
      if (currentPage === totalPages && totalPages > 3) {
        return [1, 2, 3, totalPages];
      }
      return mobilePages;
    }
    
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const avgRating = roomReviews && roomReviews.length ? (roomReviews.reduce((s: number, r: Reviews) => s + (r.rating || 0), 0) / roomReviews.length) : 0;
  const currentReviews: Reviews[] = roomReviews ? roomReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  return (
    <section className="bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-4 mt-17">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-25">
                  <div className="p-6">
                    <div className="flex justify-center">
                      <Image
                        src={getPrimaryImage()}
                        alt={selectedRoom?.title || "Room Image"}
                        width={320}
                        height={400}
                        className="rounded-lg shadow-lg w-full h-[340px] object-cover"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                    </div>

                    <h2 className="mt-6 text-xl font-bold text-gray-900 text-start">
                      {selectedRoom?.title || "Room Details"}
                    </h2>

                    <div className="mt-3 flex items-start gap-3 justify-start flex-wrap">
                      <span className="rounded bg-green-600 px-3 py-1 text-sm font-bold text-white">
                        {avgRating.toFixed(1)} ★
                      </span>
                      <span className="text-sm text-gray-500">
                        {reviews ? `${reviews.length} Reviews` : "0 Reviews"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-start gap-3 justify-start flex-wrap">
                      <span className="text-2xl font-bold">{selectedRoom ? `₹${selectedRoom.price}` : '₹3,150'}</span>
                      <span className="text-lg text-gray-400 line-through">₹3500</span>
                      <span className="text-sm font-semibold text-green-600">10% off</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* Right: Reviews Section - Centered */}
              <div className="lg:col-span-8 mt-17">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 ">
                  <div className="flex items-center justify-between mb-8 p-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {selectedRoom?.title || "Room Details"}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-xl font-semibold">{avgRating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{reviews ? `${reviews.length} Ratings & Reviews` : "0 Ratings & Reviews"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Overall reviews only (no tabs) */}
                  <div className="mt-6">
                    <RoomOverAllReview reviews={roomReviews || []} />
                    {currentReviews && currentReviews.length > 0 ? (
                      <div className="mt-8 space-y-6">
                        {currentReviews.map((rev: Reviews) => (
                          <div key={rev._id} className=" rounded-lg hover:border-blue-200 transition-colors">
                            <RoomReview item={rev} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-8 text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  <div className="mt-10 pt-6 mb-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handlePrev}
                          disabled={currentPage === 1}
                          className="p-2  text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FaChevronLeft className="text-sm" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {getPaginationNumbers().map((pageNum, index) => {
                            const showEllipsisOnMobile = 
                              typeof window !== 'undefined' && 
                              window.innerWidth < 640 && 
                              pageNum === totalPages && 
                              currentPage > 4;
                            
                            return (
                              <div key={pageNum} className="flex items-center">
                                {showEllipsisOnMobile && index === 3 && (
                                  <span className="px-1 text-gray-400">•••</span>
                                )}
                                <button
                                  onClick={() => handlePageClick(pageNum)}
                                  className={`px-3 py-1.5 text-sm font-medium rounded-md min-w-[36px] ${
                                    currentPage === pageNum
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        
                        <button 
                          onClick={handleNext}
                          disabled={currentPage === totalPages}
                          className="p-2  text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FaChevronRight className="text-sm" />
                        </button>
                      </div>
                      
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}