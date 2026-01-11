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
import { useAuthStore } from "../store/useAuthStore";
import logoImg from "../../public/Navbar-Logo.png";
import { useCartStore } from "../store/useCartStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { authService } from '../api/authService';

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();

    // Zustand auth state
    const { user, isLoggedIn, login, register, logout, loadFromStorage } = useAuthStore();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const cartItems = useCartStore((state) => state.cartItems);
    const fetchCart = useCartStore((state) => state.fetchCart);
    const fetchSettings = useSettingsStore((state) => state.fetchSettings);
    const cartCount = cartItems.length;
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
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const openTerms = () => {
        setIsTermsOpen(true);
        setIsMobileMenuOpen(false);
    };

    const closeTerms = () => setIsTermsOpen(false);

    const getCurrentView = () => {
        const path = pathname || '/';

        if (path === '/') return 'home';
        if (path === '/about-us') return 'about-us';


        
        if (
            path.startsWith('/rooms') ||
            path.startsWith('/room-view') ||
            path.startsWith('/room-checkout') ||
            path.startsWith('/room-cart')
        ) {
            return 'rooms';
        }

        if (path === '/gallery') return 'gallery';
        if (path === '/contact-us') return 'contact-us';
        if (path === '/dashboard') return 'dashboard';

        return 'home';
    };


    const currentView = getCurrentView();

    // Load auth from storage on mount
    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

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
        setIsForgotPasswordOpen(false);
        setIsMobileMenuOpen(false);
        resetForm();
    };

    const openRegister = () => {
        setIsRegisterOpen(true);
        setIsLoginOpen(false);
        setIsForgotPasswordOpen(false);
        setIsMobileMenuOpen(false);
        resetForm();
    };

    const openForgotPassword = () => {
        setIsForgotPasswordOpen(true);
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        resetForm();
    };


    const closeAuth = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setIsForgotPasswordOpen(false);
        resetForm();
    };

    // Inside Navbar component
    useEffect(() => {
        const handleOpenLogin = () => {
            openLogin(); // This opens your existing login modal
        };

        window.addEventListener('open-login-modal', handleOpenLogin);

        return () => {
            window.removeEventListener('open-login-modal', handleOpenLogin);
        };
    }, []); // Removed dependency on openLogin to prevent re-attaching, or verify referencing

    const resetForm = () => {
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
        setErrors({ email: '', password: '', name: '', confirmPassword: '' });
        setServerError('');
        setAgreedToTerms(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setServerError('');
    };

    const validateForm = () => {
        const newErrors: typeof errors = { email: '', password: '', name: '', confirmPassword: '' };
        let valid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            valid = false;
        }

        if (isRegisterOpen) {
            if (!formData.name.trim()) {
                newErrors.name = 'Full name is required';
                valid = false;
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
                valid = false;
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const handleAuthSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setServerError('');

        try {
            if (isLoginOpen) {
                await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                await register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name
                });
            }

            closeAuth();
            toast({ title: "Success", description: isLoginOpen ? "Login Successful" : "Registration Successful", variant: "success" });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Authentication failed';
            setServerError(errorMessage);
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            setErrors({ ...errors, email: 'Email is required' });
            return;
        } else if (!emailRegex.test(formData.email)) {
            setErrors({ ...errors, email: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        setServerError('');
        // Clear previous field errors
        setErrors(prev => ({ ...prev, email: '' }));

        try {
            await authService.forgotPassword(formData.email);
            toast({ title: "Success", description: "Password reset email sent. Please check your inbox.", variant: "success" });
            closeAuth();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset email';

            // Check if error is related to email not found and map to field error
            if (errorMessage.toLowerCase().includes('no account found') || errorMessage.toLowerCase().includes('user not found')) {
                setErrors(prev => ({ ...prev, email: errorMessage }));
            } else {
                setServerError(errorMessage);
            }

            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
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
                <Link href="/" className="flex items-center gap-2 cursor-pointer z-50">
                    <div className="relative">
                        <Image
                            src={logoImg}
                            alt="Room Intel Logo"
                            width={scrolled ? 120 : 150}
                            height={scrolled ? 200 : 200}
                            className={`object-contain transition-all rounded-4xl duration-300 ${scrolled ? 'h-18' : 'h-12 md:h-20 '}`}
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

                    {/* Auth Section */}
                    <div className="hidden lg:flex items-center gap-2">
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center justify-around px-3 py-2 text-[12px] w-max gap-2 font-bold uppercase tracking-wide text-[#c23535] border border-[#c23535]/30 bg-[#c23535]/5 rounded-sm hover:bg-[#c23535] hover:text-white transition-all"
                            >
                                <FaUserCircle size={16} /> My Account
                            </Link>
                        ) : (
                            <button
                                onClick={openLogin}
                                className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-gray-600 hover:text-[#c23535] transition-colors"
                            >
                                <FaSignInAlt /> Login
                            </button>
                        )}
                    </div>

                    {/* <Link
                        href="/room-cart"
                        className="relative w-10 h-10 flex items-center justify-center text-[#283862] hover:text-[#c23535] transition-colors"
                    >
                        <FaShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-0 bg-[#c23535] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </Link> */}



                    {/* Mobile Toggle */}
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 z-50000 bg-black/60 backdrop-blur-sm lg:hidden"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 z-50001 h-full w-[300px] sm:w-[350px] bg-white shadow-2xl flex flex-col lg:hidden overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                                <div className="relative">
                                    <Image
                                        src="/Room-intel-logo2.png"
                                        alt="Room Intel Logo"
                                        width={40}
                                        height={40}
                                        className="h-10 w-auto object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl noto-geogia-font font-bold text-[#283862] leading-none">
                                        Bluebell
                                    </span>
                                    <span className="text-xs font-light tracking-[0.1em] text-[#c23535] uppercase">
                                        Resort
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="flex flex-col gap-1 mb-8">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={toggleMenu}
                                            className={`flex items-center justify-between py-3 px-2 border-b border-gray-50 text-sm font-bold tracking-widest uppercase transition-colors ${currentView === link.view ? 'text-[#c23535] bg-red-50/50 pl-4 border-l-4 border-l-[#c23535]' : 'text-gray-700 hover:text-[#c23535] hover:bg-gray-50'
                                                }`}
                                        >
                                            {link.name}
                                            <FaChevronRight className={`text-xs ${currentView === link.view ? 'text-[#c23535]' : 'text-gray-300'}`} />
                                        </Link>
                                    ))}
                                </div>

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

                                <div className="flex flex-col gap-3 mt-auto">
                                    <button className="w-full h-12 bg-[#c23535] text-white rounded-sm font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#c23535] transition-colors">
                                        Book A Reservation
                                    </button>
                                </div>

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

            {/* --- TERMS & PRIVACY MODAL ---
            <AnimatePresence>
                {isTermsOpen && (
                    <div className="fixed inset-0 z-[6000000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={closeTerms}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-[768px] max-h-[80vh] overflow-y-auto bg-white rounded-sm shadow-2xl p-6"
                        >
                            <button
                                onClick={closeTerms}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#c23535] hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>

                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-[#283862]">Terms & Privacy Policy</h2>
                                <p className="text-sm text-gray-500 mt-1">Please read these terms and conditions carefully before using our service.</p>
                            </div>

                            <div className="prose prose-sm max-w-none text-gray-700">
                                <p>
                                    Welcome to our service. By accessing or using our website, you agree to be bound by these terms. These Terms & Privacy explain the rules and regulations for the use of our website and services.
                                </p>

                                <h3>1. Use of Service</h3>
                                <p>
                                    You agree not to misuse the service. Unauthorized use may give rise to a claim for damages and/or be a criminal offence.
                                </p>

                                <h3>2. Account Registration</h3>
                                <p>
                                    When creating an account you must provide accurate information and keep it up to date. You are responsible for safeguarding your account credentials.
                                </p>

                                <h3>3. Privacy</h3>
                                <p>
                                    We collect and use personal data in accordance with our privacy practices. By using the service you consent to such processing and you warrant that all data provided by you is accurate.
                                </p>

                                <h3>4. Limitation of Liability</h3>
                                <p>
                                    To the extent permitted by law, we will not be liable for any direct, indirect or consequential loss arising from your use of the service.
                                </p>

                                <h3>5. Changes</h3>
                                <p>
                                    We may amend these terms from time to time. Continued use of the service after such changes constitutes your acceptance of the new terms.
                                </p>

                                <p className="text-xs text-gray-500">If you have questions about these terms, please contact our support team.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence> */}


            {/* --- TERMS & PRIVACY MODAL --- */}
            <AnimatePresence>
                {isTermsOpen && (
                    <div className="fixed inset-0 z-[6000000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={closeTerms}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#c23535] to-[#c23535] px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Terms & Privacy</h2>
                                    </div>
                                    <button
                                        onClick={closeTerms}
                                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <FaTimes className="text-white text-lg" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="max-h-[60vh] overflow-y-auto p-6">
                                <div className="space-y-6">
                                    <p className="text-gray-700">
                                        Welcome to our service. By accessing or using our website, you agree to be bound by these terms.
                                    </p>

                                    <div className="space-y-5">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-6 h-6 bg-[#283862] text-white text-sm rounded-full flex items-center justify-center">
                                                    1
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Use of Service</h3>
                                            </div>
                                            <p className="text-gray-600 ml-8">
                                                You agree not to misuse the service. Unauthorized use may give rise to a claim for damages.
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-6 h-6 bg-[#283862] text-white text-sm rounded-full flex items-center justify-center">
                                                    2
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Account Registration</h3>
                                            </div>
                                            <p className="text-gray-600 ml-8">
                                                When creating an account you must provide accurate information and keep it up to date.
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-6 h-6 bg-[#283862] text-white text-sm rounded-full flex items-center justify-center">
                                                    3
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Privacy</h3>
                                            </div>
                                            <p className="text-gray-600 ml-8">
                                                We collect and use personal data according to our privacy practices.
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-6 h-6 bg-[#283862] text-white text-sm rounded-full flex items-center justify-center">
                                                    4
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Limitation of Liability</h3>
                                            </div>
                                            <p className="text-gray-600 ml-8">
                                                To the extent permitted by law, we will not be liable for any direct or indirect loss.
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-6 h-6 bg-[#283862] text-white text-sm rounded-full flex items-center justify-center">
                                                    5
                                                </div>
                                                <h3 className="font-semibold text-gray-800">Changes</h3>
                                            </div>
                                            <p className="text-gray-600 ml-8">
                                                We may amend these terms from time to time. Continued use means acceptance of new terms.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-gray-500">
                                            If you have questions about these terms, please contact our support team.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t px-6 py-4 bg-gray-50">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => { setAgreedToTerms(true); closeTerms(); }}
                                        className="px-6 py-2 bg-[#c23535] text-white font-medium rounded-lg hover:bg-[#3a4a8a] transition-colors"
                                    >
                                        I Agree
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- AUTH POPUPS --- */}
            <AnimatePresence>
                {(isLoginOpen || isRegisterOpen || isForgotPasswordOpen) && (
                    <div className="fixed inset-0 z-[5000000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-[450px] bg-white rounded-sm shadow-2xl overflow-hidden"
                        >
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

                                    {serverError && <div className="text-red-500 text-sm text-center mb-4">{serverError}</div>}

                                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(); }}>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaEnvelope />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                className={`w-full h-12 pl-10 pr-4 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm`}
                                                value={formData.email}
                                                onChange={handleInputChange}

                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 pl-2">{errors.email}</p>}
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaLock />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                className={`w-full h-12 pl-10 pr-10 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm`}
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
                                            {errors.password && <p className="text-red-500 text-xs mt-1 pl-2">{errors.password}</p>}
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="accent-[#c23535]" /> Remember me
                                            </label>
                                            <button type="button" onClick={openForgotPassword} className="hover:text-[#c23535]">Forgot Password?</button>
                                        </div>

                                        <button disabled={loading} className="w-full h-12 bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md disabled:opacity-70">
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center text-sm text-gray-500">
                                        Don't have an account? <button onClick={openRegister} className="text-[#c23535] font-bold hover:underline">Register Now</button>
                                    </div>
                                </div>
                            ) : isForgotPasswordOpen ? (
                                <div className="p-8 md:p-10">
                                    <div className="text-center mb-8">
                                        <div className="text-[#c23535] text-4xl mb-4 flex justify-center"><FaLock /></div>
                                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">Forgot Password</h2>
                                        <p className="text-gray-500 text-sm mt-2">Enter your email to reset your password</p>
                                    </div>

                                    {serverError && <div className="text-red-500 text-sm text-center mb-4">{serverError}</div>}

                                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleForgotPasswordSubmit(); }}>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaEnvelope /></div>
                                            <input type="email" name="email" placeholder="Email Address" className={`w-full h-12 pl-10 pr-4 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm`} value={formData.email} onChange={handleInputChange} />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 pl-2">{errors.email}</p>}
                                        </div>

                                        <button disabled={loading} className="w-full h-12 bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md disabled:opacity-70">
                                            {loading ? 'Sending...' : 'Send Reset Link'}
                                        </button>
                                    </form>

                                    <div className="mt-8 text-center text-sm text-gray-500">
                                        Remember your password? <button onClick={openLogin} className="text-[#c23535] font-bold hover:underline">Back to Login</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 md:p-10">
                                    <div className="text-center mb-8">
                                        <div className="text-[#c23535] text-4xl mb-4 flex justify-center"><FaUserPlus /></div>
                                        <h2 className="text-2xl noto-geogia-font font-bold text-[#283862]">Create Account</h2>
                                    </div>

                                    {serverError && <div className="text-red-500 text-sm text-center mb-4">{serverError}</div>}

                                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(); }}>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaUser />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name"
                                                className={`w-full h-12 pl-10 pr-4 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm`}
                                                value={formData.name}
                                                onChange={handleInputChange}

                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1 pl-2">{errors.name}</p>}
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaEnvelope />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                className={`w-full h-12 pl-10 pr-4 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm`}
                                                value={formData.email}
                                                onChange={handleInputChange}

                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 pl-2">{errors.email}</p>}
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaLock />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                className={`w-full h-12 pl-10 pr-10 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm`}
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
                                            {errors.password && <p className="text-red-500 text-xs mt-1 pl-2">{errors.password}</p>}
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <FaLock />
                                            </div>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="Confirm Password"
                                                className={`w-full h-12 pl-10 pr-4 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-sm focus:outline-none focus:border-[#c23535] focus:bg-white transition-colors text-sm`}
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}

                                            />
                                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 pl-2">{errors.confirmPassword}</p>}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <input
                                                type="checkbox"
                                                className="accent-[#c23535]"
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            />
                                            <span>I agree to the <a href="#" onClick={(e) => { e.preventDefault(); openTerms(); }} className="hover:text-[#c23535]">Terms & Privacy Policy</a></span>
                                        </div>

                                        <button disabled={loading} className="w-full h-12 bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md disabled:opacity-70">
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