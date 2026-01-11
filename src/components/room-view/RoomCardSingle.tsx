import { Room } from '@/store/useRoomStore';
import { IND_CURRENCY } from '@/utils/constant';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaCalendarDay, FaTrash } from 'react-icons/fa';

interface RoomCartCardProps {
    selectedRoomByslug: Room | undefined;
    availableServices: any[];
    onUpdate?: (data: {
        room: number;
        adults: number;
        children: number;
        services: any[];
        totalPrice: number;
        serviceTotal: number;
        roomTotal: number;
        tax: number;
        serviceCharge: number;
        grandTotal: number;
    }) => void;
    checkIn?: string;     // ← NEW: from checkout page
    checkOut?: string;    // ← NEW: from checkout page
}

const RoomCartCard: React.FC<RoomCartCardProps> = ({ 
    selectedRoomByslug, 
    availableServices, 
    onUpdate,
    checkIn,
    checkOut 
}) => {
    const [adults, setAdults] = useState<number>(2);
    const [children, setChildren] = useState<number>(0);
    const [room, setRoom] = useState<number>(1);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [baseRoomPrice, setBaseRoomPrice] = useState<number>(0);

    const isInitialized = useRef(false);

    // Calculate number of nights
    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 1; // fallback

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(1, diffDays); // minimum 1 night
    }, [checkIn, checkOut]);

    useEffect(() => {
        if (selectedRoomByslug && !isInitialized.current) {
            const initialChildren = Number(selectedRoomByslug.baseChildren) || 0;
            setChildren(initialChildren);
            setAdults(Number(selectedRoomByslug.baseAdults) || 2);
            setRoom(1);
            setBaseRoomPrice(Number(selectedRoomByslug.price) || 0);
            isInitialized.current = true;
        }
    }, [selectedRoomByslug]);

    // Main price calculation
    const calculations = useMemo(() => {
        if (!selectedRoomByslug) {
            return {
                roomTotal: 0,
                serviceTotal: 0,
                tax: 0,
                serviceCharge: 0,
                grandTotal: 0,
                displayPrice: 0
            };
        }

        const basePricePerNight = Number(selectedRoomByslug.price) || 0;

        // Extra occupancy charges (per night, per room)
        const extraAdults = Math.max(0, adults - (selectedRoomByslug.baseAdults || 2)) * (selectedRoomByslug.extraAdultPrice || 0);
        const extraChildren = Math.max(0, children - (selectedRoomByslug.baseChildren || 0)) * (selectedRoomByslug.extraChildPrice || 0);
        const occupancyExtraPerNight = extraAdults + extraChildren;

        // Price per night per room
        const pricePerRoomPerNight = basePricePerNight + occupancyExtraPerNight;

        // Totals
        const roomSubTotal = pricePerRoomPerNight * nights * room; // ← KEY: × nights × rooms

        const serviceTotal = selectedServices.reduce((acc, cur) => acc + Number(cur.price || 0), 0);

        const tax = roomSubTotal * 0.10;
        const serviceCharge = roomSubTotal * 0.05;

        const grandTotal = roomSubTotal + serviceTotal + tax + serviceCharge;

        const displayPrice = roomSubTotal + serviceTotal; // what shows as "total for this room"

        return {
            roomTotal: roomSubTotal,
            serviceTotal,
            tax,
            serviceCharge,
            grandTotal,
            displayPrice
        };
    }, [
        selectedRoomByslug,
        adults,
        children,
        room,
        nights,
        selectedServices
    ]);
const roomTotal = calculations?.roomTotal ?? 0;
const serviceTotal = calculations?.serviceTotal ?? 0;
const tax = calculations?.tax ?? 0;
const serviceCharge = calculations?.serviceCharge ?? 0;
const grandTotal = calculations?.grandTotal ?? 0;
const displayPrice = calculations?.displayPrice ?? 0;

