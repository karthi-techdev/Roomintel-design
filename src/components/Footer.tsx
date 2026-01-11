"use client";

import { useState } from "react";
import Link from "next/link";
import { PiHouseLineBold } from "react-icons/pi";
import { FaArrowRight, FaArrowUp } from "react-icons/fa";
import Image from "next/image";
import logoImg from "../../public/Navbar-Logo.png"
import axiosInstance from "../api/axiosInstance";
import { useSettingsStore } from "../store/useSettingsStore";
import { getImageUrl } from "../utils/getImage";

export default function Footer() {
    const { settings } = useSettingsStore();

    const images = [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=500&auto=format&fit=crop", // Hut
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=500&auto=format&fit=crop", // Bedroom
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=500&auto=format&fit=crop", // Hammock
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500&auto=format&fit=crop", // Hotel
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=500&auto=format&fit=crop", // Swing
        "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=500&auto=format&fit=crop"  // Gazebo
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubscribe = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setMessage(null);
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }
        setSubmitting(true);
        try {
            // Backend createSubscriber requires several fields; provide sensible defaults for newsletter signup
            const payload = {
                email: email.toLowerCase(),
                name: email.split('@')[0] || 'Subscriber',
                profileType: 'Advertiser',
                companyName: 'Individual',
                position: 'Subscriber',
            };
            const res = await axiosInstance.post('/subscribers', payload);
            if (res?.data?.status === 'success' || res?.status === 201 || res?.status === 200) {
                setMessage('Thanks! Your email has been saved.');
                setEmail('');
            } else {
                setMessage('Subscription failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Subscribe error:', err);
            const msg = err?.response?.data?.message || err?.message || 'Subscription failed';
            setMessage(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <footer className="bg-[#0B121C] pt-20 pb-8 relative text-white  ">
                {/* Top Images */}
                <div className="max-w-[1400px] mx-auto px-6 lg:px-16 mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-lg overflow-hidden group">
                                <img src={img} alt="Resort" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8 mb-20">
                        {/* Brand & Contact */}
                        <div className="flex flex-col gap-8">
                            <div className="flex gap-2 h-auto w-auto">
                                <img
                                    src={getImageUrl(settings?.siteLogo, logoImg.src)}
                                    alt={settings?.siteName || "Room Intel Logo"}
                                    className="object-contain transition-all rounded-4xl duration-300 h-20 w-auto"
                                />
                            </div>

                            <div className="flex flex-col gap-4 text-sm text-gray-400">
                                <div className="grid grid-cols-[90px_1fr]">
                                    <span className="font-bold text-white">Tel :</span>
                                    <span>000-111-222-3333</span>
                                </div>
                                <div className="grid grid-cols-[90px_1fr]">
                                    <span className="font-bold text-white">Email :</span>
                                    <span>info@example.com</span>
                                </div>
                                <div className="grid grid-cols-[90px_1fr]">
                                    <span className="font-bold text-white">Location :</span>
                                    <span>256, Resort Street, New York<br />Blue Beach, 8974</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:pl-10">
                            <h3 className="text-2xl noto-geogia-font font-bold mb-8">Quick Links</h3>
                            <ul className="flex flex-col gap-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-brand-red transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-brand-red transition-colors">Boutique Apartment</a></li>
                                <li><a href="#" className="hover:text-brand-red transition-colors">Jungle Safari Resort</a></li>
                                <li><a href="#" className="hover:text-brand-red transition-colors">Mountain Chalet</a></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-2xl noto-geogia-font font-bold mb-4">Sign up for our newsletter to receive special offers, news and events.</h3>
                            <form onSubmit={handleSubscribe} className="mt-8 relative">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full h-[60px] bg-transparent border border-gray-700 rounded-sm px-6 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-colors"
                                    disabled={submitting}
                                />
                                <button type="submit" disabled={submitting} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red transition-colors">
                                    <FaArrowRight />
                                </button>
                                {message && <p className="mt-3 text-sm text-gray-300">{message}</p>}
                            </form>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-dashed border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative">
                        <p className="text-gray-500 text-sm text-center md:text-left">© Copyright Room Intel. All right reserved.</p>
                        <button
                            onClick={scrollToTop}
                            className="w-12 h-12 z-1000 bg-[#c23535] cursor-pointer rounded-full text-white flex items-center justify-center transition-all shadow-lg fixed bottom-4 right-4"
                        >
                            <FaArrowUp />
                        </button>
                    </div>
                </div>
            </footer>
        </>
    );
}
