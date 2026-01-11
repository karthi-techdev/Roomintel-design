"use client";

import { useEffect } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { TbShare2 } from "react-icons/tb";
import { PiHeartBold } from "react-icons/pi";
import useMyWishListStore, { WishlistItem } from '@/store/useMyWishListstore';
import { BsArrowRight } from "react-icons/bs";
import { HiChevronDoubleRight } from "react-icons/hi2";
import Link from "next/link";
import { Maximize, Users } from "lucide-react";
import { IND_CURRENCY } from "@/utils/constant";
interface MyWishlistProps {
    data: WishlistItem[],
    handleRemove: (id: string) => void;
}
const MyWishlist: React.FC<MyWishlistProps> = ({ data, handleRemove }) => {

    return (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
            <div className="mb-10">
                <div className="flex items-center gap-[15px] ">
                    <h2 className="text-3xl font-bold text-[#283862] ">My Wishlist</h2>
                    <span className="text-[27px] text-[#283862]"><PiHeartBold /></span>
                </div>
                <span className="text-[15px] text-[#0000007d] mb-10">Save your favorite resorts and rooms here. Compare, plan, and book them anytime.</span>
            </div>
            {data && data.length > 0 ?
                <>
                    <div className="grid grid-cols-12 gap-4 items-center px-2 py-4 mb-2 bg-slate-50/50 rounded-xl border-b border-slate-200">
                        {/* Rooms Header - Left Aligned with the content */}
                        <div className="col-span-6">
                            <span className="text-[11px] font-black text-[#283862] uppercase tracking-[0.2em] ml-12">
                                Room Details
                            </span>
                        </div>

                        {/* Price Header - Center Aligned */}
                        <div className="col-span-3 text-center">
                            <span className="text-[11px] font-black text-[#283862] uppercase tracking-[0.2em]">
                                Base Price
                            </span>
                        </div>

                        {/* View Header - Right Aligned to match the button */}
                        <div className="col-span-3 text-right pr-6">
                            <span className="text-[11px] font-black text-[#283862] uppercase tracking-[0.2em]">
                                Action
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {data && data.map((item) => {
                            return (
                                <div key={item._id} className="grid grid-cols-12 gap-4 items-center border-b border-slate-200/60 py-6 last:border-0 hover:bg-slate-50/50 transition-colors px-2">

                                    {/* --- PRODUCT INFO (6 COLS) --- */}
                                    <div className="col-span-6 flex items-center gap-6">
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(item._id)}
                                            className="p-2 text-slate-300 hover:text-[#c23535] hover:bg-red-50 rounded-full transition-all duration-300"
                                            title="Remove from wishlist"
                                        >
                                            <FaTimes size={14} />
                                        </button>

                                        {/* Image with aspect ratio control */}
                                        <div className="relative shrink-0">
                                            <img
                                                src={item.roomId.previewImage}
                                                alt={item.roomId.name}
                                                className="w-32 h-20 rounded-xl object-cover shadow-sm border border-slate-100"
                                            />
                                        </div>

                                        {/* Text Details */}
                                        <div className="flex flex-col gap-1.5">
                                            <h3 className="font-black text-[#283862] text-[16px] uppercase tracking-tight leading-none">
                                                {item.roomId.name}
                                            </h3>

                                            <div className="flex items-center gap-4 mt-1">
                                                <div className="flex items-center gap-1.5 text-slate-500 group/icon">
                                                    <Maximize size={14} className="text-[#c23535]" />
                                                    <span className="text-[11px] font-bold uppercase tracking-tight">
                                                        {item?.roomId?.size} m²
                                                    </span>
                                                </div>

                                                <div className="h-3 w-[1px] bg-slate-200" /> {/* Divider */}

                                                <div className="flex items-center gap-1.5 text-slate-500 group/icon">
                                                    <Users size={14} className="text-[#c23535]" />
                                                    <span className="text-[11px] font-bold uppercase tracking-tight">
                                                        {item?.roomId?.adults} Guests
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- PRICE (3 COLS) --- */}
                                    <div className="col-span-3 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</span>
                                            <span className="font-black text-[#283862] text-[18px] tracking-tighter">
                                                {IND_CURRENCY}{item.roomId.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* --- ACTION (3 COLS) --- */}
                                    <div className="col-span-3 flex justify-end">
                                        <Link href={`/room-view/${item?.roomId?.slug}`}>
                                            <button className="group bg-[#283862] text-white px-6 py-3 text-[10px] font-black rounded-xl hover:bg-[#c23535] transition-all duration-300 flex items-center gap-2 uppercase tracking-[0.15em] shadow-md hover:shadow-[#c23535]/20">
                                                View Details
                                                <HiChevronDoubleRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
                :
                <div className="text-center text-gray-500 py-10">
                    <p className="text-lg font-medium">Your wishlist is empty ❤️</p>
                    <p className="text-sm mt-1">Add rooms to see them here</p>
                </div>
            }

            {data.length > 1 && <div className="flex justify-end items-center pt-8 border-t border-slate-200/60 ">
                {/* <button className=" flex items-center gap-[5px] text-[12px] text-gray-500 hover:underline">
                    <TbShare2 />
                    Share this wishlist
                </button> */}

                <Link href="/rooms">
                    <button className="group bg-[#283862] text-white px-6 py-3 text-[10px] font-black rounded-xl hover:bg-[#c23535] transition-all duration-300 flex items-center gap-2 uppercase tracking-[0.15em] shadow-md hover:shadow-[#c23535]/20">
                        View All Rooms
                        <HiChevronDoubleRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </Link>
            </div>}

        </div>

    );
};

export default MyWishlist;
