import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ServicePortfolio = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceSlug = searchParams.get('service');
  const subSlug = searchParams.get('sub');

  const [activeTab, setActiveTab] = useState('images');
  const [serviceData, setServiceData] = useState(null);
  const [gallery, setGallery] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Helper to convert standard YouTube links to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/embed/')) {
        return url;
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (e) {
      return url;
    }
  };

  // Helper to optimize Cloudinary URLs
  const optimizeCloudinaryUrl = (url, isHero = false) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    if (url.includes('/upload/q_auto')) return url;
    if (isHero) {
      return url.replace('/upload/', '/upload/f_auto,q_auto:best,w_1920/');
    }
    return url.replace('/upload/', '/upload/f_auto,q_auto:eco,w_1000/');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Services
        const svcRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/services`);
        const services = svcRes.data;
        
        let targetService = null;
        let isSub = false;

        // Find the right service or subservice
        const parentService = services.find(s => s.slug === serviceSlug);
        if (parentService) {
          if (subSlug) {
            const sub = parentService.subServices?.find(s => s.slug === subSlug);
            if (sub) {
              targetService = { ...sub, parentSlug: parentService.slug };
              isSub = true;
            }
          } else {
            targetService = parentService;
          }
        }

        if (!targetService) {
          navigate('/packages');
          return;
        }
        setServiceData(targetService);

        // Map embedded portfolio media instead of fetching from global gallery
        setGallery({
          images: (targetService.portfolioImages || []).map(url => ({ url })),
          videos: (targetService.portfolioVideos || []).map(url => ({ url }))
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      fetchPortfolioData();
    }
  }, [serviceSlug, subSlug, navigate]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev => prev === 0 ? gallery.images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev => prev === gallery.images.length - 1 ? 0 : prev + 1);
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, gallery.images.length]);

  if (loading || !serviceData) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine where "View Details" should link to
  const viewDetailsLink = subSlug 
    ? `/packages?service=${encodeURIComponent(serviceSlug)}&sub=${encodeURIComponent(subSlug)}`
    : `/packages?service=${encodeURIComponent(serviceSlug)}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Desktop Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 hidden md:block"
          style={{ backgroundImage: `url(${optimizeCloudinaryUrl(serviceData.heroImage || serviceData.imageUrl, true)})` }}
        />
        {/* Mobile Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 block md:hidden"
          style={{ backgroundImage: `url(${optimizeCloudinaryUrl(serviceData.mobileHeroImage || serviceData.heroImage || serviceData.imageUrl, true)})` }}
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 lg:px-12 pt-20 flex flex-col md:flex-row items-center md:items-end justify-end md:justify-between h-full pb-10 md:pb-20 gap-8 md:gap-0">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left max-w-2xl"
          >
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-[0.3em] hover:text-white transition-colors mb-6 mx-auto md:mx-0 absolute top-28 left-6 md:static md:top-auto md:left-auto"
            >
              <span>←</span> BACK TO HOME
            </button>
            <h1 className="font-oswald font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-widest leading-none mb-4 md:mb-6">
              {serviceData.name}
            </h1>
            {serviceData.tagline && (
              <p className="font-serif italic text-xl md:text-2xl text-gray-300 mb-8">
                "{serviceData.tagline}"
              </p>
            )}
            {serviceData.description && (
              <p className="font-sans text-xs md:text-sm text-gray-400 tracking-wider leading-relaxed max-w-xl">
                {serviceData.description}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 md:mt-0"
          >
            <a 
              href={viewDetailsLink}
              className="inline-flex items-center justify-center border border-white/30 bg-black/30 backdrop-blur-md px-10 py-4 md:py-5 font-sans text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 rounded-sm mt-8 md:mt-0"
            >
              View Packages
            </a>
          </motion.div>

        </div>
      </section>

      {/* Story Section */}
      {serviceData.landingAbout && (serviceData.landingAbout.title || serviceData.landingAbout.description) && (
        <section className="py-24 px-6 lg:px-12 max-w-[90rem] mx-auto border-b border-white/10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-oswald font-bold text-3xl md:text-5xl uppercase tracking-widest leading-tight mb-6">
                {serviceData.landingAbout.title}
              </h2>
              <div className="w-12 h-[2px] bg-white mb-8"></div>
              <p className="font-sans text-gray-400 text-sm md:text-base leading-relaxed tracking-wide whitespace-pre-wrap">
                {serviceData.landingAbout.description}
              </p>
            </motion.div>
            {serviceData.landingAbout.imageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-sm"
              >
                <img src={optimizeCloudinaryUrl(serviceData.landingAbout.imageUrl)} alt={serviceData.landingAbout.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 border border-white/20 m-4"></div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {serviceData.features && serviceData.features.length > 0 && (
        <section className="py-24 px-6 lg:px-12 bg-[#050505] border-b border-white/10">
          <div className="max-w-[90rem] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-oswald font-bold text-3xl md:text-4xl uppercase tracking-widest text-white">Why Choose Us</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceData.features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors duration-500 rounded-sm"
                >
                  <h3 className="font-oswald text-xl uppercase tracking-widest mb-4 text-white">{feature.title}</h3>
                  <p className="font-sans text-gray-400 text-sm leading-relaxed tracking-wide">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {serviceData.faqs && serviceData.faqs.length > 0 && (
        <section className="py-24 px-6 lg:px-12 max-w-4xl mx-auto border-b border-white/10">
          <div className="text-center mb-16">
            <h2 className="font-oswald font-bold text-3xl md:text-4xl uppercase tracking-widest text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {serviceData.faqs.map((faq, idx) => (
              <motion.details 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group border border-white/10 bg-[#080808] [&_summary::-webkit-details-marker]:hidden rounded-sm overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 font-oswald text-base md:text-lg tracking-widest uppercase text-white hover:bg-white/5 transition-colors">
                  {faq.question}
                  <span className="transition group-open:-rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 font-sans tracking-wide leading-relaxed text-sm md:text-base bg-black/20 pt-4">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </section>
      )}

      {/* Tabs & Gallery Section */}
      <section className="py-20 px-6 lg:px-12 max-w-[90rem] mx-auto">
        
        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-12">
          <button 
            onClick={() => setActiveTab('images')}
            className={`pb-4 font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all relative ${activeTab === 'images' ? 'text-white' : 'text-gray-600 hover:text-gray-300'}`}
          >
            <span className="mr-2">🖼️</span> IMAGES ({gallery.images.length})
            {activeTab === 'images' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`pb-4 font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all relative ${activeTab === 'videos' ? 'text-white' : 'text-gray-600 hover:text-gray-300'}`}
          >
            <span className="mr-2">🎥</span> VIDEOS ({gallery.videos.length})
            {activeTab === 'videos' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
            )}
          </button>
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 'images' ? (
            <motion.div 
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-4 items-center justify-center"
            >
              {gallery.images.length > 0 ? (
                gallery.images.map((img, i) => (
                  <div 
                    key={i} 
                    className="relative group overflow-hidden rounded-sm bg-white/5 cursor-pointer h-48 sm:h-64 md:h-80 flex-grow-0"
                    onClick={() => setSelectedImageIndex(i)}
                  >
                    <img 
                      src={optimizeCloudinaryUrl(img.url)} 
                      alt={`${serviceData.name} portfolio`} 
                      className="h-full w-auto object-contain transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-white text-3xl drop-shadow-lg">+</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-600 font-sans text-xs uppercase tracking-[0.2em]">No images available for this event yet.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {gallery.videos.length > 0 ? (
                gallery.videos.map((vid, i) => (
                  <div key={i} className="aspect-video w-full rounded-sm overflow-hidden bg-white/5 border border-white/5">
                    <iframe 
                      src={getYouTubeEmbedUrl(vid.url)} 
                      title={`${serviceData.name} video`}
                      className="w-full h-full"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-600 font-sans text-xs uppercase tracking-[0.2em]">No videos available for this event yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white text-4xl font-light transition-colors z-50"
              onClick={() => setSelectedImageIndex(null)}
            >
              &times;
            </button>
            
            {/* Prev Button */}
            <button 
              className="absolute left-4 md:left-12 text-white/50 hover:text-white text-4xl md:text-6xl font-light transition-colors z-50 p-4"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex === 0 ? gallery.images.length - 1 : selectedImageIndex - 1);
              }}
            >
              &#8249;
            </button>

            <img 
              src={optimizeCloudinaryUrl(gallery.images[selectedImageIndex].url, true)}
              alt="Lightbox"
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />

            {/* Next Button */}
            <button 
              className="absolute right-4 md:right-12 text-white/50 hover:text-white text-4xl md:text-6xl font-light transition-colors z-50 p-4"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex === gallery.images.length - 1 ? 0 : selectedImageIndex + 1);
              }}
            >
              &#8250;
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-xs font-sans tracking-[0.2em]">
              {selectedImageIndex + 1} / {gallery.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicePortfolio;
