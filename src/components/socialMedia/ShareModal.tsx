import React, { useState } from 'react';
import { FaWhatsapp, FaFacebook, FaTelegram, FaTwitter, FaCopy, FaTimes, FaCheck } from 'react-icons/fa';


interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-[#283862] uppercase tracking-tighter">Share this Room</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">

                    {/* Link Input Section */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Link</label>
                        <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <input
                                type="text"
                                value={shareUrl}
                                disabled
                                className="flex-1 bg-transparent px-3 text-sm text-slate-500 font-medium outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${copied ? 'bg-green-500 text-white' : 'bg-[#283862] text-white hover:bg-[#c23535]'
                                    }`}
                            >
                                {copied ? <FaCheck /> : <FaCopy />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Social Icons Row */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Share via social media</label>
                        <div className="flex justify-between items-center px-4">
                            <a href={`https://wa.me/?text=${shareUrl}`} target="_blank" className="flex flex-col items-center gap-2 group">
                                <div className="p-4 bg-green-50 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                                    <FaWhatsapp size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</span>
                            </a>

                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="flex flex-col items-center gap-2 group">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <FaFacebook size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Facebook</span>
                            </a>

                            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" className="flex flex-col items-center gap-2 group">
                                <div className="p-4 bg-slate-50 text-slate-900 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <FaTwitter size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">X (Twitter)</span>
                            </a>

                            <a href={`https://t.me/share/url?url=${shareUrl}`} target="_blank" className="flex flex-col items-center gap-2 group">
                                <div className="p-4 bg-sky-50 text-sky-500 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                                    <FaTelegram size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Telegram</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;