const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// 3. Add scroll-to-top button
if (!content.includes('scrollToTop')) {
  content = content.replace(
    'const [isModalOpen, setIsModalOpen] = useState(false);',
    'const [isModalOpen, setIsModalOpen] = useState(false);\n  const [showScrollTop, setShowScrollTop] = useState(false);\n\n  useEffect(() => {\n    const handleScroll = () => {\n      if (window.scrollY > 300) setShowScrollTop(true);\n      else setShowScrollTop(false);\n    };\n    window.addEventListener(\'scroll\', handleScroll);\n    return () => window.removeEventListener(\'scroll\', handleScroll);\n  }, []);\n\n  const scrollToTop = () => window.scrollTo({ top: 0, behavior: \'smooth\' });'
  );
  
  content = content.replace(
    '{/* FOOTER */}',
    `{/* SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-black/80 backdrop-blur border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* FOOTER */}`
  );
}

// 4. Video fullscreen
if (content.includes('<video src={pageData.displayVideoUrl}')) {
  content = content.replace(
    '<video src={pageData.displayVideoUrl} controls autoPlay muted loop className="w-full h-full object-cover" controlsList="nodownload" />',
    '<video src={pageData.displayVideoUrl} controls autoPlay muted loop className="w-full h-full object-cover cursor-pointer" controlsList="nodownload" onClick={(e) => { if(e.target.requestFullscreen) e.target.requestFullscreen(); else if(e.target.webkitRequestFullscreen) e.target.webkitRequestFullscreen(); }} />'
  );
  content = content.replace(
    '<video src="/images/intro.mp4" controls autoPlay muted loop className="w-full h-full object-cover" controlsList="nodownload" />',
    '<video src="/images/intro.mp4" controls autoPlay muted loop className="w-full h-full object-cover cursor-pointer" controlsList="nodownload" onClick={(e) => { if(e.target.requestFullscreen) e.target.requestFullscreen(); else if(e.target.webkitRequestFullscreen) e.target.webkitRequestFullscreen(); }} />'
  );
}

// 5. Interchange package name and price font sizes
if (content.includes('text-xl md:text-2xl font-oswald uppercase tracking-widest text-white mb-2')) {
  content = content.replace(
    /text-xl md:text-2xl font-oswald uppercase tracking-widest text-white mb-2/g,
    'text-4xl md:text-5xl font-oswald uppercase tracking-widest text-white mb-2'
  );
  content = content.replace(
    /text-4xl md:text-5xl font-oswald text-white mb-6/g,
    'text-xl md:text-2xl font-oswald text-white mb-6'
  );
}

// 6. Hurry limited slots transparent background white text
if (content.includes('bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full mb-12 shadow-[0_0_30px_rgba(255,255,255,0.3)]')) {
  content = content.replace(
    'bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full mb-12 shadow-[0_0_30px_rgba(255,255,255,0.3)]',
    'bg-transparent border border-white text-white text-xs font-bold uppercase tracking-widest rounded-full mb-12 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
  );
}

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', content);
console.log("LandingPage.jsx patched");
