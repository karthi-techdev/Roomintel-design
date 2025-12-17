"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaPhoneAlt, 
  FaBars, 
  FaTimes, 
  FaChevronRight, 
  FaFacebookF, 
  FaInstagram, 
  FaSkype, 
  FaSearch, 
  FaUser, 
  FaShoppingBag,
  FaSignInAlt,
  FaUserPlus,
  FaEnvelope,
  FaLock,
  FaUserCircle
} from 'react-icons/fa';
import { PiHouseLineBold } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Determine current view from pathname
    const getCurrentView = () => {
        const path = pathname || '/';
        if (path === '/') return 'home';
        if (path === '/about-us') return 'about-us';
        if (path === '/rooms') return 'rooms';
        if (path.startsWith('/room-detail')) return 'room-detail';
        if (path === '/room-cart') return 'room-cart';
        if (path === '/room-checkout') return 'room-checkout';
        if (path === '/gallery') return 'gallery';
        if (path === '/contact-us') return 'contact-us';
        if (path === '/dashboard') return 'dashboard';
        return 'home';
    };

    const currentView = getCurrentView();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
    
    const openLogin = () => {
        setIsLoginOpen(true);
        setIsRegisterOpen(false);
        setIsMobileMenuOpen(false);
    };
    
    const openRegister = () => {
        setIsRegisterOpen(true);
        setIsLoginOpen(false);
        setIsMobileMenuOpen(false);
    };

    const closeAuth = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
    };

    const handleAuthSubmit = () => {
        // Dummy login/register logic
        setIsLoggedIn(true);
        closeAuth();
    };

    const navLinks = [
        { name: 'HOME', view: 'home', href: '/' },
        { name: 'ABOUT US', view: 'about-us', href: '/about-us' },
        { name: 'ROOMS', view: 'rooms', href: '/rooms' },
        { name: 'GALLERY', view: 'gallery', href: '/gallery' },
        { name: 'CONTACT US', view: 'contact-us', href: '/contact-us' },
    ];

    return (
        <>
            <nav 
                className={`fixed top-0 left-0 w-full z-5000 transition-all duration-300 font-sans ${
                    scrolled ? 'bg-white shadow-md h-[70px] md:h-[80px]' : 'bg-white shadow-sm h-[80px] md:h-[90px]'
                } px-4 md:px-6 lg:px-16 flex items-center justify-between`}
            >
                {/* --- LOGO --- */}
                <Link 
                    href="/"
                    className="flex items-center gap-2 cursor-pointer z-50 group"
                >
                    <div className="text-brand-blue text-3xl md:text-4xl pb-1 group-hover:scale-110 transition-transform duration-300">
                        <PiHouseLineBold />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-brand-blue tracking-tight">Bluebell</span>
                </Link>

                {/* --- RIGHT ACTIONS --- */}
                <div className="flex items-center gap-3 md:gap-5">
                    
                    {/* Search Input (Desktop Dropdown) */}
                    <div className="hidden lg:block relative">
                        <button 
                            onClick={toggleSearch} 
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isSearchOpen ? 'bg-[#c23535] text-white' : 'text-gray-600 hover:text-[#c23535] hover:bg-gray-50'
                            }`}
                        >
                            {isSearchOpen ? <FaTimes /> : <FaSearch />}
                        </button>
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-4 w-[300px] bg-white shadow-xl border border-gray-100 rounded-sm p-4 z-50"
                                >
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search rooms..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-sm pl-4 pr-10 text-sm focus:outline-none focus:border-[#c23535] transition-colors"
                                            autoFocus
                                        />
                                        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="hidden lg:block h-6 w-[1px] bg-gray-200 mx-1"></div>

                    {/* Auth Section (Login/Register OR My Account) */}
                    <div className="hidden lg:flex items-center gap-2">
                        {isLoggedIn ? (
                             <Link 
                                href="/dashboard"
                                className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-[#c23535] border border-[#c23535]/30 bg-[#c23535]/5 rounded-sm hover:bg-[#c23535] hover:text-white transition-all"
                             >
                                <FaUserCircle size={16} /> My Account
                             </Link>
                        ) : (
                            <>
                                <button 
                                    onClick={openLogin}
                                    className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-gray-600 hover:text-brand-blue transition-colors"
                                >
                                    <FaSignInAlt /> Login
                                </button>
                                <button 
                                    onClick={openRegister}
                                    className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-gray-600 hover:text-brand-blue transition-colors"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>

                    {/* Cart */}
                    <Link 
                        href="/room-cart"
                        className="relative w-10 h-10 flex items-center justify-center text-[#283862] hover:text-[#c23535] transition-colors"
                    >
                        <FaShoppingBag size={20} />
                        <span className="absolute top-1 right-0 bg-[#c23535] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">1</span>
                    </Link>

                    {/* Reservation Button (Desktop) */}
                    <button className="hidden lg:block bg-[#c23535] hover:bg-[#c23535] text-white font-bold h-[45px] px-6 rounded-[4px] shadow-sm hover:shadow-md transition-all text-[12px] tracking-widest uppercase transform hover:-translate-y-[1px]">
                        Reservation
                    </button>

                    {/* --- MOBILE TOGGLE --- */}
                    <button
                        className="lg:hidden text-2xl text-gray-800 p-2 z-50 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        {isMobileMenuOpen ? <FaTimes className="text-[#c23535]" /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {/* --- MOBILE DRAWER --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 z-50000 bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 z-50001 h-full w-[300px] sm:w-[350px] bg-white shadow-2xl flex flex-col lg:hidden overflow-hidden"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col items-center">
                                <Link 
                                    href="/"
                                    className="text-brand-blue text-5xl mb-2"
                                    onClick={toggleMenu}
                                >
                                    <PiHouseLineBold />
                                </Link>
                                <span className="text-2xl font-bold text-brand-blue tracking-tight">Bluebell</span>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                
                                {/* Mobile Search */}
                                <div className="mb-8 relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        className="w-full h-12 bg-gray-100 rounded-sm px-4 pl-11 text-sm focus:outline-none focus:ring-1 focus:ring-[#c23535]/50 focus:bg-white transition-all"
                                    />
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                {/* Links */}
                                <div className="flex flex-col gap-1 mb-8">
                                    {navLinks.map((link) => (
                                        <Link 
                                            key={link.name}
                                            href={link.href}
                                            onClick={toggleMenu}
                                            className={`flex items-center justify-between py-3 px-2 border-b border-gray-50 text-sm font-bold tracking-widest uppercase transition-colors ${
                                                currentView === link.view ? 'text-[#c23535] bg-red-50/50 pl-4 border-l-4 border-l-[#c23535]' : 'text-gray-700 hover:text-[#c23535] hover:bg-gray-50'
                                            }`}
                                        >
                                            {link.name}
                                            <FaChevronRight className={`text-xs ${currentView === link.view ? 'text-[#c23535]' : 'text-gray-300'}`} />
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Auth */}
                                <div className="grid grid-cols-1 gap-3 mb-8">
                                    {isLoggedIn ? (
                                        <Link 
                                            href="/dashboard"
                                            onClick={toggleMenu}
                                            className="h-12 bg-[#283862] text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-[#c23535] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaUserCircle size={16} /> My Account
                                        </Link>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={openLogin}
                                                className="h-12 border border-gray-200 rounded-sm font-bold text-xs uppercase tracking-wider text-gray-700 hover:border-[#c23535] hover:text-[#c23535] transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaSignInAlt /> Login
                                            </button>
                                            <button 
                                                onClick={openRegister}
                                                className="h-12 bg-[#283862] text-white rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-[#c23535] transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaUserPlus /> Register
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Reservation */}
                                <div className="flex flex-col gap-3 mt-auto">
                                    <button className="w-full h-12 bg-[#c23535] text-white rounded-sm font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#c23535] transition-colors">
                                        Book A Reservation
                                    </button>
                                </div>

                                {/* Socials */}
                                <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-gray-100 text-gray-400">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#3b5998] hover:text-white transition-all cursor-pointer">
                                        <FaFacebookF />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all cursor-pointer">
                                        <FaInstagram />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#00aff0] hover:text-white transition-all cursor-pointer">
                                        <FaSkype />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- AUTH POPUPS --- */}
            <AnimatePresence>
                {(isLoginOpen || isRegisterOpen) && (
                    <div className="fixed inset-0 z-[5000000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeAuth}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-[450px] bg-white rounded-sm shadow-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={closeAuth}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#c23535] hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>

                            {isLoginOpen ? (
                                <div className="p-8 md:p-10">
                                    <div className="text-center mb-8">
                                        <div className="text-[#c23535] text-4xl mb-4 flex justify-center"><FaSignInAlt /></div>
                                        <h2 className="text-2xl font-serif font-bold text-[#283862]">Welcome Back</h2>
                                        <p className="text-gray-500 text-sm mt-2">Log in to your account to continue</p>
                                    </div>

                                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(); }}>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaEnvelope />
                                            </div>
                                            <input 
                                                type="email" 
                                                placeholder="Email Address" 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm"
                                                defaultValue="alex.morgan@example.com"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaLock />
                                            </div>
                                            <input 
                                                type="password" 
                                                placeholder="Password" 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm"
                                                defaultValue="password"
                                            />
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="accent-[#c23535]" /> Remember me
                                            </label>
                                            <a href="#" className="hover:text-[#c23535]">Forgot Password?</a>
                                        </div>

                                        <button className="w-full h-12 bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md">
                                            Login
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center text-sm text-gray-500">
                                        Don't have an account? <button onClick={openRegister} className="text-[#c23535] font-bold hover:underline">Register Now</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 md:p-10 z-5000000">
                                    <div className="text-center mb-8">
                                        <div className="text-[#c23535] text-4xl mb-4 flex justify-center"><FaUserPlus /></div>
                                        <h2 className="text-2xl font-serif font-bold text-[#283862]">Create Account</h2>
                                        <p className="text-gray-500 text-sm mt-2">Register to get exclusive offers</p>
                                    </div>

                                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(); }}>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaUser />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="Full Name" 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaEnvelope />
                                            </div>
                                            <input 
                                                type="email" 
                                                placeholder="Email Address" 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaLock />
                                            </div>
                                            <input 
                                                type="password" 
                                                placeholder="Password" 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaLock />
                                            </div>
                                            <input 
                                                type="password" 
                                                placeholder="Confirm Password" 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <input type="checkbox" className="accent-[#c23535]" required /> 
                                            <span>I agree to the <a href="#" className="hover:text-[#c23535]">Terms & Privacy Policy</a></span>
                                        </div>

                                        <button className="w-full h-12 bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md">
                                            Create Account
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center text-sm text-gray-500">
                                        Already have an account? <button onClick={openLogin} className="text-[#c23535] font-bold hover:underline">Login Here</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
