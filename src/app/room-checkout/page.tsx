"use client";
import React, { useState } from 'react';
import { FaCheck, FaLock, FaShieldAlt, FaCreditCard, FaMoneyBill, FaPaypal, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700']
});

interface RoomCheckoutProps {
  onBack: () => void;
  onPlaceOrder: () => void;
}

const RoomCheckout: React.FC<RoomCheckoutProps> = ({ onBack, onPlaceOrder }) => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReturnToCart = () => {
    // This will redirect to the room-cart page
    router.push('/room-cart');
  };

  const handleGoToHome = () => {
    // This will redirect to the homepage
    router.push('/');
  };

  return (
    <div className="w-full font-sans min-h-screen bg-gray-50">

      <div className="bg-[#283862] pt-24 lg:pt-32 pb-16 lg:pb-26 text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop"
            className="w-full h-full object-cover" alt="Header" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold mb-4">Complete Your Booking</h1>
          <div className="flex justify-center items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-300">
            <span className="hover:text-[#c23535] cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: BILLING DETAILS */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#283862] to-[#1c2a4a] p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h2 className={`${playfair.className} text-xl md:text-2xl font-bold`}>Billing Information</h2>
                    <p className="text-sm text-gray-300">Enter your details to complete the booking</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                        placeholder=""
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Postcode
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full h-32 bg-white border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c23535] focus:border-transparent transition-all resize-none"
                      placeholder="Special requests or notes about your booking..."
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#283862] to-[#1c2a4a] p-6 text-white">
                  <h3 className={`${playfair.className} text-xl font-bold mb-2`}>Booking Summary</h3>
                  <p className="text-sm text-gray-300">Review your order details</p>
                </div>

                <div className="p-6">
                  {/* Room Details */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=400&auto=format&fit=crop"
                        alt="Room"
                        className="w-full h-full cursor-pointer object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#283862]">City Double Room</h4>
                      <div className="text-sm text-gray-500">Check-in: 13 Dec 2025</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#c23535]">$6,510</div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Room Charges</span>
                      <span className="font-medium">$6,510</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Charge</span>
                      <span className="font-medium">$0</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#283862]">Total Amount</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#c23535]">$6,510</div>
                        <div className="text-sm text-gray-500">All charges included</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#283862] mb-4">Payment Method</h3>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'cash', label: 'Pay on Arrival', icon: FaMoneyBill, color: 'bg-green-100 text-green-600' },
                      { id: 'paypal', label: 'PayPal', icon: FaPaypal, color: 'bg-blue-100 text-blue-600' },
                      { id: 'card', label: 'Credit Card', icon: FaCreditCard, color: 'bg-purple-100 text-purple-600' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === method.id
                            ? 'border-[#c23535] bg-[#c23535]/5'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === method.id ? 'border-[#c23535]' : 'border-gray-300'
                          }`}>
                          {paymentMethod === method.id && (
                            <div className="w-2 h-2 rounded-full bg-[#c23535]"></div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="hidden"
                        />
                        <div className={`w-8 h-8 rounded-lg ${method.color} flex items-center justify-center`}>
                          <method.icon />
                        </div>
                        <span className={`font-medium ${paymentMethod === method.id ? 'text-[#283862]' : 'text-gray-700'}`}>
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Security Note */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <FaLock className="text-[#c23535]" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-[#283862]">Secure Payment</span>
                      <div>Your payment information is encrypted</div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={onPlaceOrder}
                    className="w-full mt-6 cursor-pointer py-4 bg-gradient-to-r from-[#c23535] to-[#a82d2d] hover:from-[#283862] hover:to-[#1c2a4a] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Complete Booking
                  </button>
                </div>
              </div>

              {/* Security Guarantee */}
              <div className="bg-gradient-to-r from-[#283862] to-[#1c2a4a] rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <FaShieldAlt className="text-xl" />
                  <h4 className="font-bold">Booking Guarantee</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <FaCheck className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Free cancellation up to 24 hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Best price guarantee</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaCheck className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleReturnToCart} // This goes to room-cart
            className="inline-flex items-center cursor-pointer gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:border-[#c23535] hover:text-[#c23535] rounded-lg transition-colors font-medium"
          >
            <FaArrowLeft /> Return to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCheckout;