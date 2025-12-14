"use client";
import React from 'react';
import { FaCheck, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
      <div className="bg-[#283862] pt-40 pb-24 text-white text-center px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-40">
             <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
         </div>
         <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 drop-shadow-lg">About</h1>
            <div className="flex justify-center items-center gap-3 text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
                <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={onBack}>Home</span>
                <span>/</span>
                <span className="text-white">About</span>
            </div>
         </div>
      </div>

     <div className='bg-white max-w-[1400px] mx-5 px-6 lg:px-16 py-16 md:py-15 rounded-[20px]'>
      <div className="space-y-24 md:space-y-32">
        
        {/* --- WELCOME SECTION --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 space-y-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-[2px] bg-[#c23535]"></div>
                    <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Welcome to Bluebell</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-serif text-[#283862] font-bold leading-tight">
                    Our Resort has been present for over 20 years.
                </h2>
                
                <p className="text-[#283862] font-serif italic text-lg font-medium">
                    We make the best or all our customers.
                </p>
                
                <p className="text-gray-500 text-sm leading-relaxed">
                    Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality. Delightful herbs and flavors consolidate surfaces to pacify wide based palates.
                </p>
                
                <p className="text-gray-500 text-sm leading-relaxed">
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
                            <h4 className="text-[#283862] font-bold text-sm">Kahey Kemey</h4>
                            <span className="text-[#c23535] text-xs font-bold uppercase tracking-wider">Resort Manager</span>
                        </div>
                    </div>
                    {/* Signature placeholder */}
                    <div className="h-12 opacity-50">
                       <span className="font-cursive text-4xl text-gray-400">Kathy A. Xemn</span>
                    </div>
                </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
                <div className="relative rounded-sm overflow-hidden h-[500px] lg:h-[600px] w-full shadow-xl">
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

             <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                 
                 <div className="w-full lg:w-1/2 relative">
                     <div className="flex gap-4 h-[400px]">
                         <div className="w-1/2 h-full rounded-sm overflow-hidden shadow-lg mt-8">
                             <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Spa" />
                         </div>
                         <div className="w-1/2 h-full rounded-sm overflow-hidden shadow-lg mb-8">
                             <img src="https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Pool" />
                         </div>
                     </div>
                     <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white px-8 py-4 shadow-xl text-center rounded-sm border-t-4 border-[#c23535] min-w-[200px]">
                         <span className="block text-2xl font-bold text-[#283862]">1350 +</span>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visitors Come Annually</span>
                     </div>
                 </div>

                 <div className="w-full lg:w-1/2">
                    <p className="text-[#283862] font-serif italic text-lg mb-8 leading-relaxed">
                        At Bluebell, we understand the different expectations of visitors. We feel elated when you come back for the second time!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border border-[#c23535] flex items-center justify-center text-[#c23535] text-[10px] shrink-0">
                                    <FaCheck />
                                </div>
                                <span className="text-gray-600 text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                 </div>

             </div>
        </div>

      </div>

      {/* --- STORY SECTION (Dark) --- */}
      <div className="bg-[#0B121C] py-20 lg:py-28 relative overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                 
                 {/* Row 1 Left: Text */}
                 <div className="flex flex-col justify-center order-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-[2px] bg-[#c23535]"></div>
                        <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">About Us</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif text-white font-bold mb-6 leading-tight">
                        The Story of Behind <br/> Our Resort
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly. Societies and spirits with our own, communicating enthusiasm and liberality in the food. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality.
                    </p>
                 </div>

                 {/* Row 1 Right: Image */}
                 <div className="h-[400px] lg:h-[500px] rounded-sm overflow-hidden order-2">
                     <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Restaurant Interior" />
                 </div>

                 {/* Row 2 Left: Image */}
                 <div className="h-[400px] lg:h-[500px] rounded-sm overflow-hidden order-3 lg:order-3">
                     <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Pool View" />
                 </div>

                 {/* Row 2 Right: Text */}
                 <div className="flex flex-col justify-center order-4 lg:order-4">
                     <p className="text-white font-bold text-lg mb-6 leading-relaxed">
                        Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Official Chef and Owner Philippe Massoud superbly creates a blend of Lebanese, Levantine, Mediterranean motivated food blended in with New York mentality.
                     </p>
                     <button className="text-[#c23535] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors self-start">
                         Read More
                     </button>
                 </div>

             </div>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20 lg:py-28">
        
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {staffMembers.map((staff, index) => (
                   <div key={staff.id} className="group">
                       {/* Image Container */}
                       <div className="aspect-[3/4] w-full overflow-hidden mb-6 bg-gray-100 rounded-sm">
                           <img 
                              src={staff.image} 
                              alt={staff.name} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out transform group-hover:scale-105"
                           />
                       </div>

                       {/* Text */}
                       <div className="text-center">
                            <h4 className="text-[#283862] font-bold text-xl mb-2 font-sans tracking-wide">{staff.name}</h4>
                            <span className="text-[#c23535] text-[11px] font-bold tracking-[0.2em] uppercase">{staff.role}</span>
                       </div>
                   </div>
               ))}
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
