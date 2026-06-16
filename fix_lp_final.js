const fs = require('fs');

let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// 1. Parallax Fix
// Find the entire Parallax section. It starts with `{pageData.parallaxFooter?.imageUrl && (`
// and ends with `</section>`
const parallaxRegex = /\{pageData\.parallaxFooter\?\.imageUrl && \([\s\S]*?<\/section>\s*\)}/;
const newParallax = `{pageData.parallaxFooter?.imageUrl && (
        <section className="relative h-[80vh] w-full flex items-center justify-center border-t border-white/5" style={{ clipPath: "inset(0)" }}>
          <div 
            className="fixed inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: \`url(\${optimizeCloudinaryUrl(pageData.parallaxFooter.imageUrl)})\`,
              zIndex: -1
            }}
          />
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          
          <div className={\`relative z-10 px-6 w-full max-w-5xl flex flex-col \${getTextAlignClass(pageData.parallaxFooter?.align)}\`}>
            <h2 className="font-oswald font-light text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.1em] text-white drop-shadow-2xl mb-8">
              {pageData.parallaxFooter.heading || 'Ready to Begin Your Story?'}
            </h2>
            <p className="font-sans text-sm md:text-base text-white/70 uppercase tracking-[0.2em] max-w-2xl mx-auto">
              Let's have a conversation about your wedding day. We'd love to learn about your vision.
            </p>
            
            <button onClick={() => setIsLeadModalOpen(true)} className="inline-block mt-12 px-12 py-4 border border-white/30 bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black uppercase tracking-[0.2em] text-xs font-oswald transition-all mx-auto">
              Book Now
            </button>
          </div>
        </section>
      )}`;
lp = lp.replace(parallaxRegex, newParallax);

// 2. Swiper Continuous Loop Fix
// We need to change the Swiper config to use CSS continuous marquee WITHOUT breaking drag.
// The trick is: disable Swiper's autoplay, and just use a CSS animation on `.swiper-wrapper` 
// OR just configure Swiper autoplay properly with `linear` easing that is NOT `!important`
lp = lp.replace(
    '<style>{`.swiper-wrapper { transition-timing-function: linear !important; }`}</style>',
    '<style>{`.swiper-wrapper { transition-timing-function: linear; }`}</style>'
);
// Make sure Swiper has speed={3000} and autoplay={{ delay: 0, disableOnInteraction: false }}
lp = lp.replace(/autoplay=\{\{ delay: 0, disableOnInteraction: false \}\}\n\s*speed=\{4000\}/g, 'autoplay={{ delay: 0, disableOnInteraction: false }}\n              speed={3000}\n              loopAdditionalSlides={5}');

// 3. Video controls "showing only pause option"
// Let's remove `modestbranding=1` from YouTube iframe just in case it hides controls on their browser.
lp = lp.replace(/&modestbranding=1/g, '');
// For HTML5 video, add `controlsList="nodownload"` just to be safe, maybe it forces full UI.
lp = lp.replace(/<video src=\{pageData\.displayVideoUrl\} autoPlay controls/g, '<video src={pageData.displayVideoUrl} autoPlay controls controlsList="nodownload"');

// Wait! "also videos are not scrolling for desktop"
// Swiper on desktop requires `simulateTouch={true}` which is default, but maybe they have a weird setup.
// We'll add `grabCursor={true}` and `simulateTouch={true}` explicitly to Swiper components.
lp = lp.replace(/<Swiper/g, '<Swiper grabCursor={true} simulateTouch={true}');

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');
console.log('Fixed LandingPage.jsx');
