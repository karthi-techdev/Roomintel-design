"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { FaLongArrowAltRight, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface BlogProps {
  onBack: () => void;
  onReadMore: (id: number) => void;
}

const Blog: React.FC<BlogProps> = ({ onBack, onReadMore }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // All blog posts (Page 1 + Page 2)
  const allBlogPosts = [
    // Page 1 Posts
    {
      id: 1,
      title: "New heaven for our customers in ...",
      image: "/blog-images/blog-image-1.avif",
      date: "December 11, 2021",
      author: "admin",
      comments: "by Charles",
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 2,
      title: "10 top soups from our restaurant ...",
      image: "/blog-images/blog-image-2.jpg",
      date: "December 11, 2021",
      author: "admin",
      comments: "by Charles",
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 3,
      title: "Paradise for our customers in ...",
      image: "/blog-images/blog-image-3.avif",
      date: "December 11, 2021",
      author: "admin",
      comments: "by Charles",
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 4,
      title: "How to book a Resort in best price",
      image: "/blog-images/blog-image-4.avif",
      date: "December 30, 2021",
      author: "admin",
      comments: "by Charles",
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 5,
      title: "Know the secret of Bluebell Resort",
      image: "/blog-images/blog-image-5.avif",
      date: "December 30, 2021",
      author: "admin",
      comments: "by Charles",
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    {
      id: 6,
      title: "How to book a Resort in best price",
      image: "/blog-images/blog-image-6.jpg",
      date: "December 30, 2021",
      author: "admin",
      comments: "by Charles",
      excerpt: "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share. Nor again is there anyone ..."
    },
    // Page 2 Posts - Add more images here
    {
      id: 7,
      title: "Summer Travel Tips 2024",
      image: "/blog-images/blog-image-7.jpg",
      date: "January 15, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Discover the best summer destinations and travel tips for 2024. From beach resorts to mountain getaways..."
    },
    {
      id: 8,
      title: "Winter Wonderland Adventures",
      image: "/blog-images/blog-image-8.jpg",
      date: "February 10, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Experience the magic of winter with our guide to snowy destinations and winter sports..."
    },
    {
      id: 9,
      title: "Cultural Experiences Around the World",
      image: "/blog-images/blog-image-9.jpg",
      date: "March 5, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Immerse yourself in different cultures with our curated list of cultural experiences..."
    },
    {
      id: 10,
      title: "Luxury Resort Reviews",
      image: "/blog-images/blog-image-10.jpg",
      date: "April 20, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Read our honest reviews of the world's most luxurious resorts and hotels..."
    },
    {
      id: 11,
      title: "Budget Travel Hacks",
      image: "/blog-images/blog-image-4.avif",
      date: "May 15, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Learn how to travel the world on a budget with our money-saving tips and tricks..."
    },
    {
      id: 12,
      title: "Family-Friendly Destinations",
      image: "/blog-images/blog-image-1.avif",
      date: "June 10, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Find the perfect family vacation spots with our guide to family-friendly destinations..."
    },
    {
      id: 13,
      title: "Winter Wonderland Adventures",
      image: "/blog-images/blog-image-6.jpg",
      date: "February 10, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Experience the magic of winter with our guide to snowy destinations and winter sports..."
    },
    {
      id: 14,
      title: "Cultural Experiences Around the World",
      image: "/blog-images/blog-image-4.avif",
      date: "March 5, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Immerse yourself in different cultures with our curated list of cultural experiences..."
    },
    {
      id: 15,
      title: "Luxury Resort Reviews",
      image: "/blog-images/blog-image-3.avif",
      date: "April 20, 2022",
      author: "admin",
      comments: "by Charles",
      excerpt: "Read our honest reviews of the world's most luxurious resorts and hotels..."
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allBlogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allBlogPosts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMore = (id: number) => {
    router.push('/blog-view');
  };

  return (
    <div className="min-h-screen pb-20 font-sans">

      {/* Header */}
      <div className="relative overflow-hidden bg-[#283862] px-4 pb-24 pt-40 text-center text-white">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/blog-images/blog-image-navbar.avif"
            fill
            className="object-cover"
            alt="Header"
            quality={75}
            priority
          />
        </div>
        <div className="relative z-10">
          <h1 className="mb-4 font-serif text-5xl font-bold drop-shadow-lg md:text-7xl">Blog</h1>
          <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-200 md:text-sm">
            <span className="cursor-pointer hover:text-[#c23535] transition-colors" onClick={onBack}>Home</span>
            <span>/</span>
            <span>Blog</span>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-16 md:py-24 lg:px-12">
        {/* Blog Grid */}
        <div className="mb-20 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {currentPosts.map((post) => (
            <div key={post.id} className="group flex flex-col">
              {/* blogPosts Image */}
              <div className="relative mb-6 h-[280px] overflow-hidden rounded-sm md:mb-8 md:h-[350px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={75}
                  // onClick={() => handleReadMore(post.id)}
                />
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#FFC107]" size={14} />
                  <span className="font-medium text-gray-400">{post.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 md:mt-0.5">
                  <FaUser className="text-[#FFC107]" size={14} />
                  <span>{post.comments} </span>
                </div>
              </div>

              <div>
                <h2
                  className="mb-3  font-serif text-2xl font-bold leading-tight text-[#283862] transition-colors group-hover:text-[#c23535] md:text-3xl"
                  // onClick={() => handleReadMore(post.id)}
                >
                  {post.title}
                </h2>
                <p className="mb-2 text-sm leading-relaxed text-gray-500">
                  {post.excerpt}
                </p>
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="group/featured mt-4 inline-flex items-center cursor-pointer gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-[#c23535]"
                >
                  <span>READ MORE</span>
                  <FaLongArrowAltRight className="transition-transform group-hover/featured:translate-x-1 mt-0.5" size={30} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={() => handlePageChange(1)}
            className={`flex h-12 w-12 items-center justify-center text-sm font-bold shadow-md transition-transform hover:-translate-y-1 ${currentPage === 1 ? 'bg-[#c23535] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-[#c23535]'}`}
          >
            1
          </button>
          <button 
            onClick={() => handlePageChange(2)}
            className={`flex h-12 w-12 items-center justify-center text-sm font-bold border border-gray-200 transition-colors hover:bg-gray-50 hover:text-[#c23535] ${currentPage === 2 ? 'bg-[#c23535] text-white border-[#c23535]' : 'bg-white text-gray-500'}`}
          >
            2
          </button>
          {totalPages > 2 && (
            <button 
              onClick={() => handlePageChange(3)}
              className={`flex h-12 w-12 items-center justify-center text-sm font-bold border border-gray-200 transition-colors hover:bg-gray-50 hover:text-[#c23535] ${currentPage === 3 ? 'bg-[#c23535] text-white border-[#c23535]' : 'bg-white text-gray-500'}`}
            >
              3
            </button>
          )}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex h-12 w-12 items-center justify-center border border-gray-200 text-sm transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-[#c23535]'}`}
          >
            <span className="sr-only">Next</span>
            <FaLongArrowAltRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Blog;
