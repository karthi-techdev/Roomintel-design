"use client";

import Image from "next/image";
import { FaStar, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import image from "../../../public/blog-images/blog-image-4.avif"
import { useState } from "react";

const ratings = [
  { star: 5, count: 36252, color: "bg-green-600" },
  { star: 4, count: 8114, color: "bg-green-500" },
  { star: 3, count: 1461, color: "bg-green-400" },
  { star: 2, count: 639, color: "bg-yellow-400" },
  { star: 1, count: 2084, color: "bg-red-500" },
];

const tabContents = {
  overall: {
    title: "Luna Arc (Family Deluxe Bedroom)",
    rating: 4.6,
  },
  cleanliness: {
    title: "Cleanliness",
    rating: 4.8,
  },
  bedQuality: {
    title: "Bed Quality",
    rating: 4.2,
  },
  bathroom: {
    title: "Bathroom",
    rating: 4.9,
  },
  design: {
    title: "Design & Build",
    rating: 4.7,
  },
  view: {
    title: "View",
    rating: 4.8,
  }
};

const tabs = [
  { key: "overall", label: "Overall" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "bedQuality", label: "Bed Quality" },
  { key: "bathroom", label: "Bathroom" },
  { key: "design", label: "Design" },
  { key: "view", label: "View" }
];

export default function ReviewImage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentTab = searchParams.get('tab') || 'overall';
  const currentContent = tabContents[currentTab as keyof typeof tabContents] || tabContents.overall;

  const handleTabClick = (tabKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabKey);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 267;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

  return (
    <section className="bg-white">
      <div className="pt-4 sm:pt-8 md:pt-16 lg:pt-24 xl:pt-32">
        <div className="px-3 sm:px-4 md:px-6 lg:px-10 xl:px-15 py-4 sm:py-5 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            
            <div className="md:col-span-1 lg:col-span-3">
              <div className="flex justify-center md:justify-start">
                <Image
                  src={image}
                  alt="Samsung Galaxy S24"
                  width={280}
                  height={560}
                  className="rounded-lg shadow-lg w-full max-w-[280px] sm:max-w-[320px] md:max-w-[300px] lg:max-w-none"
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 300px, 300px"
                />
              </div>

              <h2 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl font-medium text-gray-800 text-center md:text-left">
                Luna Arc (Family Deluxe Bedroom)
              </h2>

              <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 justify-center md:justify-start flex-wrap">
                <span className="rounded bg-green-600 px-2 py-0.5 text-xs sm:text-sm font-bold text-white">
                  {currentContent.rating.toFixed(1)} ★
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  48,550 Ratings & 2,667 Reviews
                </span>
              </div>

              <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 justify-center md:justify-start flex-wrap">
                <span className="text-lg sm:text-xl font-bold">₹3,150</span>
                <span className="text-sm sm:text-base text-gray-400 line-through">₹3500</span>
                <span className="text-xs sm:text-sm font-semibold text-green-600">10% off</span>
              </div>
            </div>

            <div className="md:col-span-1 lg:col-span-8 md:mt-0 lg:mt-0">
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                  {currentContent.title}
                </h1>
              </div>

              <div className="mt-3 sm:mt-4 flex gap-1 sm:gap-2 md:gap-3 border-b text-xs sm:text-sm font-medium text-gray-600 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`pb-1.5 sm:pb-2 px-1 sm:px-1.5 md:px-2 whitespace-nowrap transition-colors flex-shrink-0 ${
                      currentTab === tab.key
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "hover:text-blue-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:mt-5 md:mt-6">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
                  {currentContent.rating.toFixed(1)} ★
                </div>
                
                <div className="mt-6 sm:mt-7 md:mt-8">
                  <h4 className="font-medium text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Rating Distribution</h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {ratings.map((r) => (
                      <div key={r.star} className="flex items-center gap-2 sm:gap-3">
                        <span className="w-6 sm:w-7 md:w-8 text-xs sm:text-sm">{r.star}★</span>
                        <div className="h-2 sm:h-2.5 md:h-3 w-full rounded bg-gray-200">
                          <div
                            className={`h-2 sm:h-2.5 md:h-3 rounded ${r.color}`}
                            style={{ width: `${(r.count / 40000) * 100}%` }}
                          />
                        </div>
                        <span className="w-10 sm:w-11 md:w-12 text-right text-xs sm:text-sm text-gray-500">
                          {r.count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t pt-3 sm:pt-4 md:pt-6">
                <div className="text-xs sm:text-sm text-gray-600 order-1 sm:order-none">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center gap-0.5 sm:gap-1 order-3 sm:order-none w-full sm:w-auto justify-center">
                  <button 
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="p-1 sm:p-1.5 md:p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="text-xs sm:text-xs md:text-xs" />
                  </button>
                  
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageClick(pageNum)}
                        className={`px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 text-xs sm:text-sm font-medium rounded sm:rounded-lg cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <span className="px-1 text-gray-500 hidden sm:inline">...</span>
                    {[6, 7, 8, 9, 10].map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageClick(pageNum)}
                        className={`px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 text-xs sm:text-sm font-medium rounded sm:rounded-lg cursor-pointer hidden sm:inline-block ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="p-1 sm:p-1.5 md:p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="text-xs sm:text-xs md:text-xs" />
                  </button>
                </div>
                
                <button 
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer order-2 sm:order-none"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}