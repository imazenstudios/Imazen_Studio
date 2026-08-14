import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Check for iOS device (Safari)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isIosDevice && !/crios|fxios|opios/.test(userAgent);
    setIsIOS(isIosDevice && isSafari);

    // 3. Listen for Chrome/Android/Edge beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  // Do not render anything if already installed, dismissed, or not installable (unless iOS Safari)
  if (isStandalone || dismissed) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Floating Install Prompt Banner */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-24 right-6 z-40 max-w-sm w-[calc(100vw-3rem)] bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white"
        >
          <div className="flex items-center gap-3">
            <img 
              src="/icons/pwa-192x192.png" 
              alt="Imazen Studios Logo" 
              className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-oswald text-sm font-semibold tracking-wider uppercase text-white truncate">
                Install Imazen Studios
              </h4>
              <p className="font-sans text-[11px] text-gray-300 leading-tight">
                Quick access & smooth app experience
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-white p-1 transition-colors rounded-full hover:bg-white/10 shrink-0"
              aria-label="Close install prompt"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 text-[11px] font-sans text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider bg-white text-black hover:bg-gray-200 rounded-lg transition-all shadow-md flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Install App
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowIOSModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f0f0f] border border-white/20 rounded-2xl p-6 max-w-sm w-full text-white text-center shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <img 
                src="/icons/pwa-192x192.png" 
                alt="Imazen Studios" 
                className="w-16 h-16 rounded-2xl mx-auto mb-4 border border-white/10" 
              />

              <h3 className="font-oswald text-lg font-bold tracking-wider uppercase mb-2">
                Install Imazen Studios
              </h3>
              
              <p className="font-sans text-xs text-gray-300 mb-6 leading-relaxed">
                To install this app on your iPhone / iPad:
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left font-sans text-xs space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
                  <span>Tap the <strong className="text-white">Share</strong> button in Safari toolbar below</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
                  <span>Scroll down and select <strong className="text-white">Add to Home Screen</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">3</div>
                  <span>Tap <strong className="text-white">Add</strong> in top right corner</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 bg-white text-black font-sans text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallPrompt;
