"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaBed, FaBook, FaMoneyBillWave, FaNewspaper, FaEnvelope, 
  FaList, FaCog, FaBars, FaTimes, FaSearch, FaBell, FaUserCircle, 
  FaPlus, FaEdit, FaTrash, FaCheck, FaImage, FaSave, FaUsers, 
  FaStar, FaGlobe, FaPaperPlane, FaInfoCircle, FaEllipsisV, 
  FaArrowUp, FaArrowDown, FaFilter, FaDownload, FaClock, FaCamera,
  FaCreditCard, FaPaypal, FaMoneyBill, FaLink, FaMapMarkerAlt, FaPhoneAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES & INTERFACES ---

interface Booking { id: string; guestName: string; email: string; roomType: string; checkIn: string; checkOut: string; status: 'Confirmed' | 'Pending' | 'Checked Out' | 'Cancelled'; amount: number; date: string; }
interface Room { id: number; name: string; category: string; price: number; status: 'Available' | 'Booked' | 'Maintenance'; image: string; guests: number; size: number; }
interface BlogPost { id: number; title: string; author: string; category: string; date: string; status: 'Published' | 'Draft'; image: string; excerpt: string; }
interface Enquiry { id: number; name: string; email: string; subject: string; date: string; status: 'New' | 'Read' | 'Replied'; message: string; }
interface Transaction { id: string; guest: string; date: string; amount: number; method: 'Credit Card' | 'PayPal' | 'Cash'; status: 'Paid' | 'Pending' | 'Refunded'; }
interface Staff { id: number; name: string; role: string; image: string; }
interface Review { id: number; user: string; rating: number; comment: string; status: 'Approved' | 'Pending'; date: string; }
interface HeroSlide { id: number; title: string; subtitle: string; image: string; }
interface FooterLink { id: number; label: string; url: string; }

// --- INITIAL MOCK DATA ---

const initialBookings: Booking[] = [
  { id: 'BK-1001', guestName: 'John Doe', email: 'john@example.com', roomType: 'Oceanfront Suite', checkIn: '2023-12-24', checkOut: '2023-12-28', status: 'Confirmed', amount: 2450, date: '2023-12-01' },
  { id: 'BK-1002', guestName: 'Sarah Smith', email: 'sarah@example.com', roomType: 'Mountain Retreat', checkIn: '2023-12-25', checkOut: '2023-12-30', status: 'Pending', amount: 1800, date: '2023-12-02' },
  { id: 'BK-1003', guestName: 'Michael Brown', email: 'mike@example.com', roomType: 'Family Villa', checkIn: '2023-12-20', checkOut: '2023-12-22', status: 'Checked Out', amount: 950, date: '2023-11-28' },
  { id: 'BK-1004', guestName: 'Emily Davis', email: 'emily@example.com', roomType: 'Cozy Cabin', checkIn: '2024-01-05', checkOut: '2024-01-10', status: 'Confirmed', amount: 1200, date: '2023-12-05' },
];

