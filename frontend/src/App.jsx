import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Packages from './pages/Packages';
import Book from './pages/Book';
import Gallery from './pages/Gallery';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

import LocationPage from './pages/LocationPage';
import AboutUs from './pages/AboutUs';
import Themes from './pages/Themes';
import Contact from './pages/Contact';
import TestimonialsPage from './pages/TestimonialsPage';
import ServicePortfolio from './pages/ServicePortfolio';
import ServiceDetails from './pages/ServiceDetails';
import LandingPage from './pages/LandingPage';
import Studio from './pages/Studio';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import NoInternetOverlay from './components/NoInternetOverlay';
import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import ThankYou from './pages/ThankYou';
import ReferenceLandingPage from './pages/ReferenceLandingPage';
import Wedding from './pages/Wedding';

import ScrollToTopButton from './components/ScrollToTopButton';

// Create a layout component to conditionally hide header/footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Scroll to top on route change & track page view
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', { page_path: location.pathname });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    } catch (e) {
      console.warn('Analytics tracking error:', e);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col">
      {!isAdmin && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <ScrollToTopButton />}
    </div>
  );
};

function App() {
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceEndTime, setMaintenanceEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [adminBypass, setAdminBypass] = useState(false);

  useEffect(() => {
    // Check for admin bypass in localStorage
    if (localStorage.getItem('adminBypass') === 'true') {
      setAdminBypass(true);
    }

    const initAnalytics = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings`);
        const settings = res.data;
        if (settings) {
          if (settings.googleAnalyticsId) {
            // Inject Google Analytics
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;
            document.head.appendChild(gaScript);

            const gaInit = document.createElement('script');
            gaInit.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.googleAnalyticsId}');
            `;
            document.head.appendChild(gaInit);
          }
          if (settings.metaPixelId) {
            // Inject Meta Pixel
            const pixelScript = document.createElement('script');
            pixelScript.innerHTML = `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.metaPixelId}');
            `;
            document.head.appendChild(pixelScript);
          }
            if (settings.maintenanceMode) {
              setMaintenanceMode(true);
              setMaintenanceEndTime(settings.maintenanceEndTime);
            }
            if (settings.portfolioReferrers && settings.portfolioReferrers.length > 0) {
              const referrer = document.referrer.toLowerCase();
              const isPortfolioMode = settings.portfolioReferrers.some(ref => referrer.includes(ref.toLowerCase()));
              if (isPortfolioMode || window.location.search.includes('source=portfolio')) {
                sessionStorage.setItem('portfolioMode', 'true');
                
                if (settings.displays && settings.displays.length > 0) {
                  const matchedDisplay = settings.displays.find(d => referrer.includes(d.websiteLink.toLowerCase()));
                  if (matchedDisplay) {
                    sessionStorage.setItem('portfolioDescription', matchedDisplay.description);
                  }
                }
              }
            }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
        setAnalyticsInitialized(true);
      }
    };

    initAnalytics();
  }, []);

  const showLoader = isLoading || !animationFinished;
  const isFadingOut = !isLoading && animationFinished;

  return (
    <>
      {showLoader && (
        <div className={`fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-500 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative w-40 sm:w-64 h-20 sm:h-24">
            <img src="/images/logo.png" alt="Imazen Studios Logo" className="absolute inset-0 w-full h-full object-contain opacity-20" />
            <div 
              className="absolute top-0 left-0 h-full overflow-hidden" 
              style={{ animation: 'fillLogo 2s ease-in-out forwards' }}
              onAnimationEnd={() => {
                setAnimationFinished(true);
              }}
            >
              <img src="/images/logo.png" alt="Imazen Studios Logo" className="w-40 sm:w-64 h-20 sm:h-24 object-contain max-w-none origin-left" />
            </div>
          </div>
          <style>{`
            @keyframes fillLogo {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      )}

      {(!isLoading && animationFinished) && (
      <HelmetProvider>
      <Router>
        <NoInternetOverlay />
        
        {adminBypass && maintenanceMode && (
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-xs text-center py-1 z-[9999] uppercase tracking-widest font-bold">
            Maintenance Mode Active - Admin Bypass Enabled
          </div>
        )}

        <Routes>
          {/* Admin routes bypass maintenance mode */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />

          {/* If maintenance mode is active, intercept all other routes */}
          {maintenanceMode && !adminBypass ? (
            <Route path="*" element={<Maintenance endTime={maintenanceEndTime} />} />
          ) : (
            <>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><AboutUs /></Layout>} />
              <Route path="/packages" element={<Layout><Packages /></Layout>} />
              <Route path="/portfolio" element={<Layout><ServicePortfolio /></Layout>} />
              <Route path="/services/:slug" element={<Layout><ServiceDetails /></Layout>} />
              <Route path="/themes" element={<Layout><Themes /></Layout>} />
              <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
              <Route path="/book" element={<Layout><Book /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/thank-you" element={<Layout><ThankYou /></Layout>} />
              <Route path="/location/:city" element={<Layout><LocationPage /></Layout>} />
              <Route path="/studio" element={<Layout><Studio /></Layout>} />
              <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />
              <Route path="/reference" element={<ReferenceLandingPage />} />
              <Route path="/wedding" element={<Layout><Wedding /></Layout>} />
              <Route path="/:slug" element={<LandingPage />} />

              {/* Catch-all for 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </Router>
    </HelmetProvider>
    )}
    </>
  );
}

export default App;
