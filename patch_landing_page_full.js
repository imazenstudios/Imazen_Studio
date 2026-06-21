const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// 1. Logo URL
content = content.replace(
  /<img src="\/images\/logo\.png"/g,
  '<img src={pageData?.logoUrl || "/images/logo.png"}'
);

// 2. Approach Heading
content = content.replace(
  /<h2 className="font-oswald font-light text-4xl md:text-5xl uppercase tracking-\[0\.1em\] mb-4 text-white">\s*Our Approach\s*<\/h2>/g,
  '<h2 className="font-oswald font-light text-4xl md:text-5xl uppercase tracking-[0.1em] mb-4 text-white">\n          {pageData?.approachHeading || "Our Approach"}\n        </h2>'
);

content = content.replace(
  /<p className="font-sans font-light text-white\/60 leading-\[2\] tracking-wide text-sm md:text-base mb-12">\s*Capturing the purest moments with utmost care and creativity\.\s*<\/p>/g,
  '<p className="font-sans font-light text-white/60 leading-[2] tracking-wide text-sm md:text-base mb-12">\n          {pageData?.approachDescription || "Capturing the purest moments with utmost care and creativity."}\n        </p>'
);

// 3. What We Do Best Heading
content = content.replace(
  /<h2 className="text-3xl sm:text-5xl font-oswald uppercase tracking-widest mb-4">What We Do Best<\/h2>/g,
  '<h2 className="text-3xl sm:text-5xl font-oswald uppercase tracking-widest mb-4">{pageData?.serviceCardsHeading || "What We Do Best"}</h2>'
);

// 4. What We Do Best Cards
const hardcodedCardsRegex = /<div className="grid grid-cols-1 md:grid-cols-3 gap-8">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;

const dynamicCards = `
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageData?.serviceCards && pageData.serviceCards.length > 0 ? pageData.serviceCards.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/30 transition-all duration-500"
              >
                <div className="h-64 overflow-hidden relative">
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
                  <span className="text-xs text-gray-400 font-oswald uppercase tracking-widest mb-2 block">{card.category}</span>
                  <h3 className="text-2xl font-oswald uppercase tracking-wider mb-3">{card.title}</h3>
                  <p className="text-gray-500 font-light leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            )) : (
              <>
                {/* Fallback Cards */}
$1
              </>
            )}
          </div>
        </div>
      </section>
`;

content = content.replace(hardcodedCardsRegex, dynamicCards);


// 5. Our Best Clicks Heading
content = content.replace(
  /<h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-\[0\.2em\] text-white">Our Best Clicks<\/h2>/g,
  '<h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">{pageData?.portfolioImagesHeading || "Our Best Clicks"}</h2>'
);

// 6. Why Parents Love Our Studio
content = content.replace(
  /<span className="w-8 h-1 bg-white"><\/span> Why Parents Love Our Studio/g,
  '<span className="w-8 h-1 bg-white"></span> {pageData?.whyChooseHeading || "Why Parents Love Our Studio"}'
);

content = content.replace(
  /\{\[\s*\{\s*title:\s*'40\+ Premium Themes'.*?\]\s*\}\.map/gs,
  `{(pageData?.features && pageData.features.length > 0 ? pageData.features : [\n                  { title: '40+ Premium Themes', desc: 'Amazing, hand-crafted setups for every mood.' },\n                  { title: 'Certified Newborn Wraps', desc: 'Done by professionals ensuring 100% baby comfort.' },\n                  { title: 'Cinematic Video & Editing', desc: 'Premium-grade videos and high-end photo retouching.' }\n                ]).map`
);

// 7. Pure Comfort
content = content.replace(
  /<span className="w-8 h-1 bg-gray-300"><\/span> Pure Comfort for Mother & Baby/g,
  '<span className="w-8 h-1 bg-gray-300"></span> {pageData?.comfortHeading || "Pure Comfort for Mother & Baby"}'
);

content = content.replace(
  /\{\[\s*\{\s*title:\s*'100% AC Studio'.*?\]\s*\}\.map/gs,
  `{(pageData?.comfortItems && pageData.comfortItems.length > 0 ? pageData.comfortItems : [\n                    { title: '100% AC Studio', desc: 'Perfectly temperature-controlled and dust-free.' },\n                    { title: 'Private Nursing Room', desc: 'A dedicated, quiet space for baby feeding and makeup.' },\n                    { title: 'Super Patient Team', desc: "We work completely around your baby's nap and feeding time." }\n                  ]).map`
);

// 8. Memorable Client Stories
content = content.replace(
  /<h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-\[0\.2em\] text-white">Memorable Client Stories<\/h2>/g,
  '<h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white">{pageData?.portfolioVideosHeading || "Memorable Client Stories"}</h2>'
);

// 9. Investment
content = content.replace(
  /<h2 className="text-3xl sm:text-5xl font-oswald uppercase tracking-widest mb-4">Investment<\/h2>/g,
  '<h2 className="text-3xl sm:text-5xl font-oswald uppercase tracking-widest mb-4">{pageData?.packagesHeading || "Investment"}</h2>'
);

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', content, 'utf8');
console.log('Patched LandingPage.jsx');
