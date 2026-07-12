import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestedIn: ''
  });
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/services`);
        setServices(res.data);
        // Default to Select Event
        setFormData(prev => ({ ...prev, interestedIn: 'Select Event' }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.interestedIn,
        message: `I am interested in ${formData.interestedIn}.`
      };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/inquiries`, payload);
      navigate('/thank-you?type=contact');
    } catch (error) {
      console.error(error);
      alert('There was an error sending your message. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-playfair font-bold text-5xl md:text-6xl text-white uppercase tracking-widest mb-4">Contact Us</h1>
          <p className="font-sans text-gray-400 text-sm tracking-[0.2em] uppercase">Get in touch with Imazen Studios</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl"
        >
          {sessionStorage.getItem('portfolioMode') === 'true' ? (
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl text-center max-w-md mx-auto my-12">
              <p className="text-white font-sans text-sm tracking-widest uppercase mb-2">
                You have entered here from the Saiprasanth portfolio or LinkedIn.
              </p>
              <p className="text-gray-400 text-xs font-sans">
                Contact submissions are disabled in this preview mode.
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Your Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 tracking-widest mb-2">Interested In</label>
                <select 
                  required
                  value={formData.interestedIn}
                  onChange={(e) => setFormData({...formData, interestedIn: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-white focus:bg-white/5 outline-none transition-all font-sans appearance-none cursor-pointer"
                >
                  <option value="Select Event" className="bg-[#111] text-white">Select Event</option>
                  {services.map(s => (
                    <option key={s._id} value={s.name} className="bg-[#111] text-white">{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-white text-black font-playfair text-sm font-bold uppercase tracking-[0.3em] hover:bg-transparent hover:text-white border border-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
