"use client";

import { useEffect } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { TbShare2 } from "react-icons/tb";
import { PiHeartBold } from "react-icons/pi";
import useMyWishListStore from '@/store/useMyWishListstore';
import { useAuthStore } from '@/store/useAuthStore';

const MyWishlist = () => {
    const { wishlists, removeWishlist, isLoading, error } = useMyWishListStore();
    const auth = useAuthStore();

    // Load auth once on mount, then fetch wishlist when user becomes available
    useEffect(() => {
        auth.loadFromStorage?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (auth.user && auth.user._id) {
          
        }
    }, [auth.user]);

    const handleRemove = async (id: string) => {
        await removeWishlist(id);
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
            <div className="mb-10">
                <div className="flex items-center gap-[15px] ">
                    <h2 className="text-3xl font-bold text-[#283862] ">My Wishlist</h2>
                    <span className="text-[27px] text-[#283862]"><PiHeartBold/></span>
                </div>
                <span className="text-[15px] text-[#0000007d] mb-10">Save your favorite resorts and rooms here. Compare, plan, and book them anytime.</span>
            </div>

            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase border-b border-black/20 pb-4 mb-4">
                <div className="col-span-6 text-center">Rooms</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right"></div>
            </div>

            <div className="space-y-6">
                {isLoading && <div className="text-center text-gray-500 py-6">Loading...</div>}

                {(() => {
                   

                    const listToRender = wishlists || [];
                    const showNoItems = !isLoading && listToRender.length === 0;

                    if (showNoItems) {
                        return <div className="text-center text-gray-500 py-6">No items in your wishlist.</div>;
                    }

                    return listToRender.map((item: any) => {
                        const room = item.room || item.roomId || {};
                        const image = room.previewImage || (room.images && room.images[0]) || '/image/gallery/image-2.jpg';
                        const name = room.name || room.title || 'Room';
                        const location = `${room.size || ''} ${room.beds || ''} ${room.adults ? `${room.adults} Adults` : ''}`.trim();
                        const price = room.price ? `₹${room.price}` : '-';
                        const status = room.status === 'active' ? 'Available' : 'Unavailable';

                        // wishlistId is the id of the wishlist entry (used for delete). Fall back to item._id or room._id
                        const wishlistId = item._id && (item._id.$oid || item._id) || null;
                        const keyId = wishlistId || (room && (room._id?.$oid || room._id)) || Math.random().toString(36).slice(2);

                        return (
                            <div key={keyId} className="grid grid-cols-12 gap-4 items-center border-b border-black/20 pb-6">
                                <div className="col-span-6 flex items-center gap-4">
                                    <button
                                        onClick={() => wishlistId ? handleRemove(wishlistId) : undefined}
                                        disabled={!wishlistId}
                                        className="text-gray-400 text-[11px] hover:text-[#c23535] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaTimes />
                                    </button>

                                    <img src={image} alt={name} className="w-28 h-20 rounded-md object-cover" />

                                    <div>
                                        <h3 className="font-bold text-[#283862] text-lg text-[15px]">{name}</h3>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">{location}</p>
                                        <div className="flex items-center gap-1 text-[12px] text-[#ffae1a] font-bold mt-1">
                                            <FaStar /> {room.rating || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 text-center font-bold text-[#283862] text-[15px]">{price}</div>

                                <div className="col-span-2 text-center text-sm font-bold text-green-600">{status}</div>

                                <div className="col-span-2 text-right">
                                    <button className="bg-[#283862] text-[10px] text-white px-5 py-2 text-xs font-bold rounded hover:bg-[#c23535] transition">ADD TO CART</button>
                                </div>
                            </div>
                        );
                    });
                })()}
            </div>

            <div className="flex justify-between items-center mt-8">
                <button className=" flex items-center gap-[5px] text-[12px] text-gray-500 hover:underline">
                    <TbShare2/>
                    Share this wishlist
                </button>

                <button className="bg-[#283862] text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800">View All Resorts</button>
            </div>
        </div>
    );
};

export default MyWishlist;
