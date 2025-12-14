"use client";
import React, { useState } from 'react';
import { 
  FaTrashAlt, 
  FaChevronLeft,
  FaMinus,
  FaPlus
} from 'react-icons/fa';

interface RoomCartProps {
  onBack: () => void;
  onCheckout: () => void;
}

export default function RoomCart() {
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(1);

  // Mock data
  const roomPrice = 6510;
  const total = roomPrice; // In a real app, this might depend on adults/children

  return (
    <section className="w-full font-sans pb-20 min-h-screen">
      {/* --- HEADER --- */}
      <div className="bg-[#283862] pt-32 pb-16 text-white text-center px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-30">
             <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
         </div>
         <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Room Cart</h1>
            <div className="flex justify-center items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300">
                <span className="hover:text-[#c23535] cursor-pointer transition-colors">Home</span>
                <span>/</span>
                <span className="text-white">Room Cart</span>
            </div>
         </div>
      </div>

      <div className="bg-white max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-20 rounded-[20px]">
        
        {/* --- DESKTOP TABLE VIEW --- */}
        <div className="hidden md:block bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden mb-8">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#283862] text-white uppercase tracking-wider font-bold">
                    <tr>
                        <th className="py-5 px-6 w-[30%]">Room</th>
                        <th className="py-5 px-6 text-center w-[20%]">Adults</th>
                        <th className="py-5 px-6 text-center w-[20%]">Children</th>
                        <th className="py-5 px-6 text-center w-[15%]">Date</th>
                        <th className="py-5 px-6 text-right w-[15%]">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                    {/* Cart Item Row */}
                    <tr>
                        <td className="py-6 px-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-12 rounded-sm overflow-hidden flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=200&auto=format&fit=crop" alt="Room" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-[#283862]">City Double or Twin Room</span>
                            </div>
                        </td>
                        <td className="py-6 px-6">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden w-24">
                                    <input 
                                        type="number" 
                                        value={adults}
                                        onChange={(e) => setAdults(Number(e.target.value))}
                                        className="w-full p-2 text-center text-[#283862] font-bold focus:outline-none"
                                    />
                                    <div className="flex flex-col border-l border-gray-300 bg-gray-50">
                                        <button onClick={() => setAdults(adults + 1)} className="px-2 py-[2px] hover:bg-gray-200 text-[10px]"><FaPlus /></button>
                                        <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-2 py-[2px] hover:bg-gray-200 text-[10px] border-t border-gray-300"><FaMinus /></button>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="py-6 px-6">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden w-24">
                                    <input 
                                        type="number" 
                                        value={childrenCount}
                                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                                        className="w-full p-2 text-center text-[#283862] font-bold focus:outline-none"
                                    />
                                    <div className="flex flex-col border-l border-gray-300 bg-gray-50">
                                        <button onClick={() => setChildrenCount(childrenCount + 1)} className="px-2 py-[2px] hover:bg-gray-200 text-[10px]"><FaPlus /></button>
                                        <button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="px-2 py-[2px] hover:bg-gray-200 text-[10px] border-t border-gray-300"><FaMinus /></button>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="py-6 px-6 text-center">
                            13 December 2025
                        </td>
                        <td className="py-6 px-6 text-right font-bold text-[#283862] text-lg">
                            ${total.toLocaleString()}
                        </td>
                    </tr>
                    
                    {/* Subtotal Row */}
                    <tr className="bg-[#FAFAFA]">
                        <td colSpan={4} className="py-4 px-6 text-right font-bold text-gray-500 uppercase tracking-wider text-xs border-r border-gray-100">
                            Subtotal
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-gray-700">
                            ${total.toLocaleString()}
                        </td>
                    </tr>

                    {/* Total Row */}
                    <tr className="bg-[#FAFAFA]">
                        <td colSpan={4} className="py-6 px-6 text-right font-bold text-[#283862] uppercase tracking-wider text-xs border-r border-gray-100">
                            Total
                        </td>
                        <td className="py-6 px-6 text-right font-bold text-[#EDA337] text-xl">
                            ${total.toLocaleString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* --- MOBILE CARD VIEW --- */}
        <div className="md:hidden space-y-6 mb-8">
            <div className="bg-white rounded-sm shadow-md border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#283862] p-4 text-white font-bold flex items-center justify-between">
                    <span>Cart Item</span>
                    <button className="text-gray-300 hover:text-white"><FaTrashAlt /></button>
                </div>
                
                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                        <div className="w-20 h-16 rounded-sm overflow-hidden flex-shrink-0">
                             <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=200&auto=format&fit=crop" alt="Room" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-[#283862] text-lg">City Double Room</span>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">13 December 2025</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase">Adults</label>
                             <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
                                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border-r border-gray-300"><FaMinus size={10} /></button>
                                <input type="number" value={adults} readOnly className="w-full p-2 text-center text-[#283862] font-bold focus:outline-none text-sm" />
                                <button onClick={() => setAdults(adults + 1)} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border-l border-gray-300"><FaPlus size={10} /></button>
                             </div>
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase">Children</label>
                             <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
                                <button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border-r border-gray-300"><FaMinus size={10} /></button>
                                <input type="number" value={childrenCount} readOnly className="w-full p-2 text-center text-[#283862] font-bold focus:outline-none text-sm" />
                                <button onClick={() => setChildrenCount(childrenCount + 1)} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border-l border-gray-300"><FaPlus size={10} /></button>
                             </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="font-bold text-[#283862] uppercase tracking-wider text-sm">Total</span>
                        <span className="font-bold text-[#EDA337] text-xl">${total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- ACTIONS FOOTER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#c23535] transition-colors font-bold text-sm uppercase tracking-wider group">
                <FaTrashAlt className="group-hover:scale-110 transition-transform" /> Delete Cart
            </button>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button className="px-8 py-4 bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold text-xs uppercase tracking-[0.15em] rounded-sm transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
                    Update Cart
                </button>
                <button 
                    className="px-8 py-4 bg-[#EDA337] hover:bg-[#d8922f] text-white font-bold text-xs uppercase tracking-[0.15em] rounded-sm transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                    Proceed To Checkout
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};

