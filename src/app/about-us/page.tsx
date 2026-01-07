"use client";
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useBannerStore } from '@/store/useBannerStore';

const AboutUs: React.FC = () => {
    const router = useRouter();
    const [pageSections, setPageSections] = React.useState<any[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { banners, fetchBanners, loading: bannerLoading } = useBannerStore();

    const getImageUrl = (path: string | undefined, fallback: string) => {
        if (!path) return fallback;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:8000';
        // Remove 'uploads/' from path if it's already there since baseUrl/uploads might be the pattern
        // The backend seems to store the full relative path including 'uploads' or just the filename.
        // Based on bannerController: current[part] = files[field][0].path;
        // which usually includes 'uploads\' or similar.
        const normalizedPath = path.replace(/\\/g, '/');
        if (normalizedPath.startsWith('uploads/')) {
            return `${baseUrl}/${normalizedPath}`;
        }
        return `${baseUrl}/uploads/${normalizedPath}`;
    };

    const DEFAULT_ABOUT_SECTIONS = [
        { type: "bannerone", sortOrder: 1, status: "active" },
        { type: "bannertwo", sortOrder: 2, status: "active" },
        { type: "bannerthree", sortOrder: 3, status: "active" },
    ];

    React.useEffect(() => {
        const fetchSections = async () => {
            try {
                // Fetch layout sections
                const response = await fetch('http://localhost:8000/api/v1/layout-builder?page=about');
                if (!response.ok) {
                    setPageSections(DEFAULT_ABOUT_SECTIONS);
                } else {
                    const data = await response.json();
                    if (data.success) {
                        const activeSections = data.data.filter((s: any) => s.status === 'active');
                        setPageSections(activeSections.length > 0 ? activeSections : DEFAULT_ABOUT_SECTIONS);
                    } else {
                        setPageSections(DEFAULT_ABOUT_SECTIONS);
                    }
                }

                // Fetch content for banners
                await fetchBanners();
            } catch (error: any) {
                console.warn('Backend fetch failed, using default sections:', error);
                setPageSections(DEFAULT_ABOUT_SECTIONS);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

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

    const renderSection = (type: string) => {
    const b1 = banners?.aboutBanner?.bannerOne;
    const b2 = banners?.aboutBanner?.bannerTwo;
    const b3 = banners?.aboutBanner?.bannerThree;

    switch (type) {
        case 'bannerone':
            return (
                <div key="bannerone">
                    {/* --- WELCOME SECTION (already dynamic) --- */}
                    <div className="flex flex-col lg:flex-row items-center lg:px-20 lg:pt-20 gap-5 pb-0 lg:gap-20 bg-white">
                        <div className="lg:w-[60%] p-5 mt-4 space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-[2px] bg-[#c23535]"></div>
                                <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">
                                    {b1?.subtitle || "Welcome to Bluebell"}
                                </span>
                            </div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-[20px] md:text-[28px] lg:text-[38px] font-serif text-[#283862] font-bold leading-tight"
                            >
                                {b1?.title || "Our Resort has been present for over 20 years."}
                            </motion.h2>
                            {b1?.ckEditor ? (
                                <div
                                    className="text-gray-500 text-[10px] md:text-[12px] lg:text-[16px] leading-relaxed ck-content banner-description"
                                    dangerouslySetInnerHTML={{ __html: b1.ckEditor }}
                                />
                            ) : (
                                <>
                                    <p className="text-[#283862] font-serif italic text-[18px] md:text-[20px] lg:text-[25px] font-medium">
                                        We make the best for all our customers.
                                    </p>
                                    <p className="text-gray-500 text-[10px] md:text-[12px] lg:text-[16px] leading-relaxed">
                                        Our objective at Bluebell is to bring together our visitor's societies and spirits with our own...
                                    </p>
                                </>
                            )}
                            <div className="flex items-center gap-8 pt-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={getImageUrl(b1?.userImage, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop")}
                                        alt="Manager"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-[#c23535] p-0.5"
                                    />
                                    <div>
                                        <h4 className="text-[#283862] font-bold text-[10px] md:text-[17px] lg:text-[20px]">
                                            {b1?.userName || "Kahey Kemey"}
                                        </h4>
                                        <span className="text-[#c23535] text-[10px] md:text-[17px] lg:text-[20px] font-bold uppercase tracking-wider">
                                            {b1?.position || "Resort Manager"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-[40%] p-5 relative">
                            <div className="relative rounded-sm overflow-hidden h-[400px] lg:h-[600px] w-full shadow-xl">
                                <img
                                    src={getImageUrl(b1?.image, "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop")}
                                    alt="Resort View"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'bannertwo':
            return (
                <div key="bannertwo" className="bg-white py-20 lg:px-20">
                    {/* --- WHY CHOOSE US --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-12 h-[2px] bg-[#c23535]"></div>
                            <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">Our Features</span>
                            <div className="w-12 h-[2px] bg-[#c23535]"></div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#283862] font-bold">
                            {b2?.title || "Why Choose Us"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-6 max-w-2xl mx-auto leading-relaxed">
                            {b2?.descriptionTwo || b2?.descriptionOne || "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share."}
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-10 p-4 lg:flex-row lg:gap-20">
                        <div className="w-full lg:w-1/2 relative flex justify-center lg:block">
                            <div className="relative w-full h-[300px] lg:h-[400px]">
                                <img
                                    src={getImageUrl(b2?.backgroundImage, "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop")}
                                    className="w-full h-full object-cover rounded-lg"
                                    alt="Main feature"
                                />
                            </div>
                            <div className="bg-white shadow-lg rounded-md p-3 text-center w-[240px] mt-6 lg:mt-35 lg:absolute lg:top-[25px] lg:left-30">
                                <img
                                    src={getImageUrl((b2?.cardImages || [])[0]?.url, "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?q=80&w=2525&auto=format&fit=crop")}
                                    className="h-[180px] w-full object-cover rounded"
                                    alt="Card"
                                />
                                <div className="flex justify-center gap-1 mt-3">
                                    <h3 className="text-[20px] font-bold">{b2?.cardTitle || "1350+"}</h3>
                                    <span className="text-[20px] font-semibold text-[#00000075]">{b2?.highlightedCardTitle || "Visitors"}</span>
                                </div>
                                <span className="block text-[18px] font-semibold text-[#00000075]">Come Annually</span>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <p className="text-[#283862] font-serif italic text-lg mb-6 leading-relaxed">
                                {b2?.descriptionOne || "At Bluebell, we understand the different expectations of visitors. We feel elated when you come back for the second time!"}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
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
            );

        case 'bannerthree':
            return (
                <div key="bannerthree" className="w-full flex flex-col lg:flex-row p-5 lg:p-[50px] gap-8 lg:gap-[30px] bg-[#283862]">
                    <div className="w-full lg:w-[55%]">
                        <div className="flex items-center mt-5 gap-3 mb-2">
                            <div className="w-12 h-[2px] bg-[#c23535]"></div>
                            <span className="text-[#c23535] text-xs font-bold tracking-[0.2em] uppercase">
                                {b3?.subtitle || "ABOUT US"}
                            </span>
                        </div>
                        <h3 className="text-[22px] lg:text-[40px] font-bold text-white mb-6 font-serif">
                            {b3?.title || "The Story of Behind Our Resort"}
                        </h3>
                        <p className="text-sm lg:text-[17px] text-white mb-6 leading-relaxed">
                            {b3?.descriptionOne || "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own..."}
                        </p>
                        <div className="h-[250px] lg:h-[380px]">
                            <img
                                className="rounded-[8px] w-full h-full object-cover"
                                src={getImageUrl(b3?.imageOne , "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop")}
                                alt="Story image 1"
                            />
                        </div>
                    </div>
                    <div className="w-full lg:w-[45%] mt-8 lg:mt-5">
                        <img
                            className="w-full h-[250px] lg:h-[520px] rounded-[8px] object-cover"
                            src={getImageUrl(b3?.imageTwo, "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")}
                            alt="Story image 2"
                        />
                        <p className="text-sm lg:text-[17px] text-white mb-6 mt-6 leading-relaxed">
                            {b3?.descriptionTwo || "Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share."}
                        </p>
                        <a href="#"><span className="text-red-500 font-semibold">Read More</span></a>
                    </div>
                </div>
            );

        default:
            return null;
    }
};

    return (
        <section className="w-full   pb-20 min-h-screen">

            {/* --- HEADER --- */}
            <div className="bg-[#283862] h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px] text-white px-4 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Header" />
                </div>
                <div className="absolute inset-0 bg-black/60"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 flex flex-col items-center justify-center h-full text-center"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-serif font-bold mb-3 md:mb-4 drop-shadow-lg">About</h1>
                    <div className="flex justify-center items-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
                        <span className="hover:text-[#c23535] cursor-pointer transition-colors" onClick={() => router.push('/')}>Home</span>
                        <span>/</span>
                        <span className="text-white">About</span>
                    </div>
                </motion.div>
            </div>

            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c23535]"></div>
                </div>
            ) : error ? (
                <div className="w-full h-screen flex flex-col items-center justify-center p-10 text-center">
                    <h3 className="text-2xl font-bold text-red-600 mb-4">Connection Issue</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-400">Please ensure the backend server is running on port 8000.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-[#c23535] text-white px-6 py-2 rounded shadow hover:bg-red-700 transition"
                    >
                        Retry
                    </button>
                </div>
            ) : pageSections.length > 0 ? (
                pageSections.map((section: any) => renderSection(section.type))
            ) : (
                <div className="w-full h-screen flex items-center justify-center">
                    <p className="text-gray-500">No content available.</p>
                </div>
            )}
        </section>
    );
};

export default AboutUs;
