import { Reviews } from '@/store/useReviewStore';
import { formatDate } from '@/utils/common';
import React from 'react';

interface RoomReviewProps {
    item : Reviews
}
const  RoomReview: React.FunctionComponent<RoomReviewProps> =({item})=> {
    const roomName = item?.bookingId?.room?.name;
    const {rating, comment,createdAt} = item;
    const userName  = item?.userId?.name

    return (
        <div className="w-full max-w-6xl mx-auto space-y-4  font-sans text-slate-900  ">
            {/* --- FULL WIDTH REVIEW CARD (Clean Style) --- */}
            <div className="w-full bg-white border-t border-slate-200 p-6 transition-all rounded-b-lg hover:shadow-md">

                {/* Rating and Title */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        {rating} <span>★</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#283862]">Worth every penny</h3>
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
                        <span className="text-[13px] font-bold text-[#283862]">{userName}</span>
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

            

        </div>
    );
}

export default RoomReview;