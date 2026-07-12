import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Pagination, EffectFade, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../styles/swiper-custom.css';
import Footer from '../components/Footer';


const ReferenceLandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', serviceId: '', subId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [activePackages, setActivePackages] = useState([]);

  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/landing-pages/${slug}`);
        setPageData(res.data);
      } catch (err) {
        console.error(err);
        navigate('/'); // Redirect if not found
      } finally {
        setLoading(false);
      }
    };
    if(slug) fetchLandingPage();
    else setLoading(false);
  }, [slug, navigate]);

  // Use pageData if available, fallback to default hardcoded arrays
  const heroImages = (pageData?.heroSlides && pageData.heroSlides.length > 0) ? pageData.heroSlides.map(s => s.imageUrl) : ['/images/about_bg.jpeg', '/images/experience_bg.jpeg', '/images/studio.jpeg'];


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/services`);
        setServices(res.data);
        // Find packages for display
        let packages = [];
        res.data.forEach(s => {
          if (s.packages && s.packages.length > 0) packages.push(...s.packages);
          s.subServices?.forEach(sub => {
            if (sub.packages && sub.packages.length > 0) packages.push(...sub.packages);
          });
        });
        setActivePackages(packages.slice(0, 6)); // Display up to 6 packages
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
      const selectedService = services.find(s => s.slug === formData.serviceId);
      const selectedSub = selectedService?.subServices?.find(sub => sub.slug === formData.subId);
      
      const payload = { 
        ...formData, 
        interestedIn: selectedSub ? selectedSub.title : (selectedService ? selectedService.title : 'Baby Shoot'),
        landingPageSource: pageData?.name || 'Landing Page' 
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads`, payload);
      navigate('/thank-you?type=lead');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Error submitting form. Please try again.');
    }
  };

  const selectedService = services.find(s => s.slug === formData.serviceId);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  // Static media


  const portfolioImages = (pageData?.portfolioImages && pageData.portfolioImages.length > 0) ? pageData.portfolioImages : ['/images/experience_bg.jpeg', '/images/mobile.jpeg', '/images/banner_bg.webp', '/images/studio.jpeg'];

  const portfolioVideos = (pageData?.portfolioVideos && pageData.portfolioVideos.length > 0) ? pageData.portfolioVideos : ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'];

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  if (!pageData && slug) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Page Not Found</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-gray-500/30 overflow-x-hidden relative">
      
      
      {/* YOUTUBE VIDEO MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 z-[110]"
            >
              &times;
            </button>
            <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BUTTONS */}
      <AnimatePresence>
        {showScrollTop && (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4"
            >
              <div className="bg-transparent text-white border border-white/50 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {pageData?.floatingBubbleText || 'Hurry, Limited Slots Available!'}
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-full font-playfair uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 transition-all animate-bounce"
              >
                {pageData?.floatingButtonText || 'Book Now'}
              </button>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 left-6 z-[60] bg-[#111] hover:bg-[#222] border border-white/20 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100"
            >
              ↑
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={pageData?.logoUrl || "/images/logo.png"} alt="{pageData?.heroSubheading || 'Imazen Studios'}" className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full font-playfair uppercase tracking-widest text-sm transition-all"
        >
          {pageData?.floatingButtonText || 'Book Now'}
        </button>
      </header>

      {/* 1. HERO SECTION (SLIDESHOW) */}
      <section className="relative h-[90vh] sm:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Swiper
              modules={[Autoplay, EffectFade, Keyboard, Navigation]}
              navigation={true}
              effect="fade"
              keyboard={{ enabled: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              fadeEffect={{ crossFade: true }}
              allowTouchMove={true}
              className="w-full h-full [&>.swiper-button-next]:hidden md:[&>.swiper-button-next]:flex [&>.swiper-button-prev]:hidden md:[&>.swiper-button-prev]:flex"
            >
            {heroImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-full">
                  <img src={img} alt="Hero Background" className="w-full h-full object-cover opacity-60 scale-105 transform hover:scale-100 transition-transform duration-[10s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-black/20" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="flex flex-col items-center">
            <h2 className="text-sm sm:text-base font-playfair uppercase tracking-[0.3em] text-gray-400 mb-4 drop-shadow-md">
              {pageData?.heroSubheading || 'Imazen Studios'}
            </h2>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-playfair uppercase tracking-tight leading-[1.1] mb-6 text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <span style={{ whiteSpace: 'pre-line' }}>{pageData?.heroHeading || 'Beautiful Baby\nPhotography'}</span>
            </h1>
          </motion.div>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-lg md:text-2xl font-light text-gray-300 italic max-w-2xl mt-2 mb-10 drop-shadow-md">
            {pageData?.heroQuote || '"Your Baby\'s Smile, Captured Forever as Art."'}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="flex flex-col items-center w-full">
            
            <div className="w-full max-w-3xl border-y border-gray-500/30 py-5 mb-10">
              <p className="text-sm md:text-base font-playfair font-light text-gray-400 uppercase tracking-widest leading-relaxed">
                {pageData?.heroDescription || 'Professional baby shoots with stunning themes and complete safety.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mt-2">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-gray-400 font-playfair uppercase tracking-widest text-xs mb-1">{pageData?.heroPriceText || 'Packages Start From Just'}</span>
                <span className="text-gray-200 font-playfair text-3xl sm:text-4xl">{pageData?.heroPriceAmount || '₹3,999/-'}</span>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-4 bg-white text-black font-playfair uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 rounded-full text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                {pageData?.heroButtonText || 'Book Your Shoot Now'}
              </button>
            </div>
            
          </motion.div>
        </div>
      </section>

      
      {/* 2. INTRO VIDEO */}
      {pageData?.showDisplayVideo !== false && (
        <section className="relative py-24 px-6 max-w-7xl mx-auto flex justify-center">
          <div className="w-full aspect-video bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
              {pageData?.displayVideoUrl ? (
                <video src={pageData.displayVideoUrl} controls autoPlay muted loop className="w-full h-full object-cover cursor-pointer" controlsList="nodownload" onClick={(e) => { if(e.target.requestFullscreen) e.target.requestFullscreen(); else if(e.target.webkitRequestFullscreen) e.target.webkitRequestFullscreen(); }} />
              ) : (
                <video src="/images/intro.mp4" controls autoPlay muted loop className="w-full h-full object-cover cursor-pointer" controlsList="nodownload" onClick={(e) => { if(e.target.requestFullscreen) e.target.requestFullscreen(); else if(e.target.webkitRequestFullscreen) e.target.webkitRequestFullscreen(); }} />
              )}
          </div>
        </section>
      )}

      
      <section className="py-12 px-6 lg:px-12 max-w-5xl mx-auto flex flex-col text-center">
        <h2 className="font-playfair font-light text-4xl md:text-5xl uppercase tracking-[0.1em] mb-4 text-white">
          {pageData?.approachHeading || "Our Approach"}
        </h2>
        <p className="font-sans font-light text-white/60 leading-[2] tracking-wide text-sm md:text-base mb-12">
          {pageData?.approachDescription || "Capturing the purest moments with utmost care and creativity."}
        </p>

        {pageData?.approachSections && pageData.approachSections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {pageData.approachSections.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-black/50 border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all">
                <div className="text-3xl font-playfair text-white/50 mb-4">0{i + 1}</div>
                <h3 className="text-xl font-playfair uppercase tracking-widest mb-3">{item.heading}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">{item.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>


      {/* 3. WHAT WE DO BEST (Swiper Backgrounds) */}
      <section className="py-24 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-playfair uppercase tracking-widest mb-4">{pageData?.serviceCardsHeading || "What We Do Best"}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent mx-auto"></div>
          </motion.div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageData?.serviceCards && pageData.serviceCards.length > 0 ? pageData.serviceCards.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
              >
                <div className="h-80 overflow-hidden relative">
                  {card.images && card.images.length > 0 ? (
                    <Swiper modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 3000, disableOnInteraction: false }} loop={true} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                      {card.images.map((img, i) => (
                        <SwiperSlide key={i}><img src={img} alt={card.title} className="w-full h-full object-cover" /></SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="w-full h-full bg-gray-800"></div>
                  )}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
                </div>
                <div className="p-8 relative z-20 -mt-16">
                  <span className="text-xs text-gray-400 font-playfair uppercase tracking-widest mb-2 block">{card.category}</span>
                  <h3 className="text-2xl font-playfair uppercase tracking-wider mb-3">{card.title}</h3>
                  <p className="text-gray-500 font-light leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            )) : (
              <>
                {/* Fallback Cards */}

            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
            >
              <div className="h-80 overflow-hidden relative">
                <Swiper modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 3000, disableOnInteraction: false }} loop={true} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <SwiperSlide><img src="/images/experience_bg.jpeg" alt="Newborn" className="w-full h-full object-cover" /></SwiperSlide>
                  <SwiperSlide><img src="/images/about_bg.jpeg" alt="Newborn 2" className="w-full h-full object-cover" /></SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
              <div className="p-8 relative z-20 -mt-16">
                <span className="text-xs text-gray-400 font-playfair uppercase tracking-widest mb-2 block">5-15 Days</span>
                <h3 className="text-2xl font-playfair uppercase tracking-wider mb-3">Newborn Shoots</h3>
                <p className="text-gray-500 font-light leading-relaxed">Safe, sleepy, and beautiful poses.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
            >
              <div className="h-80 overflow-hidden relative">
                <Swiper modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 3500, disableOnInteraction: false }} loop={true} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <SwiperSlide><img src="/images/mobile.jpeg" alt="Milestone" className="w-full h-full object-cover" /></SwiperSlide>
                  <SwiperSlide><img src="/images/studio.jpeg" alt="Milestone 2" className="w-full h-full object-cover" /></SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
              <div className="p-8 relative z-20 -mt-16">
                <span className="text-xs text-gray-400 font-playfair uppercase tracking-widest mb-2 block">1-12 Months</span>
                <h3 className="text-2xl font-playfair uppercase tracking-wider mb-3">Milestone Shoots</h3>
                <p className="text-gray-500 font-light leading-relaxed">Capturing sitting up, crawling, and first teeth.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
            >
              <div className="h-80 overflow-hidden relative">
                <Swiper modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 4000, disableOnInteraction: false }} loop={true} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <SwiperSlide><img src="/images/banner_bg.webp" alt="Toddler" className="w-full h-full object-cover" /></SwiperSlide>
                  <SwiperSlide><img src="/images/experience_bg.jpeg" alt="Toddler 2" className="w-full h-full object-cover" /></SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
              <div className="p-8 relative z-20 -mt-16">
                <span className="text-xs text-gray-400 font-playfair uppercase tracking-widest mb-2 block">1 Year+</span>
                <h3 className="text-2xl font-playfair uppercase tracking-wider mb-3">Toddler Shoots</h3>
                <p className="text-gray-500 font-light leading-relaxed">Fun-filled first birthday and cake smash celebrations.</p>
              </div>
            </motion.div>
          
              </>
            )}
          </div>
        </div>
      </section>


      {/* 4. OUR BEST CLICKS */}
      <section className="py-24 border-t border-white/5 overflow-hidden">
        <div className="px-6 lg:px-12 mb-12 flex flex-col items-center">
            <h2 className="font-playfair font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">{pageData?.portfolioImagesHeading || "Our Best Clicks"}</h2>
        </div>
        
        <div className="relative w-full px-6 lg:px-12 pb-8">
          <Swiper grabCursor={true} simulateTouch={true}
            modules={[Autoplay, FreeMode]}
            slidesPerView="auto"
            spaceBetween={16}
            freeMode={true}
            loop={true}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={3000}
            loopAdditionalSlides={5}
            className="mySwiper"
          >
            {[...portfolioImages, ...portfolioImages, ...portfolioImages, ...portfolioImages].map((img, i) => (
              <SwiperSlide key={i} className="!w-[280px] md:!w-[350px] h-[400px] md:h-[500px] cursor-pointer overflow-hidden border-0 relative transition-colors flex justify-center">
                <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 5. WHY PARENTS LOVE OUR STUDIO & PURE COMFORT */}
      <section className="py-24 relative overflow-hidden bg-[#111]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-playfair uppercase tracking-widest mb-12 flex items-center gap-4">
                <span className="w-8 h-1 bg-white"></span> {pageData?.whyChooseHeading || "Why Parents Love Our Studio"}
              </motion.h2>
              
              <div className="space-y-8">
                {(pageData?.features?.length > 0 ? pageData.features : [{ title: "40+ Premium Themes", description: "Amazing, hand-crafted setups for every mood." }, { title: "Certified Newborn Wraps", description: "Done by professionals ensuring 100% baby comfort." }, { title: "Cinematic Video & Editing", description: "Premium-grade videos and high-end photo retouching." }]).map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">✓</div>
                    <div>
                      <h4 className="text-lg font-playfair uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-gray-400 font-light">{item.description || item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-playfair uppercase tracking-widest mb-12 flex items-center gap-4 text-gray-300">
                <span className="w-8 h-1 bg-gray-300"></span> {pageData?.comfortHeading || "Pure Comfort for Mother & Baby"}
              </motion.h2>
              
              <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full" />
                
                <div className="space-y-8 relative z-10">
                  {(pageData?.comfortItems?.length > 0 ? pageData.comfortItems : [
                    { title: '100% AC Studio', desc: 'Perfectly temperature-controlled and dust-free.' },
                    { title: 'Private Nursing Room', desc: 'A dedicated, quiet space for baby feeding and makeup.' },
                    { title: 'Super Patient Team', desc: "We work completely around your baby's nap and feeding time." }
                  ]).map((item, i) => (
                    <motion.div key={i} variants={fadeInUp} className="flex gap-6 items-start">
                      <div className="mt-1 w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">✓</div>
                      <div>
                        <h4 className="text-lg font-playfair uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-gray-400 font-light">{item.description || item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. YOUTUBE VIDEOS */}
      {pageData?.showVideoGallery !== false && (
        <section className="py-24 border-t border-white/5 overflow-hidden">
          <div className="px-6 lg:px-12 mb-12 flex flex-col items-center">
              <h2 className="font-playfair font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">{pageData?.portfolioVideosHeading || "Memorable Client Stories"}</h2>
          </div>
          
          <div className="relative w-full px-6 lg:px-12 pb-8">
          <Swiper grabCursor={true} simulateTouch={true}
            modules={[Autoplay, FreeMode]}
            slidesPerView="auto"
            spaceBetween={16}
            freeMode={true}
            loop={true}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={3000}
            loopAdditionalSlides={5}
            className="mySwiper"
          >
            {[...portfolioVideos, ...portfolioVideos, ...portfolioVideos, ...portfolioVideos].map((vid, i) => {
              let videoId = '';
              if (vid.includes('youtube.com/watch?v=')) videoId = vid.split('v=')[1]?.split('&')[0];
              else if (vid.includes('youtu.be/')) videoId = vid.split('youtu.be/')[1]?.split('?')[0];
              
              if (!videoId) return null;
              
              return (
                <SwiperSlide key={i} className="!w-[300px] md:!w-[500px] aspect-video overflow-hidden border border-white/10 relative cursor-pointer hover:border-white/30 transition-colors" onClick={() => setActiveVideo(videoId)}>
                  <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} className="h-full w-auto max-w-none object-cover transition-transform duration-700 hover:scale-105" alt="Video Thumbnail" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 border border-white/50 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-xl ml-1">▶</span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
      )}

      {/* 7. PACKAGES (NEW SECTION) */}
      {pageData?.showPackages && (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-playfair uppercase tracking-widest mb-4">{pageData?.packagesHeading || "Investment"}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent mx-auto"></div>
              <p className="mt-6 text-gray-400 font-light max-w-2xl mx-auto">Transparent pricing for premium quality. Choose a package that suits your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(pageData?.customPackages || []).length > 0 ? (
                (pageData?.customPackages || []).map((pkg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-[#111] p-8 rounded-2xl border border-white/10 hover:border-white/40 transition-colors relative group"
                  >
                    <h3 className="text-4xl font-playfair uppercase tracking-widest mb-4 text-white group-hover:scale-105 transition-transform origin-left">{pkg.name}</h3>
                    {pkg.price && (
                      <div className="text-xl font-playfair mb-6 text-gray-400">
                        ₹{pkg.price}
                      </div>
                    )}
                    {(pkg.features || (pkg.description && pkg.description.split('\\n'))) && (
                      <ul className="space-y-3 mb-8">
                        {(pkg.features || (pkg.description ? pkg.description.split('\\n') : [])).map((f, idx) => f.trim() && (
                          <li key={idx} className="text-gray-400 text-sm font-light flex items-start gap-3">
                            <span className="text-gray-600 mt-1">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button 
                      onClick={() => { setFormData({...formData, interestedIn: pkg.name}); setIsModalOpen(true); }}
                      className="w-full py-3 border border-white/20 hover:bg-white hover:text-black uppercase tracking-widest text-sm font-playfair transition-colors rounded-full"
                    >
                      Select Package
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-12">Loading packages...</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 8. FINAL CTA BANNER */}
      <section className="relative py-32 mt-20 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-100"
          style={{ backgroundImage: `url(${pageData?.parallaxFooter?.imageUrl || '/images/studio.jpeg'})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/80 via-black/30 to-[#050505]/80" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className={`relative z-10 max-w-3xl px-4 mx-auto text-${pageData?.parallaxFooter?.align || 'center'}`}
        >
          <h2 className="text-4xl sm:text-6xl font-playfair uppercase tracking-widest mb-6">{pageData?.parallaxFooter?.heading || 'Affordable Premium Baby Shoot'}</h2>
          <div className="text-3xl font-playfair text-gray-300 mb-8 border-y border-gray-500/30 py-6 inline-block">
            {pageData?.parallaxFooter?.subheading || 'Starts From Just ₹3,999/-'}
          </div>
          <p className="text-lg text-gray-400 font-light mb-12">
            {pageData?.parallaxFooter?.description || 'Access to custom themes, wraps, and professional team without breaking your budget.'}
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-12 py-5 bg-white text-black font-playfair uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors rounded-full text-lg shadow-xl"
          >
            {pageData?.parallaxFooter?.buttonText || 'Claim Your Spot Now'}
          </button>
        </motion.div>
      </section>

      <Footer />

      {/* LEAD CAPTURE MODAL WITH EXPANDED FIELDS */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 p-8 sm:p-12 rounded-3xl max-w-md w-full relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <h3 className="text-2xl font-playfair uppercase tracking-widest mb-2 text-white">Book Your Shoot</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Your Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                  <input 
                    type="tel" required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Service</label>
                  <select 
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                    value={formData.serviceId} 
                    onChange={e => setFormData({...formData, serviceId: e.target.value, subId: ''})}
                  >
                    <option value="" className="bg-[#111] text-white">Select Service</option>
                    {services.map(s => (
                      <option key={s._id} value={s.slug} className="bg-[#111] text-white">{s.name}</option>
                    ))}
                  </select>
                </div>


                
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black font-playfair uppercase tracking-widest rounded-xl transition-colors mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Callback'}
                </button>
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-wider mt-2">
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
