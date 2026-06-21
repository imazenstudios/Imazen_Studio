const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// 1. Add animate-bounce back to the floating Book Now button
content = content.replace(
  /className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-full font-oswald uppercase tracking-widest text-sm shadow-\[0_0_20px_rgba\(255,255,255,0\.3\)\] flex items-center gap-2 transition-all"/g,
  `className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-full font-oswald uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 transition-all animate-bounce"`
);

// 2. Redo the Hero Section Content
const newHeroContent = `
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="flex flex-col items-center">
            <h2 className="text-sm sm:text-base font-oswald uppercase tracking-[0.3em] text-gray-400 mb-4 drop-shadow-md">
              Imazen Studios
            </h2>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-oswald uppercase tracking-tight leading-[1.1] mb-6 text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              Beautiful Baby<br/>Photography
            </h1>
          </motion.div>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-lg md:text-2xl font-light text-gray-300 italic max-w-2xl mt-2 mb-10 drop-shadow-md">
            "Your Baby's Smile, Captured Forever as Art."
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="flex flex-col items-center w-full">
            
            <div className="w-full max-w-3xl border-y border-gray-500/30 py-5 mb-10">
              <p className="text-sm md:text-base font-oswald font-light text-gray-400 uppercase tracking-widest leading-relaxed">
                Professional baby shoots with stunning themes and complete safety.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mt-2">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-gray-400 font-oswald uppercase tracking-widest text-xs mb-1">Packages Start From Just</span>
                <span className="text-gray-200 font-oswald text-3xl sm:text-4xl">₹3,999/-</span>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-4 bg-white text-black font-oswald uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 rounded-full text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Book Your Shoot Now
              </button>
            </div>
            
          </motion.div>
        </div>
`;

// Replace the old hero text content block
content = content.replace(
  /<div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20">[\s\S]*?<\/div>\s*<\/section>/,
  `${newHeroContent}      </section>`
);


fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed hero section and animations');
