const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

const missingSections = `
      {/* 2. INTRO VIDEO */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto flex justify-center">
        <div className="w-full aspect-video bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
            <video src="/images/intro.mp4" controls autoPlay muted loop className="w-full h-full object-cover" controlsList="nodownload" />
        </div>
      </section>

      <section className="py-12 px-6 lg:px-12 max-w-5xl mx-auto flex flex-col text-center">
        <h2 className="font-oswald font-light text-4xl md:text-5xl uppercase tracking-[0.1em] mb-4 text-white">
          Our Approach
        </h2>
        <p className="font-sans font-light text-white/60 leading-[2] tracking-wide text-sm md:text-base">
          Capturing the purest moments with utmost care and creativity.
        </p>
      </section>

      {/* 3. WHAT WE DO BEST (Swiper Backgrounds) */}
      <section className="py-24 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-oswald uppercase tracking-widest mb-4">What We Do Best</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-transparent mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
            >
              <div className="h-64 overflow-hidden relative">
                <Swiper modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 3000, disableOnInteraction: false }} loop={true} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <SwiperSlide><img src="/images/experience_bg.jpeg" alt="Newborn" className="w-full h-full object-cover" /></SwiperSlide>
                  <SwiperSlide><img src="/images/about_bg.jpeg" alt="Newborn 2" className="w-full h-full object-cover" /></SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
              <div className="p-8 relative z-20 -mt-16">
                <span className="text-xs text-gray-400 font-oswald uppercase tracking-widest mb-2 block">5-15 Days</span>
                <h3 className="text-2xl font-oswald uppercase tracking-wider mb-3">Newborn Shoots</h3>
                <p className="text-gray-500 font-light leading-relaxed">Safe, sleepy, and beautiful poses.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
            >
              <div className="h-64 overflow-hidden relative">
                <Swiper modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 3500, disableOnInteraction: false }} loop={true} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <SwiperSlide><img src="/images/mobile.jpeg" alt="Milestone" className="w-full h-full object-cover" /></SwiperSlide>
                  <SwiperSlide><img src="/images/studio.jpeg" alt="Milestone 2" className="w-full h-full object-cover" /></SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
              <div className="p-8 relative z-20 -mt-16">
                <span className="text-xs text-gray-400 font-oswald uppercase tracking-widest mb-2 block">1-12 Months</span>
                <h3 className="text-2xl font-oswald uppercase tracking-wider mb-3">Milestone Shoots</h3>
                <p className="text-gray-500 font-light leading-relaxed">Capturing sitting up, crawling, and first teeth.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
            >
              <div className="h-64 overflow-hidden relative">
                <Swiper modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 4000, disableOnInteraction: false }} loop={true} className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <SwiperSlide><img src="/images/banner_bg.webp" alt="Toddler" className="w-full h-full object-cover" /></SwiperSlide>
                  <SwiperSlide><img src="/images/experience_bg.jpeg" alt="Toddler 2" className="w-full h-full object-cover" /></SwiperSlide>
                </Swiper>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
              </div>
              <div className="p-8 relative z-20 -mt-16">
                <span className="text-xs text-gray-400 font-oswald uppercase tracking-widest mb-2 block">1 Year+</span>
                <h3 className="text-2xl font-oswald uppercase tracking-wider mb-3">Toddler Shoots</h3>
                <p className="text-gray-500 font-light leading-relaxed">Fun-filled first birthday and cake smash celebrations.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. OUR BEST CLICKS */}
      <section className="py-24 border-t border-white/5 overflow-hidden">
        <div className="px-6 lg:px-12 mb-12 flex flex-col items-center">
            <h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">Our Best Clicks</h2>
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
              <SwiperSlide key={i} style={{ width: 'auto' }} className="h-[400px] md:h-[500px] cursor-pointer overflow-hidden border-0 relative transition-colors">
                <img src={img} alt="Gallery" className="h-full w-auto max-w-none block object-cover transition-transform duration-700 hover:scale-105" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
`;

const insertAfter = '</section>';
const insertBefore = '{/* 5. WHY PARENTS LOVE OUR STUDIO & PURE COMFORT */}';

const parts = content.split(insertBefore);
if (parts.length === 2) {
  content = parts[0] + missingSections + '\\n      ' + insertBefore + parts[1];
  fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
  console.log('Restored missing sections successfully');
} else {
  console.log('Could not find insert point');
}
