import { Room } from '@/store/useRoomStore';
import { IND_CURRENCY } from '@/utils/constant';
import React, { useEffect, useRef, useState } from 'react';
import { FaCalendarDay, FaTrash, FaStar } from 'react-icons/fa';
interface RoomCartCardProps {
    selectedRoomByslug: Room | undefined;
    availableServices: any;
    onUpdate?: (data:
        {
            room: number;
            adults: number;
            children: number;
            services: any[];
            totalPrice: number;
            serviceTotal: number;
            roomTotal: number;
            tax : number;
            serviceCharge : number;
            grandTotal : number;
        }) => void;
}
const RoomCartCard: React.FC<RoomCartCardProps> = ({ selectedRoomByslug, availableServices, onUpdate }) => {
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [room, setRoom] = useState<number>(1);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [baseRoomPrice, setBaseRoomPrice] = useState<number>(0);
    const [roomPrice, setRoomPrice] = useState<number>(0);
    const [roomTotalPrice, setRoomTotalPrice] = useState<number>(0);
    const [servicePrice, setServicePrice] = useState<number>(0);
    const [taxAmt, setTaxAmt] = useState<number>(0);
    const [serviceChargeAmt, setServiceChargeAmt] = useState<number>(0);
    const [finalTotal, setfinalTotal] = useState<number>(0);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (selectedRoomByslug && !isInitialized.current) {
            // baseChildren illana 0 nu set panrom
            const initialChildren = Number(selectedRoomByslug.baseChildren) || 0;
            setChildren(initialChildren);

            setAdults(Number(selectedRoomByslug.baseAdults) || 1);
            setRoom(1);
            setBaseRoomPrice(Number(selectedRoomByslug.price) || 0);
            isInitialized.current = true;
        }
    }, [selectedRoomByslug]);

    useEffect(() => {
        if (selectedRoomByslug && onUpdate) {
            onUpdate(
                { room, adults, children, services: selectedServices, totalPrice: roomPrice, serviceTotal: servicePrice, roomTotal: roomTotalPrice,tax : taxAmt,serviceCharge : serviceChargeAmt, grandTotal: finalTotal}
            );
        }
    }, [room, adults, children, selectedServices, roomPrice, servicePrice, roomTotalPrice, taxAmt, serviceChargeAmt, finalTotal,]);

    // Service by calc
    useEffect(() => {
        if (!selectedRoomByslug) return;

        // Room base price
        const roomBaseTotal = baseRoomPrice * room;

        // Extra adults
        const extraAdults =
            Math.max(0, adults - (selectedRoomByslug.baseAdults || 1)) *
            (selectedRoomByslug.extraAdultPrice || 0);

        // Extra children
        const extraChildren =
            Math.max(0, children - (selectedRoomByslug.baseChildren || 0)) *
            (selectedRoomByslug.extraChildPrice || 0);

        // Services
        const serviceTotal = selectedServices.reduce(
            (acc, cur) => acc + Number(cur.price || 0),
            0
        );

        // 1. Taxes (10% of Room Total)
        const taxAmount = roomBaseTotal * 0.10;

        // 2. Service Charge (5% of Room Total)
        const serviceChargeAmount = roomBaseTotal * 0.05;

        // 3. Grand Total (Room + Extras + Tax + Service Charge)
        const finalGrandTotal = roomBaseTotal + serviceTotal + taxAmount + serviceChargeAmount;

        const total = roomBaseTotal + extraAdults + extraChildren + serviceTotal;
        const servicePriceTotal = serviceTotal
        setRoomPrice(total);
        setServicePrice(servicePriceTotal);
        setRoomTotalPrice(roomBaseTotal);
        setTaxAmt(taxAmount);
        setServiceChargeAmt(serviceChargeAmount);
        setfinalTotal(finalGrandTotal);

    }, [room, adults, children, selectedServices, baseRoomPrice, selectedRoomByslug]);








    if (!selectedRoomByslug) {
        return <div>Loading room details...</div>;
    }

    const { name, baseAdults, baseChildren, maxAdults, maxChildren, maxRooms, extraAdultPrice, extraChildPrice, previewImage, price, size } = selectedRoomByslug;

    // HANDLER FUNCTIONS
    const handleRoom = (type: 'inc' | 'dec') => {
        setRoom(prev =>
            type === 'inc'
                ? Math.min(prev + 1, maxRooms ?? 10)
                : Math.max(1, prev - 1)
        );
    };

    const handleAdults = (type: 'inc' | 'dec') => {
        setAdults(prev => {
            if (type === 'inc') {
                const limit = (maxAdults && maxAdults > 0) ? maxAdults : 20;
                return prev < limit ? prev + 1 : prev;
            } else {
                return prev > 1 ? prev - 1 : 1; // Min 1 adult
            }
        });
    };

    const handleChildren = (type: 'inc' | 'dec') => {
        setChildren(prev => {
            if (type === 'inc') {
                const limit = (maxChildren && maxChildren > 0) ? maxChildren : 10;
                return prev < limit ? prev + 1 : prev;
            } else {
                return prev > 0 ? prev - 1 : 0; // Min 0 children
            }
        });
    };

    const toggleService = (servie: any) => {
        setSelectedServices((prev) => {
            const isExisting = prev.find(item => item._id === servie._id);
            if (isExisting) {
                return prev.filter(item => item._id !== servie._id);
            } else {
                return [...prev, servie]
            }
        })
    }


    console.log("Room Limits Check:", roomPrice);


    return (
        <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-[0.5rem] border border-[#ccc] overflow-hidden hover:shadow-xl transition-all duration-500 shadow-sm">
                <div className="p-6 sm:p-8">
                    {/* Header: Room Type & Actions */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-4 py-1 bg-[#c23535]/10 text-[#c23535] text-[10px] font-black rounded-full uppercase tracking-widest">
                                    Room 01
                                </span>
                                <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tight">
                                    <FaCalendarDay className="text-[#c23535]" />
                                    12/05/2026 - 15/05/2026
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-[#283862] uppercase tracking-tighter">{name}</h2>
                        </div>
                        {/* <button className="text-slate-300 hover:text-[#c23535] p-3 rounded-2xl hover:bg-red-50 transition-all group">
                            <FaTrash className="text-lg group-hover:scale-110 transition-transform" />
                        </button> */}
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        {/* Static Image */}
                        <div className="w-full md:w-48 h-40 rounded-[0.5rem] overflow-hidden shrink-0 shadow-inner bg-slate-100">
                            <img
                                src="./image/housekeeping-1.avif"
                                alt="Cozy Room"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>

                        <div className="flex-1 space-y-6">
                            {/* Static Selectors */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Rooms Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rooms</label>
                                    <div className="flex items-center gap-4 bg-slate-50 w-fit px-3 py-1 rounded-[0.5rem] border border-slate-100">
                                        <button onClick={() => handleRoom('dec')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">-</button>
                                        <span className="font-black text-[#283862]">{room}</span>
                                        <button onClick={() => handleRoom('inc')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">+</button>
                                    </div>
                                </div>

                                {/* Adults Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adults</label>
                                    <div className="flex items-center gap-4 bg-slate-50 w-fit px-3 py-1 rounded-[0.5rem] border border-slate-100">
                                        <button onClick={() => handleAdults('dec')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">-</button>
                                        <span className="font-black text-[#283862]">{adults}</span> {/* INGA 'adults' state use pannanum */}
                                        <button onClick={() => handleAdults('inc')} className="text-lg font-bold text-slate-400 hover:text-[#c23535]">+</button>
                                    </div>
                                </div>

                                {/* Children Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Children</label>
                                    <div className="flex items-center gap-4 bg-slate-50 w-fit px-3 py-1 rounded-[0.5rem] border border-slate-100">
                                        <button
                                            type="button" // Intha type mukkiyam
                                            onClick={() => handleChildren('dec')}
                                            className="text-lg font-bold text-slate-400 hover:text-[#c23535] px-2"
                                        >
                                            -
                                        </button>

                                        <span className="font-black text-[#283862] w-4 text-center">
                                            {children}
                                        </span>

                                        <button
                                            type="button" // Intha type mukkiyam
                                            onClick={() => handleChildren('inc')}
                                            className="text-lg font-bold text-slate-400 hover:text-[#c23535] px-2"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Static Extras */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Room Service Extras</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableServices.map((item: any) => {
                                        const isSelected = selectedServices.some(s => s._id === item._id);
                                        return (
                                            <span onClick={() => toggleService(item)} className={`px-4 py-1.5 text-[0.7rem] font-bold  rounded-full border  ${isSelected ? 'bg-[#c23535] text-white border-[#c23535]' : 'bg-[#fff] text-black border-[#efefef]'}   shadow-md shadow-gray-100`} key={item._id}>
                                                {item.title} ({IND_CURRENCY}{item.price})
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer: Pricing */}
                    <div className="border-t border-dashed border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-end gap-4">
                        <div className="text-slate-400 text-xs font-medium italic">
                            ({IND_CURRENCY}566.00 Base + {IND_CURRENCY}20.00 Occupancy) × 1 Room
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total for this room</p>
                            <div className="text-3xl font-black text-[#283862] tracking-tighter">
                                {IND_CURRENCY}{roomPrice}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomCartCard;