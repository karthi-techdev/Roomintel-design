"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    FaUserCircle,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import { useToast } from './ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../api/authService';
import logoImg from "../../public/Navbar-Logo.png"

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    const openLogin = () => {
        setIsLoginOpen(true);
        setIsRegisterOpen(false);
        setIsMobileMenuOpen(false);
        setErrors({ email: '', password: '', name: '', confirmPassword: '' });
        setServerError('');
    };

    const openRegister = () => {
        setIsRegisterOpen(true);
        setIsLoginOpen(false);
        setIsMobileMenuOpen(false);
        setErrors({ email: '', password: '', name: '', confirmPassword: '' });
        setServerError('');
    };

    const closeAuth = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setErrors({ email: '', password: '', name: '', confirmPassword: '' });
        setServerError('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: '' })); 
        setServerError('');
    };

    const validateForm = () => {
        const newErrors = { email: '', password: '', name: '', confirmPassword: '' };
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!isLoginOpen) {
            if (!formData.name) {
                newErrors.name = "Name is required";
                isValid = false;
            } else if (formData.name.length < 2) {
                newErrors.name = "Name must be at least 2 characters";
                isValid = false;
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Confirm Password is required";
                isValid = false;
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setServerError('');

        try {
            let data;
            if (isLoginOpen) {
                data = await authService.login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                data = await authService.register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name
                });
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data));

            setIsLoggedIn(true);
            setUser(data.data);
            closeAuth();
            toast({ title: "Success", description: isLoginOpen ? "Login Successful" : "Registration Successful", variant: "success" });

            setFormData({ email: '', password: '', name: '', confirmPassword: '' });
        } catch (err: any) {
            console.error("Auth Error:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Authentication failed';
            setServerError(errorMessage);
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setIsLoggedIn(false);
        setUser(null);
        router.push('/');
        router.refresh();
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
                className={`fixed top-0 z-50 transition-all duration-300  
    ${scrolled
                        ? 'bg-white shadow-lg h-[80px] md:h-[90px] left-0 right-0 rounded-sm'
                        : 'bg-white shadow-lg h-[80px] md:h-[90px] left-5 right-5 rounded-lg  before:content-[""] before:absolute before:left-[25px] before:right-[25px] before:-bottom-[13px] before:h-[13px] before:bg-white/25 before:rounded-b-[8px]'
                    }
    px-4 md:px-6 lg:px-16 flex items-center justify-between
  `}
            >

                {/* --- LOGO --- */}
                <Link
                    href="/"
                    className="flex items-center gap-2 cursor-pointer z-50"
                >
                    {/* Using Next.js Image component */}
                    <div className="relative">
                        <Image
                            src={logoImg}
                            alt="Room Intel Logo"
                            width={scrolled ? 120 : 150}
                            height={scrolled ? 200 : 200}
                            className={`object-contain transition-all rounded-4xl duration-300 ${scrolled ? 'h-18' : 'h-12 md:h-20 '
                                }`}
                            priority
                        />
                    </div>
                </Link>

                {/* --- DESKTOP NAVIGATION LINKS --- */}
                <div className="hidden lg:flex items-center justify-evenly w-[100%]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative font-bold text-[13px] max-[1250px]:text-[.65rem] tracking-widest uppercase transition-colors hover:text-[#c23535] ${currentView === link.view
                                ? 'text-[#c23535]'
                                : 'text-[#444]'
                                }`}
                        >
                            {link.name}
                            {currentView === link.view && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#c23535]"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                {/* --- RIGHT ACTIONS --- */}
                <div className="flex items-center gap-3 md:gap-5 ml-auto">

                    <div className="hidden lg:block h-6 w-[1px] bg-gray-200 mx-1"></div>

                    {/* Auth Section (Login/Register OR My Account) */}
                    <div className="hidden lg:flex items-center gap-2">
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center justify-around px-3 py-2 text-[12px] w-max gap-2 font-bold uppercase tracking-wide text-[#c23535] border border-[#c23535]/30 bg-[#c23535]/5 rounded-sm hover:bg-[#c23535] hover:text-white transition-all"
                            >
                                <FaUserCircle size={16} /> My Account
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={openLogin}
                                    className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-gray-600 hover:text-[#c23535] transition-colors"
                                >
                                    <FaSignInAlt /> Login
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
                    <Link href="/contact-us" className="hidden flex items-center w-max lg:flex bg-[#c23535] hover:bg-[#c23535] text-white font-bold h-[45px] px-6 rounded-[4px] shadow-sm hover:shadow-md transition-all text-[12px] tracking-widest uppercase transform hover:-translate-y-[1px]">
                        Send an enquiry
                    </Link>

                    {/* --- MOBILE TOGGLE --- */}
                    <button
                        className="lg:hidden text-2xl text-gray-800 p-2 z-50 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        {isMobileMenuOpen ? <FaTimes className="text-[#c23535]" /> : <FaBars />}
                    </button>
                </div>
            </nav>

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
                                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">Welcome Back</h2>
                                        <p className="text-gray-500 text-sm mt-2">Log in to your account to continue</p>
                                    </div>

                                    <form className="space-y-5" onSubmit={handleAuthSubmit}>
                                        {serverError && (
                                            <div className="text-red-500 text-sm text-center">{serverError}</div>
                                        )}

                                        {/* Email */}
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaEnvelope />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email Address"
                                                    className={`w-full h-12 pl-10 pr-4 bg-gray-50 border rounded-sm focus:outline-none focus:bg-white transition-colors text-sm ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#c23535]'
                                                        }`}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs pl-2">{errors.email}</p>}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaLock />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Password"
                                                    className={`w-full h-12 pl-10 pr-10 bg-gray-50 border rounded-sm focus:outline-none focus:bg-white transition-colors text-sm ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#c23535]'
                                                        }`}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#c23535]"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-500 text-xs pl-2">{errors.password}</p>}
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="accent-[#c23535]" /> Remember me
                                            </label>
                                            <a href="#" className="hover:text-[#c23535]">Forgot Password?</a>
                                        </div>

                                        <button
                                            disabled={loading}
                                            className="w-full h-12 bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md disabled:opacity-70"
                                        >
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center text-sm text-gray-500">
                                        Don't have an account? <button onClick={openRegister} className="text-[#c23535] font-bold hover:underline">Register Now</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 md:p-10">
                                    <div className="text-center mb-8">
                                        <div className="text-[#c23535] text-4xl mb-4 flex justify-center"><FaUserPlus /></div>
                                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">Create Account</h2>
                                        <p className="text-gray-500 text-sm mt-2">Register to get exclusive offers</p>
                                    </div>

                                    <form className="space-y-5" onSubmit={handleAuthSubmit}>
                                        {serverError && (
                                            <div className="text-red-500 text-sm text-center">{serverError}</div>
                                        )}

                                        {/* Name */}
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaUser />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Full Name"
                                                    className={`w-full h-12 pl-10 pr-4 bg-gray-50 border rounded-sm focus:outline-none focus:bg-white transition-colors text-sm ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-[#c23535]'
                                                        }`}
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.name && <p className="text-red-500 text-xs pl-2">{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaEnvelope />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email Address"
                                                    className={`w-full h-12 pl-10 pr-4 bg-gray-50 border rounded-sm focus:outline-none focus:bg-white transition-colors text-sm ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#c23535]'
                                                        }`}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-xs pl-2">{errors.email}</p>}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaLock />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Password"
                                                    className={`w-full h-12 pl-10 pr-10 bg-gray-50 border rounded-sm focus:outline-none focus:bg-white transition-colors text-sm ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#c23535]'
                                                        }`}
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#c23535]"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-500 text-xs pl-2">{errors.password}</p>}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <FaLock />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    placeholder="Confirm Password"
                                                    className={`w-full h-12 pl-10 pr-10 bg-gray-50 border rounded-sm focus:outline-none focus:bg-white transition-colors text-sm ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#c23535]'
                                                        }`}
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#c23535]"
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && <p className="text-red-500 text-xs pl-2">{errors.confirmPassword}</p>}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <input type="checkbox" className="accent-[#c23535]"/>
                                            <span>I agree to the <a href="#" className="hover:text-[#c23535]">Terms & Privacy Policy</a></span>
                                        </div>

                                        <button
                                            disabled={loading}
                                            className="w-full h-12 bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md disabled:opacity-70"
                                        >
                                            {loading ? 'Creating Account...' : 'Create Account'}
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