useEffect(() => {
    if (!onUpdate || !selectedRoomByslug) return;

    onUpdate({
        room,
        adults,
        children,
        services: selectedServices,
        totalPrice: displayPrice,
        roomTotal,
        serviceTotal,
        tax,
        serviceCharge,
        grandTotal
    });
}, [
    room,
    adults,
    children,
    selectedServices,
    displayPrice,
    roomTotal,
    serviceTotal,
    tax,
    serviceCharge,
    grandTotal,
    onUpdate,
    selectedRoomByslug
]);



    if (!selectedRoomByslug) {
        return <div>Loading room details...</div>;
    }

    const { name, maxAdults, maxChildren, maxRooms, extraAdultPrice, extraChildPrice, previewImage } = selectedRoomByslug;

    // Handlers
    const handleRoom = (type: 'inc' | 'dec') => {
        setRoom(prev =>
            type === 'inc'
                ? Math.min(prev + 1, maxRooms ?? 10)
                : Math.max(1, prev - 1)
        );
    };

    const handleAdults = (type: 'inc' | 'dec') => {
        setAdults(prev => {
            const limit = maxAdults || 20;
            if (type === 'inc') return prev < limit ? prev + 1 : prev;
            return prev > 1 ? prev - 1 : 1;
        });
    };

    const handleChildren = (type: 'inc' | 'dec') => {
        setChildren(prev => {
            const limit = maxChildren || 10;
            if (type === 'inc') return prev < limit ? prev + 1 : prev;
            return prev > 0 ? prev - 1 : 0;
        });
    };

    const toggleService = (service: any) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s._id === service._id);
            return exists
                ? prev.filter(s => s._id !== service._id)
                : [...prev, service];
        });
    };

    

    return (
        <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-[0.5rem] border border-[#ccc] overflow-hidden hover:shadow-xl transition-all duration-500 shadow-sm">
                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-4 py-1 bg-[#c23535]/10 text-[#c23535] text-[10px] font-black rounded-full uppercase tracking-widest">
                                    Room 01
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                    <FaCalendarDay className="text-[#c23535]" />
                                    {checkIn && checkOut
                                        ? `${new Date(checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')} - ${new Date(checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}`
                                        : 'Select dates'}
                                    {' '}
                                    <span className="text-[#c23535] font-bold">({nights} night{nights > 1 ? 's' : ''})</span>
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-[#283862] uppercase tracking-tighter">{name}</h2>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="w-full md:w-48 h-40 rounded-[0.5rem] overflow-hidden shrink-0 shadow-inner bg-slate-100">
                            <img
                                src={previewImage || "./image/housekeeping-1.avif"}
                                alt={name}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                               
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adults</label>
                                    <div className="flex items-center gap-4 bg-slate-50 w-fit px-3 py-1 rounded-[0.5rem] border border-slate-100">
                                        <button onClick={() => handleAdults('dec')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">-</button>
                                        <span className="font-black text-[#283862]">{adults}</span>
                                        <button onClick={() => handleAdults('inc')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">+</button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Children</label>
                                    <div className="flex items-center gap-4 bg-slate-50 w-fit px-3 py-1 rounded-[0.5rem] border border-slate-100">
                                        <button onClick={() => handleChildren('dec')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">-</button>
                                        <span className="font-black text-[#283862] w-4 text-center">{children}</span>
                                        <button onClick={() => handleChildren('inc')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">+</button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Room Service Extras</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableServices.map((item: any) => {
                                        const isSelected = selectedServices.some(s => s._id === item._id);
                                        return (
                                            <span
                                                key={item._id}
                                                onClick={() => toggleService(item)}
                                                className={`px-4 py-1.5 text-[0.7rem] font-bold rounded-full border cursor-pointer transition-all ${isSelected
                                                    ? 'bg-[#c23535] text-white border-[#c23535]'
                                                    : 'bg-[#fff] text-black border-[#efefef] hover:border-[#c23535]'
                                                    } shadow-md`}
                                            >
                                                {item.title} ({IND_CURRENCY}{item.price})
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-6 flex flex-col sm:flex-row justify-end items-end gap-4">
                        {/* <div className="text-slate-400 text-xs font-medium italic">
                            ({IND_CURRENCY}{baseRoomPrice.toFixed(2)} Base + extras) × {nights} night{nights > 1 ? 's' : ''} × {room} Room{room > 1 ? 's' : ''}
                        </div> */}
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total for this room</p>
                            <div className="text-3xl font-black text-[#283862] tracking-tighter">
                                {IND_CURRENCY}{displayPrice.toFixed(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomCartCard;