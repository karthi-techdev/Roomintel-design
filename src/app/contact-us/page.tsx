"use client";

import React, { useEffect, useState } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { Playfair_Display } from 'next/font/google';
import { useContactUsStore } from "@/store/useContactUsStore";

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactUs: React.FC = () => {
  const {
    contact,
    isLoading,
    fetchSettings,
    isSubmitting,
    isSubmitted,
    submitError,
    successMessage,
    submitContactForm,
    resetSubmission,
  } = useContactUsStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const addressLines = contact?.address?.split(",") || [];

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await submitContactForm(formData);

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoading && !contact) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading contact information...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-0 min-h-screen">
      {/* Header */}
      <div className="bg-[#283862] pt-40 pb-20 md:pt-56 md:pb-36 text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Header background"
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-7xl noto-geogia-font font-bold mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <div className="flex justify-center items-center gap-3 text-xs md:text-sm font-bold tracking-widest uppercase text-gray-200">
            <span className="hover:text-[#c23535] cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span className="text-white">Contact Us</span>
          </div>
        </div>
      </div>

      <div className="relative h-3 w-3/4 mx-auto bg-gradient-to-r from-transparent via-[#d6d6d6] to-transparent rounded-full"></div>

      {/* Main Content */}
      <div className="bg-white max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-12 md:py-16 lg:py-24 rounded-[20px] relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-32">
          {/* Left: Form */}
          <div className="w-full lg:w-2/3">
            <div className="flex items-baseline gap-4 mb-6 md:mb-8">
              <div className="w-8 md:w-12 h-[2px] bg-[#c23535]"></div>
              <span className="text-[#c23535] text-xs md:text-sm font-bold tracking-[0.1em] uppercase">
                Get In Touch
              </span>
            </div>

            <h2 className={`${playfair.className} text-2xl md:text-3xl lg:text-5xl text-[#0e2a4e] font-[800] mb-6 md:mb-10`}>
              Drop a message for any query
            </h2>

            <p className="text-gray-500 text-sm md:text-base lg:text-[17px] mb-8 md:mb-10 leading-relaxed max-w-2xl">
              Our objective at Bluebell is to bring together our visitor's societies and spirits with our own, communicating enthusiasm and liberality in the food we share.
            </p>

            {/* Success Message */}
            {isSubmitted && successMessage && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 text-green-800 rounded-lg text-center">
                <p className="font-semibold">{successMessage}</p>
                <button
                  onClick={() => {
                    resetSubmission();
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    setErrors({});
                  }}
                  className="mt-4 text-green-700 underline hover:text-green-900"
                >
                  Send another message
                </button>
              </div>
            )}

            {/* Server Error */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                {submitError}
              </div>
            )}

            {/* Form */}
            {!isSubmitted && (
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold rounded-sm text-sm text-gray-700 placeholder-gray-500 focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-400 focus:border-[#c23535]'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 pl-2">{errors.name}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold rounded-sm text-sm text-gray-700 placeholder-gray-500 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-400 focus:border-[#c23535]'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 pl-2">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold border-gray-400 rounded-sm text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:border-[#c23535] transition-colors"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full h-[50px] md:h-[60px] px-4 md:px-6 bg-white border font-semibold border-gray-400 rounded-sm text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:border-[#c23535] transition-colors"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Write a message *"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full h-36 md:h-48 p-4 md:p-6 bg-white border font-semibold rounded-sm text-sm text-gray-700 placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-400 focus:border-[#c23535]'
                    }`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1 pl-2">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#c23535] hover:bg-[#a12b2b] text-white font-bold h-[45px] md:h-[55px] px-6 md:px-10 rounded-sm text-xs md:text-[11px] tracking-[0.2em] uppercase transition-all shadow-md hover:shadow-lg w-full md:w-auto disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send A Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact Info */}
          <div className="w-full lg:w-1/3 space-y-6 md:space-y-8 lg:pt-8">
            <div>
              <h3 className="text-xl md:text-2xl noto-geogia-font font-bold text-[#283862] mb-4 md:mb-6 flex items-baseline gap-3 md:gap-4">
                Bluebell Resort <span className="w-8 md:w-12 h-[1px] bg-[#283862]"></span>
              </h3>
              <div className="text-black text-sm md:text-base lg:text-[17px] space-y-2 font-light leading-relaxed pl-1">
                {addressLines.map((part, idx) => (
                  <React.Fragment key={idx}>
                    {part.trim()}
                    {idx < addressLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
                <p className="hover:text-[#c23535] transition-colors cursor-pointer mt-4">
                  {contact?.contactEmail || "contact@bluebellresort.com"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl noto-geogia-font font-bold text-[#283862] mb-4 md:mb-6 flex items-baseline gap-3 md:gap-4">
                Reception Phone No. <span className="w-8 md:w-12 h-[1px] bg-[#283862]"></span>
              </h3>
              <div className="flex items-center gap-3 text-[#c23535] text-base md:text-lg font-bold mb-3 md:mb-4 pl-1">
                <FaPhoneAlt className="text-xs md:text-sm" />
                {contact?.contactPhone || "+1 (555) 123-4567"}
              </div>
              <div className="text-black text-sm md:text-base lg:text-[17px] space-y-1 font-light pl-1">
                <p>Check in: {contact?.checkIn || "2:00"} PM</p>
                <p>Check out: {contact?.checkOut || "11:00"} AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mx-4 sm:mx-5 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] my-4 sm:my-5 rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.653494796331!2d-104.8016466846244!3d39.74737607944855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7c5936c4b375%3A0x6e7f8e3f2214373a!2sAurora%2C%20CO%2080014%2C%20USA!5e0!3m2!1sen!2s!4v1641888800000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Bluebell Resort Location"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;