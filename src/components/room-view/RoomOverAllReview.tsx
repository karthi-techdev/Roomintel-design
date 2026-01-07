import { Reviews } from '@/store/useReviewStore';
import { calculateStats } from '@/utils/common';
import React from 'react';

interface RoomOverAllReviewProps {
    reviews : Reviews[]
}

const  RoomOverAllReview : React.FC<RoomOverAllReviewProps>= ({reviews}) => {
    const {avgRating , total , distribution} = calculateStats(reviews);
    return (
        <div>
            {/* --- RATING SUMMARY HEADER --- */}
            <div className="bg-white   p-6 ">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    {/* Main Average Score */}
                    <div className="text-center px-10 border-b md:border-b-0 md:border-r border-slate-100">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-5xl font-bold">{avgRating}</span>
                            <span className="text-2xl text-amber-500">★</span>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">{total} Ratings & Reviews</p>
                        {/* <p className="text-slate-500 text-sm font-semibold">842 Reviews</p> */}
                    </div>

                    {/* Star Distribution Bars */}
                    <div className="flex-1 w-full max-w-sm space-y-2">
                        {distribution.map((item , index) => {
                            return(
                            <div className="flex items-center gap-4" key={index}>
                                <span className="text-xs font-bold text-slate-600 w-3">{item.star}★</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-600 rounded-full"
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                                    { item.count }
                                </span>
                            </div>
                        )})}
                    </div>

                    {/* Feature Highlights (Badges) */}
                    <div className="hidden lg:grid grid-cols-2 gap-4 border-l border-slate-100 pl-12">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2 text-blue-600">🏢</div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Location</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2 text-green-600">🧹</div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Cleaning</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomOverAllReview;