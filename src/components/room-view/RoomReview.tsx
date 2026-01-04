import { Reviews } from '@/store/useReviewStore';
import { formatDate } from '@/utils/common';
import React from 'react';

interface RoomReviewProps {
    item : Reviews
}
const  RoomReview: React.FunctionComponent<RoomReviewProps> =({item})=> {
    console.log('=========data',item)
    const roomName = item?.bookingId?.room?.name;
    const {rating, comment,createdAt} = item;
    const userName  = item?.userId?.name

    return (
        <div className="w-full max-w-6xl mx-auto space-y-4  font-sans text-slate-900">

            {/* --- RATING SUMMARY HEADER --- */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    {/* Main Average Score */}
                    <div className="text-center px-10 border-b md:border-b-0 md:border-r border-slate-100">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-5xl font-bold">4.8</span>
                            <span className="text-2xl text-amber-500">★</span>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">1,240 Ratings &</p>
                        <p className="text-slate-500 text-sm font-semibold">842 Reviews</p>
                    </div>

                    {/* Star Distribution Bars */}
                    <div className="flex-1 w-full max-w-sm space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-600 w-3">{star}★</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-600 rounded-full"
                                        style={{ width: `${star === 5 ? 85 : star === 4 ? 10 : 2}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                                    {star === 5 ? '852' : '102'}
                                </span>
                            </div>
                        ))}
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

            {/* --- FULL WIDTH REVIEW CARD (Clean Style) --- */}
            <div className="w-full bg-white rounded-xl border border-slate-200 p-6 transition-all hover:shadow-md">

                {/* Rating and Title */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        {rating} <span>★</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Worth every penny</h3>
                </div>

                {/* The Review Text */}
                <div className="text-[14px] leading-relaxed text-slate-700 mb-6 max-w-4xl">
                    <p className="mb-4">
                       {comment}
                    </p>
                    {/* <ul className="space-y-1 text-slate-500 font-medium">
                        <li className="flex gap-2"><span>+</span> Exceptional Room Service</li>
                        <li className="flex gap-2"><span>+</span> Fast Check-in process</li>
                    </ul> */}
                </div>

                {/* Footer: User Identity & Tags */}
                <div className="flex flex-wrap items-center justify-between pt-6 border-t border-slate-50 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[13px] font-bold text-slate-800">{userName}</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-4 h-4 bg-slate-200 rounded-full flex items-center justify-center text-[8px]">✓</span>
                            <span className="text-[11px] font-medium">Certified Buyer, {roomName}</span>
                        </div>
                        <span className="text-[11px] text-slate-300 ml-2">{formatDate(createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stayed in:</span>
                        <span className="bg-slate-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded border border-indigo-100 uppercase">
                            {roomName}
                        </span>
                    </div>
                </div>
            </div>

            {/* View All Reviews Button */}
            <button className="w-full py-4 text-indigo-600 font-bold text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                All 842 reviews →
            </button>

        </div>
    );
}

export default RoomReview;