"use client";
import React from 'react';
import { FaCheck, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import swimmmingpool from "../../../public/image/swimming-pool1.jpg"
import resortinterior from "../../../public/image/resort-interior.jpg"
import resort from "../../../public/image/resort-image.jpg"
import diningarea from "../../../public/image/dining-area.jpg"

import housekeeping1 from "../../../public/image/housekeeping-1.avif"
import housekeeping2 from "../../../public/image/housekeeping-2.jpg"
import housekeeping3 from "../../../public/image/housekeeping-3.avif"
import housekeeping4 from "../../../public/image/housekeeping-4.jpg"


interface AboutUsProps {
    onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
    const features = [
        "Spa/gym",
        "Shopping",
        "Sightseeing",
        "Facials/makeup",
        "Night Bonefire",
        "Meditation",
        "Trekking",
        "Elephant safari",
        "Live music band"
    ];

    const staffMembers = [
        {
            id: 1,
            name: "Dona Mona",
            role: "HOUSE KEEPING",
            image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=2680&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Desulva Merry",
            role: "HOUSE KEEPING",
            image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=2687&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "John Michale",
            role: "HOUSE KEEPING",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
        },
        {
            id: 4,
            name: "Marry Desalwa",
            role: "HOUSE KEEPING",
            image: "https://images.unsplash.com/photo-1581050777502-c8a115d64b53?q=80&w=2670&auto=format&fit=crop"
        }
    ];

    const stats = [
        { value: "250+", label: "Booking Month" },
        { value: "30+", label: "Visitors daily" },
        { value: "98%", label: "Positive feedback" },
        { value: "20+", label: "Awards & honors" }
    ];

    return (
        <section className="w-full font-sans pb-20 min-h-screen">

            {/* --- HEADER --- */}
            <div className="bg-[#283862] h-[450px] sm:h-[500px] md:h-[600px] lg:h-[800px] text-white px-4 relative overflow-hidden">

                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
                </div>

                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-3 md:mb-4 drop-shadow-lg">
                        About
                    </h1>

                    <div className="flex justify-center items-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={onBack}>Home</span>
                        <span>/</span>
                        <span className="text-white">About</span>
                    </div>
                </div>

            </div>


            <div className='lg:px-20 lg:py-5'>


                <div className='bg-white w-full max-w-[full]  rounded-[20px]'>
                    <div className=" md:space-y-32">

                        {/* --- WELCOME SECTION --- */}
                        <div className="flex flex-col lg:flex-row items-center lg:px-30 lg:pt-30 gap-5 pb-0 lg:gap-20">
                            <div className="lg:w-[60%] p-5 mt-4 flx-[1.5] space-y-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-[2px] bg-[#c23535]"></div>
                                    <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Welcome to Bluebell</span>
                                </div>

                                <h2 className="text-[20px] md:text-[28px] lg:text-[38px] font-serif text-[#283862] font-bold leading-tight">
                                    Our Resort has been present for over 20 years.
                                </h2>

                                <p className="text-[#283862] font-serif italic text-[18px] md:text-[20px] lg:text-[25px]  font-medium">
                                    We make the best or all our customers.
                                </p>

                                <p className="text-gray-500 text-[10px] md:text-[12px] lg:text-[16px] leading-relaxed">
                                    Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality. Delightful herbs and flavors consolidate surfaces to pacify wide based palates.
                                </p>

                                <p className="text-gray-500 text-[10px] md:text-[12px] lg:text-[16px] leading-relaxed">
                                    Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality.
                                </p>

                                <div className="flex items-center gap-8 pt-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                                            alt="Manager"
                                            className="w-14 h-14 rounded-full object-cover border-2 border-[#c23535] p-0.5"
                                        />
                                        <div>
                                            <h4 className="text-[#283862] font-bold text-[10px] md:text-[17px] lg:text-[20px]">Kahey Kemey</h4>

                                            <span className="text-[#c23535] text-[10px] md:text-[17px] lg:text-[20px] font-bold uppercase tracking-wider">Resort Manager</span>
                                        </div>
                                    </div>
                                    {/* Signature placeholder */}

                                    <span className="text-[10px] md:text-[25px] lg:text-[40px]">
                                        Kathy A. Xemn
                                    </span>

                                </div>
                            </div>

                            <div className="lg:w-[40%] p-5 relative ">
                                <div className="relative rounded-sm overflow-hidden h-[400px] lg:h-[600px] w-full shadow-xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
                                        alt="Resort View"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- WHY CHOOSE US --- */}
                        <div>
                            <div className="text-center mb-16">
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="w-12 h-[2px] bg-[#c23535]"></div>
                                    <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Our Features</span>
                                    <div className="w-12 h-[2px] bg-[#c23535]"></div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif text-[#283862] font-bold">Why Choose Us</h2>
                                <p className="text-gray-500 text-sm mt-6 max-w-2xl mx-auto leading-relaxed">
                                    Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly.
                                </p>
                            </div>

                            <div className="flex flex-col gap-10 p-4 lg:h-[550px] sm:p-6 lg:p-10 lg:flex-row lg:gap-20">

                                {/* LEFT IMAGE SECTION */}
                                <div className="w-full lg:w-1/2 relative flex justify-center lg:block">

                                    {/* Big Image */}
                                    <div className="relative w-full h-[220px] sm:h-[280px] md:h-[350px] lg:h-[400px]">
                                        <img
                                            src={swimmmingpool.src}
                                            className="w-full h-full mg:lg-[30px] lg:h-[300px]  object-cover rounded-lg"
                                            alt=""
                                        />
                                    </div>

                                    {/* Overlay Card */}
                                    <div
                                        className=" bg-white shadow-lg rounded-md p-3 text-center w-[220px] sm:w-[240px] md:w-[260px] mt-6 lg:mt-35 lg:absolute lg:top-[25px] lg:left-30"
                                    >
                                        <img
                                            src={resortinterior.src}
                                            className="h-[150px] sm:h-[180px] w-full object-cover rounded"
                                            alt=""
                                        />

                                        <div className="flex justify-center gap-1 mt-3">
                                            <h3 className="text-[18px] sm:text-[20px] font-bold">1350+</h3>
                                            <span className="text-[18px] sm:text-[20px] font-semibold text-[#00000075]">
                                                Visitors
                                            </span>
                                        </div>

                                        <span className="block text-[16px] sm:text-[18px] font-semibold text-[#00000075]">
                                            Come Annually
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT CONTENT */}
                                <div className="w-full lg:w-1/2">
                                    <p className="text-[#283862] font-serif italic text-[15px] sm:text-[16px] md:text-lg mb-6 leading-relaxed">
                                        At Bluebell, we understand the different expectations of visitors.
                                        We feel elated when you come back for the second time!
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                        {features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border border-[#c23535] flex items-center justify-center text-[#c23535] text-[10px] shrink-0">
                                                    <FaCheck />
                                                </div>
                                                <span className="text-gray-600 text-sm font-medium">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

                {/* --- STORY SECTION (Dark) --- */}
                <div className="w-full flex flex-col lg:flex-row p-5 sm:p-6 lg:p-[50px] mb-5 gap-8 lg:gap-[30px]">

                    {/* ===== LEFT BOX ===== */}
                    <div className="first-box w-full lg:w-[55%]">

                        <div className="flex items-center mt-5 gap-3 sm:gap-4 mb-2">
                            <div className="w-10 sm:w-12 h-[2px] bg-[#c23535]"></div>
                            <span className="text-[#c23535] text-[12px] sm:text-[14px] lg:text-[16px] font-bold tracking-[0.2em] uppercase">
                                ABOUT US
                            </span>
                        </div>

                        <h3 className="text-[22px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-bold w-full sm:w-[80%] lg:w-[60%] text-white mb-6 sm:mb-8 lg:mb-10">
                            The Story of Behind Our Resort
                        </h3>

                        <p className="text-[11px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-white mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
                            Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly. Societies and spirits with our own, communicating enthusiasm and liberality in the food. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality.
                        </p>

                        <div className="h-[200px] sm:h-[250px] md:h-[380px] lg:h-[380px]">
                            <img
                                className="rounded-[8px] w-full h-full object-cover"
                                src={resort.src}
                            />
                        </div>

                    </div>

                    {/* ===== RIGHT BOX ===== */}
                    <div className="second-box w-full lg:w-[45%] mt-8 lg:mt-5">

                        <img
                            className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[520px] rounded-[8px] object-cover"
                            src={diningarea.src}
                        />

                        <p className="text-[12px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-white mb-6 sm:mb-7 mt-6 sm:mt-8 lg:mt-10 leading-relaxed">
                            Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality.
                        </p>

                        <a href="">
                            <span className="text-red-500 text-sm sm:text-base font-semibold">
                                Read More
                            </span>
                        </a>

                    </div>

                </div>


                <div className="max-w-[1400px] bg-white mx-auto px-6 lg:px-16 py-20 lg:py-28">

                    {/* --- TEAM SECTION --- */}
                    <div className="mb-24">
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-[2px] bg-[#c23535]"></div>
                                <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Dedicated Team</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif text-[#283862] font-bold mb-6">Our Resort Staff</h2>
                            <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                                Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-[30px] main-box">

                            <div className="box1 w-full sm:w-[25%] h-[400px] text-center">
                                <img className="h-[300px] w-full object-cover" src={housekeeping1.src} />
                                <div>
                                    <h4 className="mt-[4px] text-[20px]">Dona Mona</h4>
                                    <span className="text-[20px] text-red-500">House Keeping</span>
                                </div>
                            </div>

                            <div className="box2 w-full sm:w-[25%] h-[400px] text-center">
                                <img className="h-[300px] w-full object-scale-down" src={housekeeping2.src} />
                                <div>
                                    <h4 className="mt-[4px] text-[20px]">Desulva Merry</h4>
                                    <span className="text-[20px] text-red-500">House Keeping</span>
                                </div>
                            </div>

                            <div className="box3 w-full sm:w-[25%] h-[400px] text-center">
                                <img className="h-[300px] w-full object-scale-down" src={housekeeping3.src} />
                                <div>
                                    <h4 className="mt-[4px] text-[20px]">John Michale</h4>
                                    <span className="text-[20px] text-red-500">House Keeping</span>
                                </div>
                            </div>

                            <div className="box4 w-full sm:w-[25%] h-[400px] text-center">
                                <img className="h-[300px] w-full object-cover" src={housekeeping4.src} />
                                <div>
                                    <h4 className="mt-[4px] text-[20px]">Marry Desalwa</h4>
                                    <span className="text-[20px] text-red-500">House Keeping</span>
                                </div>
                            </div>

                        </div>



                    </div>

                    {/* --- STATS SECTION --- */}
                    <div className="border-t border-gray-200 pt-16">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="text-4xl md:text-5xl font-serif font-bold text-[#283862] mb-2 flex items-start">
                                        {stat.value.replace(/[^0-9]/g, '')}
                                        <span className="text-[#c23535] text-2xl md:text-3xl mt-1">{stat.value.replace(/[0-9]/g, '')}</span>
                                    </div>
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default AboutUs;
