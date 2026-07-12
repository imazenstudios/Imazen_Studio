import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/testimonials`)
      .then(res => {
        setTestimonials(res.data);
      })
      .catch(console.error);
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative w-full py-24 bg-[#0a0a0a] text-white flex flex-col items-center">
      <h2 className="font-playfair uppercase text-white text-5xl md:text-6xl mb-16 md:mb-24 text-center tracking-wide">
        Testimonials
      </h2>

      <div className="w-full max-w-4xl mx-auto px-12 relative flex items-center justify-center">
        
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={30}
          loop={testimonials.length > 1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            prevEl: '.swiper-button-prev-testimonial',
            nextEl: '.swiper-button-next-testimonial',
          }}
          pagination={{ clickable: true, el: '.swiper-pagination-testimonial' }}
          className="w-full h-[300px] md:h-[250px]"
        >
          {testimonials.map((current, i) => (
            <SwiperSlide key={i} className="flex flex-col items-center justify-center text-center">
              <p className="font-sans text-base md:text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                "{current.reviewText}"
              </p>
              
              <div className="flex text-white mb-6 text-[10px] gap-3 justify-center">
                {[...Array(current.rating || 5)].map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
              
              <h3 className="font-sans text-gray-500 uppercase tracking-[0.2em] text-[9px] md:text-[10px] mb-4 text-center">
                {current.authorName}
              </h3>

              {current.googleReviewUrl && (
                <a 
                  href={current.googleReviewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-sans font-bold mt-2"
                >
                  G <span className="font-medium tracking-[0.2em]">VERIFIED GOOGLE REVIEW</span> &#8599;
                </a>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation */}
        <button className="swiper-button-prev-testimonial absolute left-2 md:left-4 text-[#a0a0a0] hover:text-white transition-colors text-3xl font-light z-10">
          &#8249;
        </button>
        
        <button className="swiper-button-next-testimonial absolute right-2 md:right-4 text-[#a0a0a0] hover:text-white transition-colors text-3xl font-light z-10">
          &#8250;
        </button>

      </div>
      
      {/* Pagination Container */}
      <div className="swiper-pagination-testimonial mt-12 flex justify-center gap-2"></div>

    </section>
  );
};

export default Testimonials;
