"use client";

import { FaTimes, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { TbShare2 } from "react-icons/tb";
import { PiHeartBold } from "react-icons/pi";

const dummyWishlist = [
    {
        id: 1,
        name: "Ocean View Luxury Resort",
        location: "size:34m Double bed 2Adults",
        price: "₹12,500",
        rating: 4.8,
        status: "Available",
        image: "/image/gallery/image-2.jpg"

    },
    {
        id: 2,
        name: "Mountain Escape Resort",
        location: "size:34m Double bed 2Adults",
        price: "₹9,800",
        rating: 4.6,
        status: "Available",
        image:"/image/gallery/image-3.jpg",
    },
];

const MyWishlist = () => {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
            {/* Title */}
            <div className="mb-10">
                <div className="flex items-center gap-[15px] ">
            <h2 className="text-3xl font-bold text-[#283862] ">My Wishlist</h2>
            <span className="text-[27px] text-[#283862]"><PiHeartBold/></span>

                </div>
            <span className="text-[15px] text-[#0000007d] mb-10">Save your favorite resorts and rooms here. Compare, plan, and book them anytime.</span>
            </div>

            {/* Header */}
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-400 uppercase border-b border-black/20 pb-4 mb-4">
                <div className="col-span-6 text-center">Rooms</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right"></div>
            </div>

            {/* Wishlist Items */}
            <div className="space-y-6">
                {dummyWishlist.map((room) => (
                    <div
                        key={room.id}
                        className="grid grid-cols-12 gap-4 items-center border-b border-black/20 pb-6"
                    >
                        {/* Resort Info */}
                        <div className="col-span-6 flex items-center gap-4">
                            <button className="text-gray-400 text-[11px] hover:text-[#c23535]">
                                <FaTimes />
                            </button>

                            <img
                                src={room.image}
                                alt={room.name}
                                className="w-28 h-20 rounded-md object-cover"
                            />

                            <div>
                                <h3 className="font-bold text-[#283862] text-lg text-[15px]">
                                    {room.name}
                                </h3>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                    
                                    {room.location}
                                </p>
                                <div className="flex items-center gap-1 text-[12px] text-[#ffae1a] font-bold mt-1">
                                    <FaStar /> {room.rating}
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center font-bold text-[#283862] text-[15px]">
                            {room.price}
                        </div>

                        {/* Status */}
                        <div className="col-span-2 text-center text-sm font-bold text-green-600">
                            {room.status}
                        </div>

                        {/* Action */}
                        <div className="col-span-2 text-right">
                            <button className="bg-[#283862] text-[10px] text-white px-5 py-2 text-xs font-bold rounded hover:bg-[#c23535] transition">
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-8">
                <button className=" flex items-center gap-[5px] text-[12px] text-gray-500 hover:underline">
                    <TbShare2/>
                    Share this wishlist
                </button>

                <button className="bg-[#283862] text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800">
                    View All Resorts
                </button>
            </div>
        </div>
    );
};

export default MyWishlist;