const initialRooms: Room[] = [
  { id: 1, name: 'Ocean View 101', category: 'Luxury', price: 450, status: 'Available', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', guests: 2, size: 45 },
  { id: 2, name: 'Mountain 202', category: 'Classic', price: 210, status: 'Booked', image: 'https://images.unsplash.com/photo-1512918760532-3ed465901861?w=400', guests: 3, size: 55 },
  { id: 3, name: 'Garden 305', category: 'Family', price: 380, status: 'Maintenance', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400', guests: 4, size: 70 },
  { id: 4, name: 'City Loft 404', category: 'Business', price: 180, status: 'Available', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400', guests: 1, size: 35 },
];

const initialTransactions: Transaction[] = [
  { id: 'TRX-5542', guest: 'John Doe', date: 'Dec 20, 2023', amount: 2450, method: 'Credit Card', status: 'Paid' },
  { id: 'TRX-5543', guest: 'Sarah Smith', date: 'Dec 21, 2023', amount: 500, method: 'PayPal', status: 'Pending' },
  { id: 'TRX-5544', guest: 'Michael Brown', date: 'Dec 22, 2023', amount: 950, method: 'Cash', status: 'Paid' },
];

const initialStaff: Staff[] = [
  { id: 1, name: "Dona Mona", role: "House Keeping", image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200" },
  { id: 2, name: "John Michale", role: "Manager", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200" },
];

const initialReviews: Review[] = [
  { id: 1, user: "Alice Walker", rating: 5, comment: "Amazing stay! The view was breathtaking.", status: "Approved", date: "2023-12-20" },
  { id: 2, user: "Bob Martin", rating: 4, comment: "Great service but wifi was slow.", status: "Pending", date: "2023-12-22" },
];

const initialPosts: BlogPost[] = [
  { id: 1, title: 'Top 10 Things to Do in Aurora', author: 'Admin', category: 'Travel', date: '2023-11-15', status: 'Published', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200', excerpt: 'Discover the hidden gems of Aurora with our comprehensive guide.' },
  { id: 2, title: 'Our New Spa Services', author: 'Manager', category: 'Wellness', date: '2023-12-01', status: 'Draft', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200', excerpt: 'Relax and rejuvenate with our newly introduced spa treatments.' },
];

const initialEnquiries: Enquiry[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', subject: 'Wedding Venue Enquiry', date: '2023-12-22', status: 'New', message: 'Hi, I am looking for a venue for 100 guests. Do you have availability in June?' },
  { id: 2, name: 'Robert Fox', email: 'robert@example.com', subject: 'Corporate Event Booking', date: '2023-12-20', status: 'Replied', message: 'We need conference rooms for 3 days with catering services.' },
];

const initialHeroSlides: HeroSlide[] = [
  { id: 1, title: "Mountains Legacy Stay", subtitle: "Food indulgence in mind, come next door...", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400" },
  { id: 2, title: "Oceanfront Paradise", subtitle: "Wake up to the sound of waves...", image: "https://images.unsplash.com/photo-1571896349842-6e53ce41e887?w=400" },
];

const initialFooterLinks: FooterLink[] = [
  { id: 1, label: "About Us", url: "/about" },
  { id: 2, label: "Terms & Conditions", url: "/terms" },
  { id: 3, label: "Privacy Policy", url: "/privacy" },
];

// --- HELPER COMPONENTS ---

const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 right-6 bg-[#283862] text-white px-6 py-3 rounded-lg shadow-xl z-[100] flex items-center gap-3 border-l-4 border-[#c23535]">
      <FaCheck className="text-[#c23535] bg-white rounded-full p-1 text-lg" /> <span className="font-medium text-sm">{message}</span>
    </motion.div>
  );
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; onSave?: () => void }> = ({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#283862]/60 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#283862]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-[#c23535] transition-colors"><FaTimes /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
        {onSave && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button onClick={onSave} className="px-6 py-2 text-sm font-bold text-white bg-[#c23535] hover:bg-[#a12b2b] rounded-lg shadow-md transition-colors">Save Changes</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStyle = (s: string) => {
    switch(s.toLowerCase()) {
      case 'confirmed': case 'paid': case 'published': case 'available': case 'replied': case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': case 'draft': case 'booked': case 'new': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': case 'refunded': case 'maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };
  return <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStyle(status)}`}>{status}</span>;
};

const StatCard: React.FC<{ title: string; value: string; trend?: string; trendUp?: boolean; icon: React.ReactNode; color: string }> = ({ title, value, trend, trendUp, icon, color }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color} rounded-bl-3xl`}><div className="text-6xl">{icon}</div></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shadow-md ${color}`}>{icon}</div>
      {trend && <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{trendUp ? <FaArrowUp size={10} className="mr-1"/> : <FaArrowDown size={10} className="mr-1"/>}{trend}</div>}
    </div>
    <div className="relative z-10"><h3 className="text-2xl font-bold text-[#283862] mb-1">{value}</h3><p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p></div>
  </motion.div>
);

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; hasSubMenu?: boolean }> = ({ icon, label, isActive, onClick, hasSubMenu }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden group ${isActive ? 'text-white bg-[#283862] shadow-md' : 'text-gray-500 hover:bg-[#283862]/5 hover:text-[#283862]'}`}>
    <div className="flex items-center gap-4">
      {isActive && <motion.div layoutId="activeSidebar" className="absolute left-0 top-0 bottom-0 w-1 bg-[#c23535]" />}
      <span className={`text-lg transition-colors ${isActive ? 'text-[#c23535]' : 'text-gray-400 group-hover:text-[#283862]'}`}>{icon}</span>
      <span>{label}</span>
    </div>
    {hasSubMenu && <FaArrowDown className={`text-xs transition-transform ${isActive ? 'rotate-180' : ''}`} />}
  </button>
);

// --- MAIN COMPONENT ---

const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  
  // CMS Specific Data
  const [cmsSection, setCmsSection] = useState('hero');
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(initialFooterLinks);
  const [siteSettings, setSiteSettings] = useState({ title: 'Bluebell Resort', email: 'contact@bluebell.com', phone: '+1 234 567 890', address: '2624 Sampson Street, Aurora, CO', maintenanceMode: false, logo: '', metaTitle: 'Bluebell Resort | Luxury Stay', metaDesc: 'Experience luxury...', keywords: 'resort, hotel, luxury' });
  const [aboutContent, setAboutContent] = useState("Our objective at Bluebell is to bring together our visitor's societies and spirits...");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'room' | 'post' | 'staff' | 'slide' | 'link' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // --- ACTIONS ---

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const deleteItem = (id: string | number, type: string) => {
    if(!window.confirm('Are you sure you want to delete this item?')) return;
    if(type === 'booking') setBookings(prev => prev.filter(b => b.id !== id));
    if(type === 'room') setRooms(prev => prev.filter(r => r.id !== id));
    if(type === 'post') setPosts(prev => prev.filter(p => p.id !== id));
    if(type === 'enquiry') setEnquiries(prev => prev.filter(e => e.id !== id));
    if(type === 'staff') setStaff(prev => prev.filter(s => s.id !== id));
    if(type === 'review') setReviews(prev => prev.filter(r => r.id !== id));
    if(type === 'slide') setHeroSlides(prev => prev.filter(s => s.id !== id));
    if(type === 'link') setFooterLinks(prev => prev.filter(l => l.id !== id));
    showToast(`${type} deleted successfully.`);
  };

  const handleSave = () => {
    const id = editingItem.id ? editingItem.id : Date.now();
    const newItem = { ...editingItem, id };

    if (modalType === 'room') {
      setRooms(prev => editingItem.id ? prev.map(r => r.id === id ? newItem : r) : [...prev, newItem]);
    } else if (modalType === 'post') {
      setPosts(prev => editingItem.id ? prev.map(p => p.id === id ? newItem : p) : [...prev, newItem]);
    } else if (modalType === 'staff') {
      setStaff(prev => editingItem.id ? prev.map(s => s.id === id ? newItem : s) : [...prev, newItem]);
    } else if (modalType === 'slide') {
      setHeroSlides(prev => editingItem.id ? prev.map(s => s.id === id ? newItem : s) : [...prev, newItem]);
    } else if (modalType === 'link') {
      setFooterLinks(prev => editingItem.id ? prev.map(l => l.id === id ? newItem : l) : [...prev, newItem]);
    }
    
    setIsModalOpen(false);
    showToast('Saved successfully!');
  };

  const openModal = (type: any, item?: any) => {
    setModalType(type);
    setEditingItem(item || {});
    setIsModalOpen(true);
  };

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$124,500" trend="12%" trendUp={true} icon={<FaMoneyBillWave />} color="bg-emerald-500" />
        <StatCard title="Total Bookings" value={bookings.length.toString()} trend="5%" trendUp={true} icon={<FaBook />} color="bg-blue-500" />
        <StatCard title="Active Rooms" value={`${rooms.filter(r => r.status === 'Available').length}/${rooms.length}`} icon={<FaBed />} color="bg-purple-500" />
        <StatCard title="New Enquiries" value={enquiries.filter(e => e.status === 'New').length.toString()} trend="2%" trendUp={false} icon={<FaEnvelope />} color="bg-orange-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"><h3 className="font-bold text-[#283862]">Recent Bookings</h3><button onClick={() => setActiveSection('bookings')} className="text-xs font-bold text-[#c23535] hover:underline">View All</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-white text-gray-400 text-[10px] uppercase font-bold border-b border-gray-100"><tr><th className="px-6 py-4">Guest</th><th className="px-6 py-4">Room</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Amount</th></tr></thead>
              <tbody className="divide-y divide-gray-50">{bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#283862]">{b.guestName}</td>
                  <td className="px-6 py-4">{b.roomType}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-6 py-4 text-right font-bold text-[#283862]">${b.amount}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#283862] rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10"><h3 className="font-bold mb-2">Occupancy Rate</h3><div className="text-4xl font-bold mb-4">78%</div><div className="w-full bg-white/20 h-2 rounded-full"><div className="bg-[#c23535] h-2 rounded-full w-[78%]"></div></div><p className="text-xs text-gray-300 mt-2">Higher than last month</p></div>
            <FaBed className="absolute -bottom-6 -right-6 text-white/10 text-9xl" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-[#283862] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => openModal('room')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-300 hover:border-[#c23535] hover:bg-red-50 text-gray-600 hover:text-[#c23535] text-sm font-bold transition-all"><FaPlus /> Add New Room</button>
              <button onClick={() => openModal('post')} className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-300 hover:border-[#c23535] hover:bg-red-50 text-gray-600 hover:text-[#c23535] text-sm font-bold transition-all"><FaNewspaper /> Write Blog Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCMS = () => {
    const tabs = [
      { id: 'hero', label: 'Hero Carousel' },
      { id: 'hero2', label: 'Hero 2 Carousel' },
      { id: 'team', label: 'Team Members' },
      { id: 'reviews', label: 'Featured Reviews' },
      { id: 'about', label: 'About Us' },
      { id: 'contact', label: 'Contact Us' },
      { id: 'footer', label: 'Footer' },
      { id: 'seo', label: 'Site SEO Settings' },
      { id: 'newsletter', label: 'Newsletter' }
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          <div className="w-full lg:w-64 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-fit">
            <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CMS Sections</div>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setCmsSection(tab.id)} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold mb-1 transition-all flex items-center justify-between ${cmsSection === tab.id ? 'bg-[#283862] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-[#283862]'}`}>{tab.label} <FaArrowDown className={`text-xs transition-transform ${cmsSection === tab.id ? '-rotate-90' : ''}`} /></button>
            ))}
          </div>
          
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 relative">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#283862] capitalize">{tabs.find(t => t.id === cmsSection)?.label} Manager</h3>
              {['about', 'contact', 'seo', 'newsletter'].includes(cmsSection) && <button onClick={() => showToast('Section Saved')} className="bg-[#c23535] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#a12b2b] flex items-center gap-2"><FaSave /> Save Changes</button>}
            </div>

            {/* --- CMS SUB-SECTIONS --- */}
            
            {cmsSection === 'hero' && (
              <div className="space-y-6">
                <button onClick={() => openModal('slide')} className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-400 font-bold text-sm rounded-xl hover:border-[#c23535] hover:text-[#c23535] transition-all flex items-center justify-center gap-2"><FaPlus /> Add New Slide</button>
                <div className="grid gap-6">
                  {heroSlides.map(slide => (
                    <div key={slide.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow flex flex-col md:flex-row h-auto md:h-40">
                      <div className="w-full md:w-64 h-40 bg-gray-200 relative"><img src={slide.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div></div>
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-[#283862] text-lg mb-1">{slide.title}</h4>
                        <p className="text-gray-500 text-sm">{slide.subtitle}</p>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                        <button onClick={() => openModal('slide', slide)} className="w-8 h-8 bg-white rounded-full text-[#283862] flex items-center justify-center shadow-sm hover:bg-[#283862] hover:text-white transition-colors"><FaEdit size={12}/></button>
                        <button onClick={() => deleteItem(slide.id, 'slide')} className="w-8 h-8 bg-white rounded-full text-red-500 flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-colors"><FaTrash size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cmsSection === 'hero2' && (
               <div className="text-center py-20 text-gray-400"><p>Hero 2 Carousel Management (Similar structure to Hero 1)</p></div>
            )}

            {cmsSection === 'team' && (
              <div className="space-y-6">
                <button onClick={() => openModal('staff')} className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-400 font-bold text-sm rounded-xl hover:border-[#c23535] hover:text-[#c23535] transition-all flex items-center justify-center gap-2"><FaPlus /> Add Team Member</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map(s => (
                    <div key={s.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all bg-gray-50">
                      <img src={s.image} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div className="flex-1">
                        <div className="font-bold text-[#283862]">{s.name}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{s.role}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openModal('staff', s)} className="text-gray-400 hover:text-[#283862]"><FaEdit /></button>
                        <button onClick={() => deleteItem(s.id, 'staff')} className="text-gray-400 hover:text-red-500"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cmsSection === 'reviews' && (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#283862]">{r.user}</span>
                        <div className="flex text-yellow-400 text-xs"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-gray-600 italic">"{r.comment}"</p>
                    <div className="flex gap-2 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setReviews(prev => prev.map(rev => rev.id === r.id ? { ...rev, status: 'Approved' } : rev)); showToast('Review Approved'); }} className="text-green-500 bg-green-50 p-2 rounded-full hover:bg-green-100"><FaCheck /></button>
                       <button onClick={() => deleteItem(r.id, 'review')} className="text-red-500 bg-red-50 p-2 rounded-full hover:bg-red-100"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cmsSection === 'about' && (
               <div className="space-y-6">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Heading</label><input type="text" defaultValue="Welcome to Bluebell Resort" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">About Content</label><textarea className="w-full h-48 p-4 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none resize-none" value={aboutContent} onChange={(e) => setAboutContent(e.target.value)}></textarea></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Signature Name</label><input type="text" defaultValue="Kathy A. Xemn" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none font-serif" /></div>
               </div>
            )}

            {cmsSection === 'contact' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Address</label><input type="text" value={siteSettings.address} onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label><input type="text" value={siteSettings.email} onChange={(e) => setSiteSettings({...siteSettings, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone</label><input type="text" value={siteSettings.phone} onChange={(e) => setSiteSettings({...siteSettings, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Map Embed URL</label><input type="text" defaultValue="https://www.google.com/maps/embed?..." className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
               </div>
            )}

            {cmsSection === 'footer' && (
               <div className="space-y-6">
                  <button onClick={() => openModal('link')} className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-400 font-bold text-sm rounded-lg hover:border-[#c23535] hover:text-[#c23535] transition-all flex items-center justify-center gap-2"><FaPlus /> Add Footer Link</button>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                     {footerLinks.map(link => (
                        <div key={link.id} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200 shadow-sm">
                           <span className="text-sm font-bold text-[#283862]">{link.label} <span className="text-gray-400 font-normal text-xs ml-2">({link.url})</span></span>
                           <button onClick={() => deleteItem(link.id, 'link')} className="text-gray-400 hover:text-red-500"><FaTrash size={12}/></button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {cmsSection === 'seo' && (
               <div className="space-y-6 max-w-2xl">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 text-sm text-blue-700"><FaInfoCircle className="mt-1 shrink-0"/><p>These settings affect how your website appears in Google search results.</p></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Meta Title</label><input type="text" value={siteSettings.metaTitle} onChange={(e) => setSiteSettings({...siteSettings, metaTitle: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Meta Description</label><textarea value={siteSettings.metaDesc} onChange={(e) => setSiteSettings({...siteSettings, metaDesc: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm h-24 resize-none focus:border-[#283862] outline-none"></textarea></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Keywords</label><input type="text" value={siteSettings.keywords} onChange={(e) => setSiteSettings({...siteSettings, keywords: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
               </div>
            )}

            {cmsSection === 'newsletter' && (
               <div className="space-y-6">
                  <div className="p-6 bg-white border border-gray-200 rounded-lg text-center">
                     <FaPaperPlane className="text-4xl text-[#c23535] mx-auto mb-4" />
                     <h4 className="font-bold text-[#283862]">Subscribers List</h4>
                     <p className="text-sm text-gray-500 mb-6">Manage your newsletter subscribers and export the list.</p>
                     <button className="bg-[#283862] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#1a2542]"><FaDownload className="inline mr-2"/> Export CSV</button>
                  </div>
               </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex text-[#283862]">
      
      {/* MOBILE BACKDROP */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-[#283862]/50 backdrop-blur-sm z-40 lg:hidden" />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside className={`fixed lg:sticky top-0 left-0 z-50 w-[280px] h-screen bg-white border-r border-gray-200 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-24 flex items-center justify-center border-b border-gray-100 bg-white">
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#283862] text-white rounded-lg flex items-center justify-center text-xl font-serif font-bold">B</div>
              <div><h1 className="text-xl font-serif font-bold text-[#283862] leading-none">Bluebell</h1><span className="text-[10px] uppercase tracking-[0.2em] text-[#c23535] font-bold">Admin Panel</span></div>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar">
           <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Overview</p>
           <SidebarItem icon={<FaHome />} label="Dashboard" isActive={activeSection === 'dashboard'} onClick={() => { setActiveSection('dashboard'); setIsMobileMenuOpen(false); }} />
           
           <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Management</p>
           <SidebarItem icon={<FaBook />} label="Bookings" isActive={activeSection === 'bookings'} onClick={() => { setActiveSection('bookings'); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={<FaBed />} label="Rooms" isActive={activeSection === 'rooms'} onClick={() => { setActiveSection('rooms'); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={<FaMoneyBillWave />} label="Payments" isActive={activeSection === 'payments'} onClick={() => { setActiveSection('payments'); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={<FaEnvelope />} label="Enquiries" isActive={activeSection === 'enquiries'} onClick={() => { setActiveSection('enquiries'); setIsMobileMenuOpen(false); }} />
           
           <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Website</p>
           <SidebarItem icon={<FaList />} label="CMS" isActive={activeSection === 'cms'} onClick={() => { setActiveSection('cms'); setIsMobileMenuOpen(false); }} />
           <SidebarItem icon={<FaNewspaper />} label="Blog" isActive={activeSection === 'blog'} onClick={() => { setActiveSection('blog'); setIsMobileMenuOpen(false); }} />
           
           <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">System</p>
           <SidebarItem icon={<FaCog />} label="Settings" isActive={activeSection === 'settings'} onClick={() => { setActiveSection('settings'); setIsMobileMenuOpen(false); }} />
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50">
           <button onClick={onBack} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-[#c23535] transition-colors py-3 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm">
              <FaTimes /> Log Out
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
         {/* TOP BAR */}
         <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0 z-30 sticky top-0">
            <div className="flex items-center gap-4">
               <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-500 hover:text-[#283862] p-2 rounded-md hover:bg-gray-50"><FaBars size={20} /></button>
               <h2 className="text-lg font-bold text-gray-800 capitalize hidden md:block">{activeSection}</h2>
            </div>
            <div className="flex items-center gap-6">
               <div className="relative hidden md:block">
                  <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#283862] w-64 transition-colors" />
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
               </div>
               <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[#283862] text-white flex items-center justify-center shadow-md"><FaUserCircle size={20} /></div>
                  <div className="text-left hidden md:block"><div className="text-xs font-bold text-gray-900 leading-tight">Admin User</div><div className="text-[10px] text-gray-500 font-medium">Super Admin</div></div>
               </div>
            </div>
         </header>

         {/* CONTENT AREA */}
         <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto w-full">
               {activeSection === 'dashboard' && renderDashboard()}
               
               {activeSection === 'bookings' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-serif font-bold text-[#283862]">Booking Management</h2><button className="bg-[#c23535] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#a12b2b] flex items-center gap-2"><FaDownload /> Export CSV</button></div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                       <div className="p-4 border-b border-gray-100 flex gap-4"><input type="text" placeholder="Search guests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#283862] outline-none" /><button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold"><FaFilter /> Filter</button></div>
                       <table className="w-full text-sm text-left text-gray-500">
                          <thead className="bg-gray-50 text-gray-600 text-[10px] uppercase font-bold border-b border-gray-100"><tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Guest</th><th className="px-6 py-4">Room</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
                          <tbody className="divide-y divide-gray-50">
                             {bookings.filter(b => b.guestName.toLowerCase().includes(searchQuery.toLowerCase())).map(b => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                   <td className="px-6 py-4 font-mono text-xs font-bold text-[#c23535]">{b.id}</td>
                                   <td className="px-6 py-4 font-bold text-[#283862]">{b.guestName}<div className="text-xs font-normal text-gray-400">{b.email}</div></td>
                                   <td className="px-6 py-4">{b.roomType}</td>
                                   <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                                   <td className="px-6 py-4 text-right"><button onClick={() => deleteItem(b.id, 'booking')} className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100"><FaTrash /></button></td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               )}

               {activeSection === 'rooms' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-serif font-bold text-[#283862]">Room Inventory</h2><button onClick={() => openModal('room')} className="bg-[#283862] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#1a2542] flex items-center gap-2"><FaPlus /> Add Room</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {rooms.map(r => (
                          <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                             <div className="relative h-48"><img src={r.image} className="w-full h-full object-cover" /><div className="absolute top-3 right-3"><StatusBadge status={r.status} /></div></div>
                             <div className="p-5">
                                <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-lg text-[#283862]">{r.name}</h3><span className="text-[#c23535] font-bold">${r.price}</span></div>
                                <div className="text-xs text-gray-500 mb-4 flex gap-3"><span><FaUsers className="inline mr-1"/> {r.guests} Guests</span><span><FaBed className="inline mr-1"/> {r.size}m²</span></div>
                                <div className="flex gap-2"><button onClick={() => openModal('room', r)} className="flex-1 bg-gray-50 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-gray-100 border border-gray-200">Edit</button><button onClick={() => deleteItem(r.id, 'room')} className="px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-50"><FaTrash /></button></div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {activeSection === 'payments' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center"><h2 className="text-2xl font-serif font-bold text-[#283862]">Financials</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm"><div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><FaMoneyBillWave /></div><div><div className="text-xs font-bold text-gray-400 uppercase">Revenue</div><div className="text-2xl font-bold text-[#283862]">$124,500</div></div></div>
                       <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm"><div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><FaCreditCard /></div><div><div className="text-xs font-bold text-gray-400 uppercase">Card Sales</div><div className="text-2xl font-bold text-[#283862]">$85,200</div></div></div>
                       <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm"><div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><FaClock /></div><div><div className="text-xs font-bold text-gray-400 uppercase">Pending</div><div className="text-2xl font-bold text-[#283862]">$3,450</div></div></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                       <table className="w-full text-sm text-left text-gray-500">
                          <thead className="bg-gray-50 text-gray-600 text-[10px] uppercase font-bold border-b border-gray-100"><tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Guest</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Method</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4"></th></tr></thead>
                          <tbody className="divide-y divide-gray-50">
                             {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                   <td className="px-6 py-4 font-mono text-xs font-bold text-[#283862]">{t.id}</td>
                                   <td className="px-6 py-4 font-bold">{t.guest}</td>
                                   <td className="px-6 py-4 text-xs">{t.date}</td>
                                   <td className="px-6 py-4 flex items-center gap-2">{t.method === 'PayPal' ? <FaPaypal className="text-blue-600"/> : t.method === 'Credit Card' ? <FaCreditCard className="text-gray-600"/> : <FaMoneyBill className="text-green-600"/>} {t.method}</td>
                                   <td className="px-6 py-4 font-bold text-[#283862]">${t.amount}</td>
                                   <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                                   <td className="px-6 py-4 text-right"><button onClick={() => deleteItem(t.id, 'transaction')} className="text-gray-400 hover:text-red-500"><FaTrash /></button></td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               )}

               {activeSection === 'blog' && (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center"><h2 className="text-2xl font-serif font-bold text-[#283862]">Blog Posts</h2><button onClick={() => openModal('post')} className="bg-[#c23535] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#a12b2b] flex items-center gap-2"><FaPlus /> Create Post</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {posts.map(p => (
                          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col hover:shadow-lg transition-all">
                             <div className="relative h-40"><img src={p.image} className="w-full h-full object-cover" /><div className="absolute top-2 left-2"><StatusBadge status={p.status} /></div></div>
                             <div className="p-5 flex-1 flex flex-col">
                                <div className="text-xs font-bold text-[#c23535] uppercase mb-1">{p.category}</div>
                                <h3 className="font-bold text-[#283862] mb-2 leading-tight">{p.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{p.excerpt}</p>
                                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100"><button onClick={() => openModal('post', p)} className="flex-1 bg-gray-50 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-[#283862] hover:text-white transition-colors">Edit</button><button onClick={() => deleteItem(p.id, 'post')} className="px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><FaTrash /></button></div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {activeSection === 'enquiries' && (
                 <div className="space-y-6 animate-fade-in">
                    <h2 className="text-2xl font-serif font-bold text-[#283862]">Enquiries</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                       {enquiries.map(e => (
                          <div key={e.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                             <div className="flex justify-between items-start mb-2"><div className="flex items-center gap-3"><span className={`w-2 h-2 rounded-full ${e.status === 'New' ? 'bg-blue-500' : 'bg-gray-300'}`}></span><h4 className="font-bold text-[#283862]">{e.subject}</h4><StatusBadge status={e.status}/></div><span className="text-xs text-gray-400">{e.date}</span></div>
                             <p className="text-sm text-gray-600 mb-3 pl-5">{e.message}</p>
                             <div className="flex justify-between items-center pl-5"><div className="text-xs text-gray-500">From: <strong>{e.name}</strong> ({e.email})</div><div className="flex gap-3"><button className="text-xs font-bold text-[#283862] hover:underline">Reply</button><button onClick={() => deleteItem(e.id, 'enquiry')} className="text-xs font-bold text-red-500 hover:underline">Delete</button></div></div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {activeSection === 'cms' && renderCMS()}

               {activeSection === 'settings' && (
                 <div className="space-y-6 animate-fade-in max-w-3xl">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-serif font-bold text-[#283862]">Configuration</h2><button onClick={() => showToast('Settings Saved')} className="bg-[#283862] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-[#1a2542]">Save All</button></div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                       <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Site Title</label><input type="text" value={siteSettings.title} onChange={e => setSiteSettings({...siteSettings, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Contact Email</label><input type="email" value={siteSettings.email} onChange={e => setSiteSettings({...siteSettings, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                          <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label><input type="text" value={siteSettings.phone} onChange={e => setSiteSettings({...siteSettings, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                       </div>
                       <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                          <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${siteSettings.maintenanceMode ? 'bg-[#c23535]' : 'bg-gray-300'}`} onClick={() => setSiteSettings({...siteSettings, maintenanceMode: !siteSettings.maintenanceMode})}><div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${siteSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div></div>
                          <div><div className="text-sm font-bold text-[#283862]">Maintenance Mode</div><div className="text-xs text-gray-500">Disable public access to the site.</div></div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
         </main>
      </div>

      {/* --- REUSABLE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'room' ? (editingItem.id ? "Edit Room" : "Add Room") : modalType === 'post' ? "Manage Post" : modalType === 'staff' ? "Team Member" : modalType === 'slide' ? "Hero Slide" : "Footer Link"} onSave={handleSave}>
             <div className="space-y-4">
                {/* ROOM FORM */}
                {modalType === 'room' && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Room Name</label><input type="text" value={editingItem.name || ''} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Price ($)</label><input type="number" value={editingItem.price || ''} onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Category</label><select value={editingItem.category || 'Luxury'} onChange={(e) => setEditingItem({...editingItem, category: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none bg-white"><option value="Luxury">Luxury</option><option value="Classic">Classic</option><option value="Family">Family</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Guests</label><input type="number" value={editingItem.guests || 2} onChange={(e) => setEditingItem({...editingItem, guests: Number(e.target.value)})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Status</label><select value={editingItem.status || 'Available'} onChange={(e) => setEditingItem({...editingItem, status: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none bg-white"><option value="Available">Available</option><option value="Booked">Booked</option><option value="Maintenance">Maintenance</option></select></div>
                    </div>
                  </>
                )}
                {/* POST FORM */}
                {modalType === 'post' && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input type="text" value={editingItem.title || ''} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Category</label><input type="text" value={editingItem.category || ''} onChange={(e) => setEditingItem({...editingItem, category: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Status</label><select value={editingItem.status || 'Draft'} onChange={(e) => setEditingItem({...editingItem, status: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none bg-white"><option value="Draft">Draft</option><option value="Published">Published</option></select></div>
                    </div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Excerpt</label><textarea value={editingItem.excerpt || ''} onChange={(e) => setEditingItem({...editingItem, excerpt: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm h-24 resize-none focus:border-[#283862] outline-none" /></div>
                  </>
                )}
                {/* STAFF FORM */}
                {modalType === 'staff' && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Name</label><input type="text" value={editingItem.name || ''} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Role</label><input type="text" value={editingItem.role || ''} onChange={(e) => setEditingItem({...editingItem, role: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                  </>
                )}
                {/* HERO SLIDE FORM */}
                {modalType === 'slide' && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Heading</label><input type="text" value={editingItem.title || ''} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Sub-Heading</label><textarea value={editingItem.subtitle || ''} onChange={(e) => setEditingItem({...editingItem, subtitle: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm h-24 resize-none focus:border-[#283862] outline-none" /></div>
                  </>
                )}
                {/* LINK FORM */}
                {modalType === 'link' && (
                  <>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Label</label><input type="text" value={editingItem.label || ''} onChange={(e) => setEditingItem({...editingItem, label: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">URL</label><input type="text" value={editingItem.url || ''} onChange={(e) => setEditingItem({...editingItem, url: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#283862] outline-none" /></div>
                  </>
                )}
             </div>
          </Modal>
        )}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
