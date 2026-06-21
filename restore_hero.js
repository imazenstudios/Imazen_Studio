const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

const missingHeroText = `
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-oswald uppercase tracking-[0.15em] leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Imazen Studios
            </h1>
          </motion.div>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-xl sm:text-2xl md:text-3xl font-oswald font-light tracking-[0.2em] text-gray-300 mb-12">
            Beautiful Baby Photography
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="flex flex-col items-center gap-6">
            <p className="text-lg md:text-xl font-light text-gray-400 italic max-w-2xl">
              "Your Baby's Smile, Captured Forever as Art."
            </p>
            <p className="text-sm md:text-base font-light text-gray-500 max-w-xl">
              Professional baby shoots with stunning themes and complete safety.
            </p>
            <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-sm mt-4">
              <span className="text-gray-300 font-oswald uppercase tracking-widest text-sm">Packages Start From Just ₹3,999/-</span>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 group relative px-12 py-5 bg-white text-black font-oswald uppercase tracking-[0.2em] hover:bg-gray-200 transition-all duration-300 rounded-full text-sm sm:text-base overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3 font-semibold">
                Book Your Shoot Now
              </span>
            </button>
          </motion.div>
        </div>
`;

// Insert the missing text right before `</section>` of the Hero section.
// But we need to make sure we don't insert it multiple times or in the wrong place.
// The hero section ends with:
//           </Swiper>
//         </div>
//       </section>

const insertPoint = `          </Swiper>
        </div>
      </section>`;

const replacement = `          </Swiper>
        </div>
${missingHeroText}
      </section>`;

if (content.includes(insertPoint)) {
  content = content.replace(insertPoint, replacement);
  fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
  console.log('Restored Hero Text successfully');
} else {
  console.log('Could not find insert point for Hero Text');
}
