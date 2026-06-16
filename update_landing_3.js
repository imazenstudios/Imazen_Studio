const fs = require('fs');

const content = `import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import NotFound from './NotFound';

// Component to handle cloudinary optimization if available
const optimizeCloudinaryUrl = (url, isMobile = false) => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transform = isMobile ? 'c_fill,g_auto,w_800,q_auto,f_auto' : 'q_auto,f_auto';
      return \`\${parts[0]}/upload/\${transform}/\${parts[1]}\`;
    }
  }
  return url;
};

// Helper for alignment classes
const getTextAlignClass = (align) => {
  if (align === 'left') return 'text-left items-start';
  if (align === 'right') return 'text-right items-end';
  return 'text-center items-center'; // center is default
};

// Hero Carousel Component
const HeroCarousel = ({ slides, align }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x;
            if (swipe < -50) {
              nextSlide();
            } else if (swipe > 50) {
              prevSlide();
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Desktop Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{ backgroundImage: \`url(\${optimizeCloudinaryUrl(slides[currentSlide].imageUrl)})\` }}
          />
          {/* Mobile Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center block md:hidden"
            style={{ backgroundImage: \`url(\${optimizeCloudinaryUrl(slides[currentSlide].mobileImageUrl || slides[currentSlide].imageUrl, true)})\` }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#030303]"></div>
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className={\`relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 flex flex-col h-full justify-center \${getTextAlignClass(align)}\`}>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}
              className="font-oswald font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-[0.1em] text-white drop-shadow-2xl mb-4 pointer-events-none"
            >
              {slides[currentSlide].heading}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}
              className="font-sans text-sm md:text-base tracking-[0.2em] text-white/80 uppercase max-w-2xl pointer-events-none"
            >
              {slides[currentSlide].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {slides.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 md:px-12 z-20 pointer-events-none">
          <button onClick={prevSlide} className="pointer-events-auto text-white/50 hover:text-white text-4xl transition-colors">&lt;</button>
          <button onClick={nextSlide} className="pointer-events-auto text-white/50 hover:text-white text-4xl transition-colors">&gt;</button>
        </div>
      )}
    </div>
  );
};

// Lead Modal Component
const LeadModal = ({ isOpen, onClose, sourcePageSlug }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventDate: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads\`, { ...formData, landingPageSource: sourcePageSlug });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', phone: '', eventDate: '' });
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0a0a] border border-white/10 p-8 w-full max-w-md rounded-2xl shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white text-xl">&times;</button>
        <h2 className="font-oswald text-2xl text-white uppercase tracking-widest mb-6 text-center">Begin Your Journey</h2>
        
        {status === 'success' ? (
          <div className="text-center text-emerald-400 py-8 font-sans tracking-wide">
            Thank you! We will be in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
              <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
              <input required type="email" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Phone</label>
              <input required type="tel" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Event Date</label>
              <input required type="date" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
            </div>
            <button type="submit" disabled={status === 'submitting'} className="w-full py-4 mt-4 bg-[#B89859] hover:bg-white text-black font-oswald text-sm uppercase tracking-[0.2em] rounded-xl transition-colors disabled:opacity-50">
              {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const LandingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [packages, setPackages] = useState([]);
  
  // Floating UI visibility
  const [showFloatingUI, setShowFloatingUI] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Parallax ref
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating UI when scrolled past viewport
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowFloatingUI(true);
      } else {
        setShowFloatingUI(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const res = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/landing-pages/\${slug}\`);
        setPageData(res.data);
        
        if (res.data.showTestimonials) {
          const tRes = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/testimonials\`);
          setTestimonials(tRes.data);
        }

        if (res.data.showPackages) {
          const pRes = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/services\`);
          setPackages(pRes.data);
        }
      } catch (err) {
        console.error(err);
        setError('Landing page not found');
      } finally {
        setLoading(false);
      }
    };
    fetchLandingPage();
  }, [slug]);

  // Handle keyboard navigation for galleries
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex !== null && pageData?.portfolioImages) {
        if (e.key === 'ArrowRight') setSelectedImageIndex(prev => (prev === pageData.portfolioImages.length - 1 ? 0 : prev + 1));
        else if (e.key === 'ArrowLeft') setSelectedImageIndex(prev => (prev === 0 ? pageData.portfolioImages.length - 1 : prev - 1));
        else if (e.key === 'Escape') setSelectedImageIndex(null);
      } else if (selectedVideoIndex !== null && pageData?.portfolioVideos) {
        if (e.key === 'ArrowRight') setSelectedVideoIndex(prev => (prev === pageData.portfolioVideos.length - 1 ? 0 : prev + 1));
        else if (e.key === 'ArrowLeft') setSelectedVideoIndex(prev => (prev === 0 ? pageData.portfolioVideos.length - 1 : prev - 1));
        else if (e.key === 'Escape') setSelectedVideoIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, selectedVideoIndex, pageData]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-oswald tracking-[0.5em] space-y-6">
      <div className="w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-full animate-spin"></div>
      <span className="opacity-50 text-sm">PREPARING EXPERIENCE</span>
    </div>
  );
  if (error || !pageData) return <NotFound />;

  // Filter packages based on selected packages in admin
  const displayPackages = packages.filter(pkg => pageData.selectedPackages?.includes(pkg._id));

  // Default fallback if no slides are added yet
  const heroSlides = pageData.heroSlides?.length > 0 ? pageData.heroSlides : [{ heading: pageData.name, description: 'Welcome to our exclusive experience', imageUrl: pageData.heroImage || '' }];

  return (
    <div className="bg-[#030303] min-h-screen text-white overflow-x-hidden selection:bg-white/20 selection:text-white font-sans">
      
      <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} sourcePageSlug={pageData.slug || pageData.name} />

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen w-full bg-black">
        <HeroCarousel slides={heroSlides} align={pageData.heroTextAlign} />

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
        >
          <div className="w-[1px] h-16 bg-white/20 overflow-hidden relative">
            <motion.div 
              animate={{ y: [0, 64, 64] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
            />
          </div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/50 mt-4">Scroll</span>
        </motion.div>
      </section>

      {/* 2. DISPLAY VIDEO SECTION (Lightbox triggering) */}
      {pageData.displayVideoUrl && (
        <section className="relative py-24 px-6 max-w-7xl mx-auto flex justify-center">
          <div className="w-full aspect-video bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer" onClick={() => setSelectedVideoIndex(-1)}>
             <video src={pageData.displayVideoUrl} autoPlay muted loop className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center bg-black/50 backdrop-blur-md">
                 <span className="text-white ml-1 text-2xl">▶</span>
               </div>
             </div>
          </div>
        </section>
      )}

      {/* 3. OUR APPROACH */}
      {pageData.approachSection?.heading && (
        <section className={\`py-24 px-6 lg:px-12 max-w-5xl mx-auto border-t border-white/5 flex flex-col \${getTextAlignClass(pageData.approachSection.align)}\`}>
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">Our Approach</h4>
          <h2 className="font-oswald font-light text-4xl md:text-5xl uppercase tracking-[0.1em] mb-10 text-white">
            {pageData.approachSection.heading}
          </h2>
          <p className="font-sans font-light text-white/60 leading-[2] tracking-wide text-sm md:text-base whitespace-pre-line">
            {pageData.approachSection.description}
          </p>
        </section>
      )}

      {/* 4. IMAGES GALLERY (Right to Left Scroll) */}
      {pageData.portfolioImages?.length > 0 && (
        <section className="py-24 border-t border-white/5 overflow-hidden">
          <div className={\`px-6 lg:px-12 mb-12 flex flex-col \${getTextAlignClass(pageData.portfolioImagesAlign)}\`}>
             <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">{pageData.portfolioImagesHeading || 'Our Portfolio'}</h2>
          </div>
          
          <div className="relative flex overflow-hidden group">
            {/* Horizontal Marquee Animation */}
            <motion.div 
              animate={{ x: [0, -1035] }} // Adjust width based on images
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
              className="flex gap-4 px-4"
            >
              {[...pageData.portfolioImages, ...pageData.portfolioImages].map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImageIndex(i % pageData.portfolioImages.length)}
                  className="w-[300px] md:w-[400px] h-[400px] md:h-[500px] flex-shrink-0 cursor-pointer overflow-hidden border border-white/10 relative"
                >
                  <img src={optimizeCloudinaryUrl(img)} alt="Gallery" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 5. WHY CHOOSE IMAZEN (Features) */}
      {pageData.features?.length > 0 && (
        <section className="py-32 px-6 lg:px-12 bg-[#050505]">
          <div className="max-w-[90rem] mx-auto">
            <div className={\`flex flex-col mb-20 \${getTextAlignClass(pageData.featuresAlign)}\`}>
              <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">{pageData.whyChooseHeading || 'Why Choose Imazen?'}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {pageData.features.map((feature, idx) => (
                <div key={idx} className={\`flex flex-col bg-white/5 p-8 border border-white/10 hover:border-white/30 transition-colors \${getTextAlignClass(pageData.featuresAlign)}\`}>
                  <div className="w-8 h-[1px] bg-white/50 mb-6"></div>
                  <h3 className="font-oswald text-xl uppercase tracking-[0.1em] text-white mb-4">{feature.title}</h3>
                  <p className="font-sans font-light text-white/50 text-sm leading-[1.8] tracking-wide whitespace-pre-line">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. VIDEOS GALLERY (Right to Left Scroll) */}
      {pageData.portfolioVideos?.length > 0 && (
        <section className="py-24 border-t border-white/5 overflow-hidden">
          <div className={\`px-6 lg:px-12 mb-12 flex flex-col \${getTextAlignClass(pageData.portfolioVideosAlign)}\`}>
             <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">{pageData.portfolioVideosHeading || 'Memorable Client Stories'}</h2>
          </div>
          
          <div className="relative flex overflow-hidden group">
            {/* Horizontal Marquee Animation for Videos */}
            <motion.div 
              animate={{ x: [0, -1035] }} // Adjust width based on content
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
              className="flex gap-4 px-4"
            >
              {[...pageData.portfolioVideos, ...pageData.portfolioVideos].map((vid, i) => {
                let videoId = '';
                if (vid.includes('youtube.com/watch?v=')) videoId = vid.split('v=')[1]?.split('&')[0];
                else if (vid.includes('youtu.be/')) videoId = vid.split('youtu.be/')[1]?.split('?')[0];
                
                if (!videoId) return null;
                const realIndex = i % pageData.portfolioVideos.length;
                
                return (
                  <div key={i} className="w-[300px] md:w-[500px] aspect-video flex-shrink-0 overflow-hidden border border-white/10 relative cursor-pointer" onClick={() => setSelectedVideoIndex(realIndex)}>
                    {/* Display Thumbnail instead of iframe for performance, open iframe in lightbox */}
                    <img src={\`https://img.youtube.com/vi/\${videoId}/maxresdefault.jpg\`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Video Thumbnail" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-black/50 border border-white/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white text-xl ml-1">▶</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* 7. TESTIMONIALS */}
      {pageData.showTestimonials !== false && testimonials.length > 0 && (
        <section className="py-32 px-6 lg:px-12 bg-black border-t border-white/5 flex flex-col items-center">
          <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white mb-16 text-center">Testimonials</h2>
          <div className="max-w-4xl w-full text-center relative px-12">
            <h1 className="text-8xl font-serif text-white/10 absolute -top-12 left-1/2 -translate-x-1/2">"</h1>
            <p className="font-sans font-light italic text-xl md:text-2xl text-white/80 leading-[1.8] mb-8 relative z-10">"{testimonials[0]?.text}"</p>
            <div className="flex justify-center text-[#B89859] text-sm mb-4 tracking-[0.2em]">★★★★★</div>
            <h4 className="font-oswald uppercase tracking-[0.2em] text-sm text-white">{testimonials[0]?.name}</h4>
          </div>
        </section>
      )}

      {/* 8. PACKAGES */}
      {pageData.showPackages && displayPackages.length > 0 && (
        <section className="py-32 px-6 lg:px-12 bg-[#050505] border-t border-white/5">
          <div className="max-w-[90rem] mx-auto text-center">
            <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white mb-20">Investment</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {displayPackages.map((pkg, idx) => (
                <div key={idx} className="bg-black border border-white/10 hover:border-[#B89859]/50 p-8 flex flex-col transition-all duration-500 hover:-translate-y-2">
                  <h3 className="font-oswald text-xl uppercase tracking-[0.1em] text-white mb-2">{pkg.name}</h3>
                  <p className="font-sans font-light text-white/50 text-sm mb-6 flex-1 line-clamp-4">{pkg.description}</p>
                  <button onClick={() => setIsLeadModalOpen(true)} className="w-full text-center py-3 border border-white/20 hover:bg-white hover:text-black uppercase tracking-[0.2em] text-[10px] font-oswald transition-colors">
                    Inquire
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. READY TO BEGIN YOUR STORY / PARALLAX FOOTER */}
      {pageData.parallaxFooter?.imageUrl && (
        <section ref={parallaxRef} className="relative h-screen w-full flex items-center justify-center border-t border-white/5 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: \`url(\${optimizeCloudinaryUrl(pageData.parallaxFooter.imageUrl)})\`,
              y: parallaxY
            }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className={\`relative z-10 px-6 w-full max-w-5xl flex flex-col \${getTextAlignClass(pageData.parallaxFooter?.align)}\`}>
            <h2 className="font-oswald font-light text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.1em] text-white drop-shadow-2xl mb-8">
              {pageData.parallaxFooter.heading || 'Ready to Begin Your Story?'}
            </h2>
            <p className="font-sans text-sm md:text-base text-white/70 uppercase tracking-[0.2em] max-w-2xl">
              Let's have a conversation about your wedding day. We'd love to learn about your vision.
            </p>
            
            <button onClick={() => setIsLeadModalOpen(true)} className="inline-block mt-12 px-12 py-4 border border-white/30 bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black uppercase tracking-[0.2em] text-xs font-oswald transition-all">
              Book Now
            </button>
          </div>
        </section>
      )}

      {/* FLOATING UI */}
      <AnimatePresence>
        {showFloatingUI && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-8 right-8 flex justify-between items-end z-50 pointer-events-none"
          >
            {/* Styled Up Arrow */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="relative w-14 h-14 rounded-full bg-transparent border border-transparent pointer-events-auto group"
            >
              <div className="absolute inset-0 bg-[#B89859]/30 rounded-full blur-md group-hover:bg-[#B89859]/50 transition-all -translate-y-1 translate-x-1"></div>
              <div className="absolute inset-0 bg-[#B89859] rounded-full flex items-center justify-center border border-white/10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
                <span className="text-white text-xl">↑</span>
              </div>
            </button>

            {/* Book Now Button */}
            <div className="flex flex-col items-end pointer-events-auto">
              <span className="text-[#B89859] font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] mb-2 px-4 py-1 border border-[#B89859] rounded-full bg-black/80 backdrop-blur-md shadow-2xl">
                Hurry, Limited Slots Available!
              </span>
              <button 
                onClick={() => setIsLeadModalOpen(true)}
                className="bg-[#B89859] hover:bg-white text-black px-6 md:px-8 py-3 rounded font-oswald text-xs md:text-sm uppercase tracking-[0.2em] transition-colors shadow-2xl"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && pageData.portfolioImages && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center overflow-hidden"
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl z-[110] p-4" onClick={() => setSelectedImageIndex(null)}>&times;</button>
            <button className="absolute left-8 text-white/50 hover:text-white text-5xl z-[110] p-4" onClick={() => setSelectedImageIndex(prev => (prev === 0 ? pageData.portfolioImages.length - 1 : prev - 1))}>&#8249;</button>
            
            <motion.img 
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -50) setSelectedImageIndex(prev => (prev === pageData.portfolioImages.length - 1 ? 0 : prev + 1));
                else if (offset.x > 50) setSelectedImageIndex(prev => (prev === 0 ? pageData.portfolioImages.length - 1 : prev - 1));
              }}
              key={selectedImageIndex}
              initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
              src={optimizeCloudinaryUrl(pageData.portfolioImages[selectedImageIndex])}
              alt="Fullscreen"
              className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl cursor-grab active:cursor-grabbing"
            />
            
            <button className="absolute right-8 text-white/50 hover:text-white text-5xl z-[110] p-4" onClick={() => setSelectedImageIndex(prev => (prev === pageData.portfolioImages.length - 1 ? 0 : prev + 1))}>&#8250;</button>
            <div className="absolute bottom-8 left-0 right-0 text-center font-sans tracking-[0.5em] uppercase text-[10px] text-white/40">
              {selectedImageIndex + 1} / {pageData.portfolioImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Video Lightbox */}
      <AnimatePresence>
        {selectedVideoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center overflow-hidden"
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl z-[110] p-4" onClick={() => setSelectedVideoIndex(null)}>&times;</button>
            
            {selectedVideoIndex !== -1 && pageData.portfolioVideos && (
               <button className="absolute left-8 text-white/50 hover:text-white text-5xl z-[110] p-4" onClick={() => setSelectedVideoIndex(prev => (prev === 0 ? pageData.portfolioVideos.length - 1 : prev - 1))}>&#8249;</button>
            )}
            
            <motion.div 
              drag={selectedVideoIndex !== -1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset }) => {
                if (selectedVideoIndex !== -1 && pageData.portfolioVideos) {
                  if (offset.x < -50) setSelectedVideoIndex(prev => (prev === pageData.portfolioVideos.length - 1 ? 0 : prev + 1));
                  else if (offset.x > 50) setSelectedVideoIndex(prev => (prev === 0 ? pageData.portfolioVideos.length - 1 : prev - 1));
                }
              }}
              key={selectedVideoIndex}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-[90vw] md:w-[80vw] max-w-6xl aspect-video shadow-2xl bg-black rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
            >
              {selectedVideoIndex === -1 && pageData.displayVideoUrl ? (
                <video src={pageData.displayVideoUrl} autoPlay controls className="w-full h-full object-cover" />
              ) : (
                (() => {
                  const vid = pageData.portfolioVideos[selectedVideoIndex];
                  let videoId = '';
                  if (vid.includes('youtube.com/watch?v=')) videoId = vid.split('v=')[1]?.split('&')[0];
                  else if (vid.includes('youtu.be/')) videoId = vid.split('youtu.be/')[1]?.split('?')[0];
                  
                  return videoId ? (
                    <iframe 
                      className="w-full h-full"
                      src={\`https://www.youtube.com/embed/\${videoId}?autoplay=1&rel=0&modestbranding=1\`}
                      title="Cinematography" frameBorder="0" allowFullScreen
                    ></iframe>
                  ) : null;
                })()
              )}
            </motion.div>
            
            {selectedVideoIndex !== -1 && pageData.portfolioVideos && (
              <button className="absolute right-8 text-white/50 hover:text-white text-5xl z-[110] p-4" onClick={() => setSelectedVideoIndex(prev => (prev === pageData.portfolioVideos.length - 1 ? 0 : prev + 1))}>&#8250;</button>
            )}
            
            {selectedVideoIndex !== -1 && pageData.portfolioVideos && (
              <div className="absolute bottom-8 left-0 right-0 text-center font-sans tracking-[0.5em] uppercase text-[10px] text-white/40">
                {selectedVideoIndex + 1} / {pageData.portfolioVideos.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPage;
`;

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', content, 'utf8');
console.log('Successfully completely rebuilt LandingPage.jsx');
