import React, { useState, useEffect } from 'react';
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
      return `${parts[0]}/upload/${transform}/${parts[1]}`;
    }
  }
  return url;
};

const LandingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'videos'
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/landing-pages/${slug}`);
        setPageData(res.data);
      } catch (err) {
        console.error(err);
        setError('Landing page not found');
      } finally {
        setLoading(false);
      }
    };
    fetchLandingPage();
  }, [slug]);

  // Handle keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null || !pageData?.portfolioImages) return;
      
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev => (prev === pageData.portfolioImages.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev => (prev === 0 ? pageData.portfolioImages.length - 1 : prev - 1));
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, pageData]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-oswald tracking-[0.5em] space-y-6">
      <div className="w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-full animate-spin"></div>
      <span className="opacity-50 text-sm">PREPARING EXPERIENCE</span>
    </div>
  );
  if (error || !pageData) return <NotFound />;

  return (
    <div className="bg-[#030303] min-h-screen text-white overflow-x-hidden selection:bg-white/20 selection:text-white font-sans">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Animated Ken Burns Background */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Desktop Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center hidden md:block"
            style={{ backgroundImage: `url(${optimizeCloudinaryUrl(pageData.heroImage)})` }}
          />
          {/* Mobile Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center block md:hidden"
            style={{ backgroundImage: `url(${optimizeCloudinaryUrl(pageData.mobileHeroImage || pageData.heroImage, true)})` }}
          />
        </motion.div>

        {/* Luxury Gradients & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-black/60 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 flex flex-col items-center justify-center h-full text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl flex flex-col items-center"
          >
            <div className="w-1px h-24 bg-gradient-to-b from-transparent to-white/50 mb-8 origin-bottom"></div>
            <h4 className="text-[10px] md:text-xs font-sans tracking-[0.5em] text-white/70 uppercase mb-6">Exclusive Experience</h4>
            
            <h1 className="font-oswald font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-[0.1em] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 pb-4 drop-shadow-2xl">
              {pageData.name}
            </h1>
            
            {pageData.callToActionLink && (
              <motion.a 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                href={pageData.callToActionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center mt-12 px-12 py-5 font-oswald text-xs uppercase tracking-[0.4em] text-white overflow-hidden transition-all duration-700 ease-out"
              >
                <div className="absolute inset-0 w-full h-full border border-white/30 group-hover:border-white transition-colors duration-500"></div>
                <div className="absolute inset-0 w-0 h-full bg-white transition-all duration-700 ease-out group-hover:w-full"></div>
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">Book Session</span>
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-4">Discover</span>
          <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
            <motion.div 
              animate={{ y: [0, 48, 48] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. EDITORIAL STORY SECTION */}
      {pageData.landingAbout && (pageData.landingAbout.title || pageData.landingAbout.description) && (
        <section className="relative py-32 md:py-48 px-6 lg:px-12 max-w-[100rem] mx-auto overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-[#030303] to-[#030303] pointer-events-none"></div>
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            {/* Story Text */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 lg:col-start-2 order-2 lg:order-1"
            >
              <h4 className="text-[10px] md:text-xs font-sans tracking-[0.5em] text-white/40 uppercase mb-8 flex items-center">
                <span className="w-12 h-[1px] bg-white/40 mr-4"></span> The Philosophy
              </h4>
              <h2 className="font-oswald font-light text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.1em] leading-tight mb-10">
                {pageData.landingAbout.title}
              </h2>
              <div className="prose prose-invert prose-p:font-sans prose-p:text-white/60 prose-p:font-light prose-p:leading-[2] prose-p:tracking-wide">
                <p className="whitespace-pre-wrap text-sm md:text-base">
                  {pageData.landingAbout.description}
                </p>
              </div>
            </motion.div>

            {/* Story Image */}
            {pageData.landingAbout.imageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 order-1 lg:order-2 relative"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 z-10"></div>
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    src={optimizeCloudinaryUrl(pageData.landingAbout.imageUrl)} 
                    alt={pageData.landingAbout.title} 
                    className="w-full h-full object-cover relative z-0" 
                  />
                  {/* Decorative corner lines */}
                  <div className="absolute top-6 left-6 w-12 h-[1px] bg-white/50 z-20 transition-all duration-700 group-hover:w-20"></div>
                  <div className="absolute top-6 left-6 w-[1px] h-12 bg-white/50 z-20 transition-all duration-700 group-hover:h-20"></div>
                  <div className="absolute bottom-6 right-6 w-12 h-[1px] bg-white/50 z-20 transition-all duration-700 group-hover:w-20"></div>
                  <div className="absolute bottom-6 right-6 w-[1px] h-12 bg-white/50 z-20 transition-all duration-700 group-hover:h-20"></div>
                </div>
                {/* Floating blur effect behind image */}
                <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full -z-10 opacity-50"></div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* 3. LUXURY FEATURES SECTION */}
      {pageData.features && pageData.features.length > 0 && (
        <section className="py-32 px-6 lg:px-12 bg-[#050505] relative overflow-hidden">
          {/* Subtle top border gradient */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="max-w-[90rem] mx-auto relative z-10">
            <div className="flex flex-col items-center mb-24 text-center">
              <span className="w-1px h-16 bg-gradient-to-b from-transparent to-white/30 mb-6"></span>
              <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">The Twilight Difference</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {pageData.features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                  className="group flex flex-col"
                >
                  <div className="w-12 h-[1px] bg-white/20 mb-8 transition-all duration-500 group-hover:bg-white group-hover:w-24"></div>
                  <h3 className="font-oswald text-xl uppercase tracking-[0.15em] mb-4 text-white group-hover:text-white/80 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="font-sans font-light text-white/50 text-sm md:text-base leading-[1.8] tracking-wide">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. PREMIUM PORTFOLIO GALLERY */}
      {(pageData.portfolioImages?.length > 0 || pageData.portfolioVideos?.length > 0) && (
        <section className="py-32 px-6 lg:px-12 max-w-[100rem] mx-auto bg-[#030303]">
          
          <div className="flex flex-col items-center mb-20">
            <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white mb-12">Curated Portfolio</h2>
            
            {/* Elegant Tab Switcher */}
            <div className="flex gap-12 border-b border-white/10 pb-4 px-8 relative">
              {pageData.portfolioImages?.length > 0 && (
                <button 
                  onClick={() => setActiveTab('images')}
                  className={`font-sans text-xs uppercase tracking-[0.3em] transition-all duration-500 ${activeTab === 'images' ? 'text-white' : 'text-white/30 hover:text-white/70'}`}
                >
                  Photography
                </button>
              )}
              {pageData.portfolioVideos?.length > 0 && (
                <button 
                  onClick={() => setActiveTab('videos')}
                  className={`font-sans text-xs uppercase tracking-[0.3em] transition-all duration-500 ${activeTab === 'videos' ? 'text-white' : 'text-white/30 hover:text-white/70'}`}
                >
                  Cinematography
                </button>
              )}
              {/* Active Tab Underline */}
              <motion.div 
                layoutId="luxuryTabUnderline" 
                className="absolute bottom-0 h-[1px] bg-white transition-all"
                style={{ 
                  left: activeTab === 'images' ? '2rem' : (pageData.portfolioImages?.length > 0 ? '11rem' : '2rem'),
                  width: activeTab === 'images' ? '5rem' : '7rem'
                }} 
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'images' && pageData.portfolioImages?.length > 0 && (
              <motion.div 
                key="images"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
              >
                {pageData.portfolioImages.map((img, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="relative group overflow-hidden bg-white/5 cursor-pointer break-inside-avoid"
                    onClick={() => setSelectedImageIndex(i)}
                  >
                    <img 
                      src={optimizeCloudinaryUrl(img)} 
                      alt={`Portfolio artwork ${i + 1}`} 
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white text-lg font-light leading-none">+</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'videos' && pageData.portfolioVideos?.length > 0 && (
              <motion.div 
                key="videos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {pageData.portfolioVideos.map((vid, i) => {
                  let videoId = '';
                  if (vid.includes('youtube.com/watch?v=')) {
                    videoId = vid.split('v=')[1]?.split('&')[0];
                  } else if (vid.includes('youtu.be/')) {
                    videoId = vid.split('youtu.be/')[1]?.split('?')[0];
                  } else if (vid.includes('youtube.com/shorts/')) {
                    videoId = vid.split('shorts/')[1]?.split('?')[0];
                  }
                  
                  if (!videoId) return null;
                  
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="aspect-video bg-black rounded-none overflow-hidden border border-white/10 group relative"
                    >
                      <iframe 
                        className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                        title="Cinematography piece" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* 5. ELEGANT FAQS */}
      {pageData.faqs && pageData.faqs.length > 0 && (
        <section className="py-32 px-6 lg:px-12 max-w-4xl mx-auto border-t border-white/10">
          <div className="flex flex-col items-center mb-20 text-center">
            <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">Details & Inquiries</h2>
            <p className="font-sans font-light text-white/40 mt-4 tracking-widest uppercase text-[10px]">What you need to know</p>
          </div>
          <div className="space-y-2">
            {pageData.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border-b border-white/10 overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
                  >
                    <span className={`font-oswald text-lg md:text-xl uppercase tracking-[0.1em] transition-colors duration-500 ${isOpen ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      {faq.question}
                    </span>
                    <span className="relative w-6 h-6 flex items-center justify-center ml-4">
                      <span className={`absolute w-full h-[1px] bg-white/60 transition-transform duration-500 ${isOpen ? 'rotate-180 bg-white' : ''}`}></span>
                      <span className={`absolute w-[1px] h-full bg-white/60 transition-transform duration-500 ${isOpen ? 'rotate-90 scale-0' : ''}`}></span>
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="pb-8 font-sans font-light text-white/50 leading-[2] tracking-wide text-sm md:text-base">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && pageData.portfolioImages && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl z-[110] p-4 transition-colors font-light"
              onClick={() => setSelectedImageIndex(null)}
            >
              &times;
            </button>
            <button 
              className="absolute left-8 text-white/50 hover:text-white text-5xl z-[110] p-4 transition-colors font-light"
              onClick={() => setSelectedImageIndex(prev => (prev === 0 ? pageData.portfolioImages.length - 1 : prev - 1))}
            >
              &#8249;
            </button>
            
            <motion.img 
              key={selectedImageIndex}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              src={optimizeCloudinaryUrl(pageData.portfolioImages[selectedImageIndex])}
              alt="Fullscreen artwork"
              className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl"
            />
            
            <button 
              className="absolute right-8 text-white/50 hover:text-white text-5xl z-[110] p-4 transition-colors font-light"
              onClick={() => setSelectedImageIndex(prev => (prev === pageData.portfolioImages.length - 1 ? 0 : prev + 1))}
            >
              &#8250;
            </button>
            <div className="absolute bottom-8 left-0 right-0 text-center font-sans tracking-[0.5em] uppercase text-[10px] text-white/40">
              {selectedImageIndex + 1} / {pageData.portfolioImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
