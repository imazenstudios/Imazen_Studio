import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar'; // Just the top logo header if needed, but we can make it standalone
import axios from 'axios';

const ReferenceLandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', interestedIn: 'Baby Shoot' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads`, { 
        ...formData, 
        landingPageSource: 'Reference Baby Photography' 
      });
      window.location.href = '/thank-you?type=lead';
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Error submitting form. Please try again.');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-rose-500/30">
      
      {/* HEADER / NAVIGATION */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Link to="/">
          <img src="/images/logo3.png" alt="Imazen Studios" className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full font-oswald uppercase tracking-widest text-sm transition-all"
        >
          Book Now
        </button>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] sm:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/about_bg.jpeg" 
            alt="Beautiful Baby Photography" 
            className="w-full h-full object-cover opacity-60 scale-105 transform hover:scale-100 transition-transform duration-[10s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/20" />
        </div>

        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="relative z-10 text-center max-w-4xl px-4"
        >
          <motion.h2 variants={fadeInUp} className="text-rose-400 font-oswald uppercase tracking-[0.3em] text-sm sm:text-base mb-4 drop-shadow-md">
            Imazen Studios
          </motion.h2>
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl md:text-7xl font-oswald font-bold uppercase tracking-tight leading-[1.1] mb-6 drop-shadow-xl">
            Beautiful Baby Photography
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl sm:text-2xl font-light italic text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            "Your Baby's Smile, Captured Forever as Art."
          </motion.p>
          <motion.p variants={fadeInUp} className="text-sm sm:text-base text-gray-300 uppercase tracking-widest mb-12 max-w-2xl mx-auto border-y border-white/10 py-4">
            Professional baby shoots with stunning themes and complete safety.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="text-left">
              <span className="block text-xs text-gray-400 uppercase tracking-widest mb-1">🏷️ Packages Start From Just</span>
              <span className="block text-3xl font-oswald text-rose-300">₹3,999/-</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-oswald uppercase tracking-widest text-lg rounded-full overflow-hidden transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                👉 Book Your Shoot Now
              </span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. WHAT WE DO BEST */}
      <section className="py-24 bg-[#0a0a0a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-oswald uppercase tracking-widest mb-4">What We Do Best</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-transparent mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-500"
            >
              <div className="h-64 overflow-hidden relative">
                <img src="/images/experience_bg.jpeg" alt="Newborn Shoot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
              </div>
              <div className="p-8 relative z-10 -mt-16">
                <span className="text-xs text-rose-400 font-oswald uppercase tracking-widest mb-2 block">5-15 Days</span>
                <h3 className="text-2xl font-oswald uppercase tracking-wider mb-3">Newborn Shoots</h3>
                <p className="text-gray-400 font-light leading-relaxed">Safe, sleepy, and beautiful poses capturing their earliest moments.</p>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-500"
            >
              <div className="h-64 overflow-hidden relative">
                <img src="/images/mobile.jpeg" alt="Milestone Shoot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
              </div>
              <div className="p-8 relative z-10 -mt-16">
                <span className="text-xs text-rose-400 font-oswald uppercase tracking-widest mb-2 block">1-12 Months</span>
                <h3 className="text-2xl font-oswald uppercase tracking-wider mb-3">Milestone Shoots</h3>
                <p className="text-gray-400 font-light leading-relaxed">Capturing sitting up, crawling, first teeth, and all the micro-milestones.</p>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-500"
            >
              <div className="h-64 overflow-hidden relative">
                <img src="/images/banner_bg.webp" alt="Toddler Shoot" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
              </div>
              <div className="p-8 relative z-10 -mt-16">
                <span className="text-xs text-rose-400 font-oswald uppercase tracking-widest mb-2 block">1 Year+</span>
                <h3 className="text-2xl font-oswald uppercase tracking-wider mb-3">Toddler Shoots</h3>
                <p className="text-gray-400 font-light leading-relaxed">Fun-filled first birthday and messy cake smash celebrations.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. WHY PARENTS LOVE OUR STUDIO & 4. PURE COMFORT */}
      <section className="py-24 relative overflow-hidden bg-[#111]">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-900/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Why Parents Love Us */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-oswald uppercase tracking-widest mb-12 flex items-center gap-4">
                <span className="w-8 h-1 bg-rose-500"></span> Why Parents Love Us
              </motion.h2>
              
              <div className="space-y-8">
                {[
                  { title: '40+ Premium Themes', desc: 'Amazing, hand-crafted setups designed for every mood and imagination.' },
                  { title: 'Certified Newborn Wraps', desc: 'Done by trained professionals ensuring 100% safety and baby comfort.' },
                  { title: 'Cinematic Video & Editing', desc: 'Premium-grade videos and high-end photo retouching.' },
                  { title: 'Premium Albums', desc: 'Beautiful printed albums and elegant wall frames to decorate your home.' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">✓</div>
                    <div>
                      <h4 className="text-lg font-oswald uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-gray-400 font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pure Comfort */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-oswald uppercase tracking-widest mb-12 flex items-center gap-4 text-rose-300">
                <span className="w-8 h-1 bg-rose-300"></span> Pure Comfort for Mother & Baby
              </motion.h2>
              
              <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] rounded-full" />
                
                <div className="space-y-8 relative z-10">
                  {[
                    { icon: '❄️', title: '100% AC Studio', desc: 'Perfectly temperature-controlled and dust-free environment.' },
                    { icon: '🤱', title: 'Private Nursing Room', desc: 'A dedicated, quiet space for baby feeding, resting, and makeup.' },
                    { icon: '🕊️', title: 'Super Patient Team', desc: 'We work completely around your baby\'s natural nap and feeding time.' }
                  ].map((item, i) => (
                    <motion.div key={i} variants={fadeInUp} className="flex gap-6 items-start">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h4 className="text-lg font-oswald uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-gray-400 font-light">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. FINAL CTA BANNER */}
      <section className="relative py-32 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img src="/images/studio.jpeg" alt="Studio" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-black/80 to-[#0a0a0a]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl px-4"
        >
          <h2 className="text-4xl sm:text-6xl font-oswald uppercase tracking-widest mb-6">Affordable Premium Baby Shoot</h2>
          <div className="text-3xl font-oswald text-rose-400 mb-8 border-y border-rose-500/30 py-6 inline-block">
            Starts From Just ₹3,999/-
          </div>
          <p className="text-lg text-gray-300 font-light mb-12">
            Access to custom themes, wraps, and our professional team without breaking your budget.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-12 py-5 bg-white text-black font-oswald uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-colors rounded-full text-lg shadow-xl"
          >
            Claim Your Spot Now
          </button>
        </motion.div>
      </section>

      <Footer />

      {/* LEAD CAPTURE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 p-8 sm:p-12 rounded-3xl max-w-md w-full relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <h3 className="text-2xl font-oswald uppercase tracking-widest mb-2 text-white">Book Your Shoot</h3>
              <p className="text-rose-400 text-sm tracking-widest uppercase mb-8">Packages from ₹3,999/-</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-oswald uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Callback'}
                </button>
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-wider mt-4">
                  We'll call you to discuss themes & availability
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ReferenceLandingPage;
