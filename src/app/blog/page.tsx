"use client";
import React, { useState } from 'react';
import { 
  FaUser, 
  FaComments, 
  FaChevronRight 
} from 'react-icons/fa';

interface BlogProps {
  onBack: () => void;
  onReadMore: (id: number) => void;
}

const Blog: React.FC<BlogProps> = ({ onBack, onReadMore }) => {
  // Mock Data based on screenshot
  const blogPosts = [
    {
      id: 1,
      title: "New heaven for our customers in ...",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
      date: "December 11, 2021",
      author: "admin",
      comments: 0,
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 2,
      title: "10 top soups from our restaurant ...",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2000&auto=format&fit=crop",
      date: "December 11, 2021",
      author: "admin",
      comments: 0,
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 3,
      title: "Paradise for our customers in ...",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop",
      date: "December 11, 2021",
      author: "admin",
      comments: 0,
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 4,
      title: "How to book a Resort in best price",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2000&auto=format&fit=crop",
      date: "December 30, 2021",
      author: "admin",
      comments: 0,
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 5,
      title: "Know the secret of Bluebell Resort",
      image: "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2000&auto=format&fit=crop",
      date: "December 30, 2021",
      author: "admin",
      comments: 0,
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 6,
      title: "How to book a Resort in best price",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop",
      date: "December 30, 2021",
      author: "admin",
      comments: 0,
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    }
  ];

  return (
    <div className="w-full font-sans pb-20 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="bg-[#283862] pt-40 pb-24 text-white text-center px-4 relative overflow-hidden">
         <div className="absolute inset-0 opacity-40">
             <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
         </div>
         <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 drop-shadow-lg">Blog</h1>
            <div className="flex justify-center items-center gap-3 text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
                <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={onBack}>Home</span>
                <span>/</span>
                <span className="text-white">Blog</span>
            </div>
         </div>
      </div>

      <div className="bg-white max-w-[1200px] mx-auto px-6 lg:px-12 py-16 md:py-24 rounded-[20px]">
        
        {/* --- BLOG GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 mb-20">
            {blogPosts.map((post) => (
                <div key={post.id} className="group flex flex-col bg-white p-6 md:p-0 md:bg-transparent rounded-sm md:rounded-none shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow">
                    {/* Image */}
                    <div className="overflow-hidden mb-6 md:mb-8 rounded-sm">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-[280px] md:h-[350px] object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                            onClick={() => onReadMore(post.id)}
                        />
                    </div>

                    {/* Meta Data */}
                    <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm mb-4">
                        <span className="text-[#c23535] font-medium">{post.date}</span>
                        <div className="flex items-center gap-1 text-gray-400">
                            <span className="text-gray-400">By: {post.author}</span>
                            <span>/</span>
                            <span>{post.comments} Comments</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 
                            className="text-2xl md:text-3xl font-serif font-bold text-[#283862] mb-4 leading-tight group-hover:text-[#c23535] transition-colors cursor-pointer"
                            onClick={() => onReadMore(post.id)}
                        >
                            {post.title}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            {post.excerpt}
                        </p>
                        <button 
                            onClick={() => onReadMore(post.id)}
                            className="text-[#c23535] text-xs font-bold uppercase tracking-widest underline decoration-[#c23535]/30 underline-offset-4 hover:decoration-[#c23535] transition-all"
                        >
                            Read More
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* --- PAGINATION --- */}
        <div className="flex justify-center items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center bg-[#c23535] text-white text-sm font-bold shadow-md transition-transform hover:-translate-y-1">
                1
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white text-gray-500 border border-gray-200 text-sm font-bold hover:bg-gray-50 hover:text-[#c23535] transition-colors">
                2
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white text-gray-500 border border-gray-200 text-sm hover:bg-gray-50 hover:text-[#c23535] transition-colors">
                <span className="sr-only">Next</span>
                <FaChevronRight size={10} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default Blog;
