import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/testimonials`)
      .then(res => {
        setTestimonials(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative w-full py-24 bg-[#0a0a0a] text-white flex flex-col items-center">
      <h2 className="font-serif text-white text-4xl md:text-5xl mb-16 text-center">
        Testimonials
      </h2>

      <div className="max-w-6xl w-full mx-auto px-6 relative flex items-center justify-between">
        
        {/* Left Arrow */}
        <button 
          onClick={handlePrev}
          className="text-white opacity-60 hover:opacity-100 transition-opacity p-2 hidden md:block"
          aria-label="Previous Testimonial"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        {/* Content */}
        <div className="w-full max-w-4xl mx-auto relative h-[300px] md:h-[250px] flex items-center justify-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="font-serif font-light text-xl md:text-3xl text-gray-300 italic mb-10 leading-relaxed max-w-3xl">
                {current.reviewText}
              </p>
              
              <div className="flex text-white mb-6 text-2xl gap-1">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              
              <h3 className="font-sans text-white uppercase tracking-widest text-sm mb-4">
                {current.authorName}
              </h3>

              {current.googleReviewUrl && (
                <a 
                  href={current.googleReviewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-sans"
                >
                  <span className="font-bold">G</span> VERIFIED GOOGLE REVIEW &#8599;
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={handleNext}
          className="text-white opacity-60 hover:opacity-100 transition-opacity p-2 hidden md:block"
          aria-label="Next Testimonial"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

      </div>
      
      {/* Mobile Navigation Arrows */}
      <div className="flex md:hidden gap-12 mt-8">
        <button onClick={handlePrev} className="text-white opacity-60 hover:opacity-100 p-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button onClick={handleNext} className="text-white opacity-60 hover:opacity-100 p-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

    </section>
  );
};

export default Testimonials;
