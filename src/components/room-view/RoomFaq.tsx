import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface RoomFaqProps {
    faqs: { question: string; answer: string }[];
}

const RoomFaq: React.FC<RoomFaqProps> = ({ faqs }) => {
    const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

    return (
        <div className="space-y-3">
            {faqs.length > 0 ? (
                faqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#34425a] rounded-sm overflow-hidden">
                        <button
                            onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                            className="w-full flex justify-between items-center p-4 text-left transition-colors bg-[#3f4e66] hover:bg-[#4a5a75]"
                        >
                            <span className="font-bold text-white text-xs md:text-sm pr-4">{faq.question}</span>
                            <div className="w-6 h-6 rounded-full bg-[#EDA337] flex items-center justify-center text-[#283862] text-xs shrink-0">
                                {activeAccordion === idx ? <FaMinus /> : <FaPlus />}
                            </div>
                        </button>
                        <AnimatePresence>
                            {activeAccordion === idx && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 text-xs md:text-sm text-gray-300 bg-[#34425a] border-t border-gray-600/50 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm">No FAQs available at the moment.</p>
            )}
        </div>
    );
};

export default RoomFaq;
