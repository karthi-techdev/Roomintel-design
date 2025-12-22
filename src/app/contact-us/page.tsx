"use client";
import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

interface ContactUsProps {
  onBack: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onBack }) => {
  return (
    <div className="w-full font-sans pb-0 min-h-screen">
      
      {/* --- HEADER - Made responsive */}
      <div className="bg-[#283862] pt-40 pb-20 md:pt-56 md:pb-36 text-white text-center px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-40">
             <img 
               src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop" 
               className="w-full h-full object-cover" 
               alt="Header" 
             />
         </div>
         <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-lg">Contact Us</h1>
            <div className="flex justify-center items-center gap-3 text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
                <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={onBack}>Home</span>
                <span>/</span>
                <span className="text-white">Contact Us</span>
            </div>
         </div>
      </div>

{/* Top Border Shape */}
       <div className="relative h-3 w-3/3 mx-auto bg-gradient-to-r from-transparent via-[#d6d6d6] to-transparent rounded-full"></div>



      {/* Main Content - Made responsive */}
      <div className="bg-white max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-12 md:py-16 lg:py-24 rounded-[20px]  relative z-20">

 
         
         <div className="flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-32">
            
            {/* --- LEFT: FORM --- */}
            <div className="w-full lg:w-2/3">
                <div className="flex items-baseline gap-4 mb-6 md:mb-8">
                     <div className="w-8 md:w-12 h-[2px] bg-[#c23535]"></div>
                     <span className="text-[#c23535] text-xs md:text-sm font-bold tracking-[0.1em] uppercase">Get In Touch</span>
                </div>
                
                <h2 className={`${playfair.className} text-2xl md:text-3xl lg:text-5xl text-[#0e2a4e] font-[800] mb-6 md:mb-10`}>
                  Drop a message for any query
                </h2>
                
                <p className="text-gray-500 text-sm md:text-base lg:text-[17px] mb-8 md:mb-10 leading-relaxed max-w-2xl">
                    Our objective at Bluebell is to bring together our visitor`s societies and spirits with our own, communicating enthusiasm and liberality in the food we share.
                </p>

                <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold border-gray-400 rounded-sm text-sm text-gray-700 placeholder-gray-700 focus:outline-none focus:border-[#c23535] transition-colors" 
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold border-gray-400 rounded-sm text-sm text-gray-700 placeholder-gray-700 focus:outline-none focus:border-[#c23535] transition-colors" 
                      />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold border-gray-400 rounded-sm text-sm text-gray-700 placeholder-gray-700 focus:outline-none focus:border-[#c23535] transition-colors" 
                      />
                      <input 
                        type="text" 
                        placeholder="Subject" 
                        className="w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold border-gray-400 rounded-sm text-sm text-gray-700 placeholder-gray-700 focus:outline-none focus:border-[#c23535] transition-colors" 
                      />
                   </div>
                   <textarea 
                      placeholder="Write a message" 
                      className="w-full h-36 md:h-48 p-4 md:p-6 bg-white border font-semibold border-gray-400 rounded-sm text-sm text-gray-700 placeholder-gray-700 focus:outline-none focus:border-[#c23535] transition-colors resize-none"
                   ></textarea>
                   
                   <button className="bg-[#c23535] hover:bg-[#c23535] text-white font-bold h-[45px] md:h-[55px] px-6 md:px-10 rounded-sm text-xs md:text-[11px] tracking-[0.2em] uppercase transition-all shadow-md hover:shadow-lg w-full md:w-auto">
                      Send A Message
                   </button>
                </form>
            </div>

            {/* --- RIGHT: INFO --- */}
            <div className="w-full lg:w-1/3 space-y-6 md:space-y-8 lg:pt-8">
                
                {/* Address */}
                <div>
                   <h3 className="text-xl md:text-2xl font-serif font-bold text-[#283862] mb-4 md:mb-6 flex items-baseline gap-3 md:gap-4">
                      Bluebell Resort <span className="w-8 md:w-12 h-[1px] bg-[#283862]"></span>
                   </h3>
                   <div className="text-black text-sm md:text-base lg:text-[17px] space-y-2 font-light leading-relaxed pl-1">
                      <p>2624 Sampson Street,<br/>Aurora, CO 80014</p>
                      <p className="hover:text-[#c23535] transition-colors cursor-pointer">contact@bluebell.com</p>
                   </div>
                </div>

                {/* Phone */}
                <div>
                   <h3 className="text-xl md:text-2xl font-serif font-bold text-[#283862] mb-4 md:mb-6 flex items-baseline gap-3 md:gap-4">
                      Reception Phone No. <span className="w-8 md:w-12 h-[1px] bg-[#283862]"></span>
                   </h3>
                   <div className="flex items-center gap-3 text-[#c23535] text-base md:text-lg font-bold mb-3 md:mb-4 pl-1">
                      <FaPhoneAlt className="text-xs md:text-sm" /> 1800-456-7890
                   </div>
                   <div className="text-black text-sm md:text-base lg:text-[17px] space-y-1 font-light pl-1">
                      <p>Check in: 01.00 PM</p>
                      <p>Check out: 10.00 PM</p>
                   </div>
                </div>

            </div>

         </div>
      </div>

      {/* --- MAP SECTION - Made responsive --- */}
      <div className="mx-4 sm:mx-5 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] my-4 sm:my-5">
         <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.653494796331!2d-104.8016466846244!3d39.74737607944855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7c5936c4b375%3A0x6e7f8e3f2214373a!2sAurora%2C%20CO%2080014%2C%20USA!5e0!3m2!1sen!2s!4v1641888800000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Resort Location"
         ></iframe>
      </div>

    </div>
  );
};

export default ContactUs;