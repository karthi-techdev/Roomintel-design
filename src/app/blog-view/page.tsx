"use client";
import React, { useState } from 'react';
import { 
  FaSearch, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaShareAlt,
  FaCalendarAlt,
  FaUser,
  FaRegComment
} from 'react-icons/fa';

interface BlogViewProps {
  onBack: () => void;
}

const BlogView: React.FC<BlogViewProps> = ({ onBack }) => {
  // Mock Data for Sidebar
  const categories = [
    { name: "archive", count: 0 },
    { name: "news", count: 0 },
  ];

  const popularPosts = [
    {
      id: 1,
      title: "How to book a Resort in best price",
      date: "January 4, 2022",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Know the secreat of Bluebell Resort",
      date: "January 4, 2022",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "How to book a Resort in best price",
      date: "January 4, 2022",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const tags = ["Holidays", "Hotels", "Prices", "Relaxation", "Resort", "Tips"];

  return (
    <div className="w-full   pb-20 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="bg-[#283862] pt-40 pb-32 text-white text-center px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-40">
             <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
         </div>
         <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl noto-geogia-font font-bold mb-6 leading-tight drop-shadow-lg">
              New heaven for our customers in ...
            </h1>
            <div className="flex justify-center items-center gap-3 text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
                <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={onBack}>Home</span>
                <span>/</span>
                <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={onBack}>Blog</span>
                <span>/</span>
                <span className="text-white">New heaven...</span>
            </div>
         </div>
      </div>

      <div className="bg-white max-w-[1200px] mx-auto px-6 lg:px-8 py-16 md:py-24 rounded-[20px]">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* --- LEFT CONTENT: BLOG POST --- */}
            <div className="w-full lg:w-2/3">
                <article className="bg-white p-0 md:p-0 rounded-sm mb-16">
                    {/* Featured Image */}
                    <div className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-sm mb-8">
                        <img 
                            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop" 
                            alt="Blog Post" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Meta Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
                        <span className="text-[#c23535] font-bold text-sm uppercase tracking-wide">December 11, 2021</span>
                        <div className="flex items-center gap-6 text-xs text-gray-400 font-medium uppercase tracking-wider">
                            <span className="flex items-center gap-2"><FaUser /> By: admin</span>
                            <span className="hidden md:inline">/</span>
                            <span>news</span>
                            <span className="hidden md:inline">/</span>
                            <span className="flex items-center gap-2"><FaRegComment /> 0 Comments</span>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="text-gray-500 leading-relaxed space-y-6 text-[15px] font-light">
                        <p className="text-lg text-gray-600 font-normal">
                            Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share.
                        </p>
                        <p>
                            Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it.
                        </p>
                        
                        <div className="bg-[#FAFAFA] border-l-4 border-[#c23535] p-6 md:p-8 my-8 italic text-gray-600 noto-geogia-font text-lg">
                            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet."
                        </div>

                        <p>
                            Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                        </p>
                        <p>
                           Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat.
                        </p>
                    </div>

                    {/* Share Footer */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-400 rounded-sm">
                            <FaShareAlt />
                        </div>
                        <a href="#" className="w-24 h-10 bg-[#3b5998] text-white flex items-center justify-center text-xs font-bold rounded-sm hover:opacity-90 transition-opacity">Facebook</a>
                        <a href="#" className="w-24 h-10 bg-[#55acee] text-white flex items-center justify-center text-xs font-bold rounded-sm hover:opacity-90 transition-opacity">Twitter</a>
                        <a href="#" className="w-24 h-10 bg-[#0077b5] text-white flex items-center justify-center text-xs font-bold rounded-sm hover:opacity-90 transition-opacity">Linkedin</a>
                    </div>
                </article>

                {/* Comment Section */}
                <div className="mb-12">
                    <h3 className="text-2xl noto-geogia-font font-bold text-[#283862] mb-8">Leave A Comment</h3>
                    
                    <form className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#c23535] transition-colors"
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#c23535] transition-colors"
                            />
                        </div>
                        <div className="mb-8">
                            <textarea 
                                placeholder="Type Comment here" 
                                className="w-full h-40 p-4 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#c23535] transition-colors resize-none"
                            ></textarea>
                        </div>
                        <button className="bg-[#D94444] hover:bg-[#b93535] text-white font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-sm transition-colors shadow-md">
                            Post Comments
                        </button>
                    </form>
                </div>
            </div>

            {/* --- RIGHT SIDEBAR --- */}
            <aside className="w-full lg:w-1/3 space-y-12">
                
                {/* Search */}
                <div className="bg-white p-0">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Enter Search Keywords" 
                            className="w-full h-14 pl-4 pr-12 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#c23535] transition-colors"
                        />
                        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                    <h3 className="text-xl noto-geogia-font font-bold text-[#283862] flex items-center gap-3">
                        Categories <span className="w-8 h-[1px] bg-[#283862]"></span>
                    </h3>
                    <ul className="space-y-4">
                        {categories.map((cat, idx) => (
                            <li key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                                <a href="#" className="text-gray-500 hover:text-[#c23535] transition-colors text-sm capitalize block">
                                    {cat.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Popular Posts */}
                <div className="space-y-6">
                    <h3 className="text-xl noto-geogia-font font-bold text-[#283862] flex items-center gap-3">
                        Popular Post <span className="w-8 h-[1px] bg-[#283862]"></span>
                    </h3>
                    <div className="space-y-6">
                        {popularPosts.map((post) => (
                            <div key={post.id} className="flex gap-4 group cursor-pointer">
                                <div className="w-20 h-20 shrink-0 overflow-hidden rounded-sm">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                </div>
                                <div>
                                    <h4 className="text-[#283862] font-medium text-sm leading-snug mb-2 group-hover:text-[#c23535] transition-colors">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-gray-400">{post.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-6">
                    <h3 className="text-xl noto-geogia-font font-bold text-[#283862] flex items-center gap-3">
                        Tags <span className="w-8 h-[1px] bg-[#283862]"></span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                            <a 
                                key={idx} 
                                href="#" 
                                className="px-4 py-2 border border-gray-200 text-gray-500 text-xs rounded-sm hover:bg-[#c23535] hover:text-white hover:border-[#c23535] transition-all"
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </div>

            </aside>

        </div>
      </div>
    </div>
  );
};

export default BlogView;
