import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';

const About = () => {
  const [content, setContent] = useState(null);
  
  const containerRef = useRef(null);
  
  // Parallax configuration
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const yImage = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/content`)
      .then(res => {
        const aboutContent = res.data.find(c => c.section === 'About');
        if (aboutContent) setContent(aboutContent);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section ref={containerRef} id="about" className="relative bg-[#050505] text-white py-32 overflow-hidden">
      
      {/* Background Image with CSS Parallax (bg-fixed) */}
      {content?.backgroundImageUrl && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60 pointer-events-none z-0"
            style={{ backgroundImage: `url('${content.backgroundImageUrl}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/40 to-[#050505] z-0 pointer-events-none"></div>
        </>
      )}



      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative h-[60vh] lg:h-[80vh] w-full group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none"></div>
            <motion.img 
              src={content?.imageUrl || "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=1400&auto=format&fit=crop"} 
              alt="About Twilight Studios" 
              className="w-full h-full object-cover transition-all duration-1000"
            />
            {/* Elegant corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-white/30 z-20"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/30 z-20"></div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h4 className="font-sans text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-gray-500"></span>
                Behind The Lens
              </h4>
              
              <h2 className="font-oswald font-bold text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-widest leading-[1.1] mb-10">
                {content?.title || "Crafting Timeless Narratives"}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="space-y-6 border-l border-white/10 pl-8 ml-2"
            >
              <p className="text-gray-400 font-sans text-sm md:text-base tracking-wide leading-relaxed font-light flex items-center gap-2">
                <a href="https://www.astitvacreations.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 underline underline-offset-4 decoration-white/50 transition-colors inline-flex items-center gap-2">
                  Twilight studio is the sub brand of the Astitva creations
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </a>
              </p>
              <p className="text-gray-400 font-sans text-sm md:text-base tracking-wide leading-relaxed font-light">
                {content?.description || "At Twilight Studios, we believe every fleeting moment holds a cinematic masterpiece. We specialize in transforming maternity, newborn, and family portraits into breathtaking visual stories. Our approach blends high-fashion editorial aesthetics with raw, authentic emotion."}
              </p>
              
              {content?.features && content.features.length > 0 && (
                <ul className="mt-8 space-y-4">
                  {content.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs font-sans tracking-[0.2em] text-gray-300 uppercase">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-4 opacity-50"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-10">
                <a href="/gallery" className="inline-block border-b border-white pb-2 text-[10px] font-sans text-white uppercase tracking-[0.4em] hover:text-gray-400 hover:border-gray-400 transition-colors">
                  Explore Our Work
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
