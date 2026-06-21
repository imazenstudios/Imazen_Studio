const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// 1. Move Floating Buttons
content = content.replace(
  /className="fixed bottom-6 left-6 z-\[60\] flex flex-col items-start gap-2"/,
  `className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2"`
);

content = content.replace(
  /className="fixed bottom-6 right-6 z-\[60\] bg-\[#111\] hover:bg-\[#222\] border border-white\/20 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100"/,
  `className="fixed bottom-6 left-6 z-[60] bg-[#111] hover:bg-[#222] border border-white/20 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100"`
);

// 2. Logo Size
content = content.replace(
  /<img src="\/images\/logo3\.png" alt="Imazen Studios" className="h-12 w-auto object-contain drop-shadow-\[0_0_10px_rgba\(255,255,255,0\.2\)\]" \/>/,
  `<img src="/images/logo3.png" alt="Imazen Studios" className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />`
);

// 3. What We Do Best Swipers
content = content.replace(
  /modules=\{\[Autoplay, EffectFade\]\} effect="fade" autoplay=\{\{ delay: 3000 \}\} loop=\{true\}/,
  `modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 3000, disableOnInteraction: false }} loop={true}`
);
content = content.replace(
  /modules=\{\[Autoplay, EffectFade\]\} effect="fade" autoplay=\{\{ delay: 3500 \}\} loop=\{true\}/,
  `modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 3500, disableOnInteraction: false }} loop={true}`
);
content = content.replace(
  /modules=\{\[Autoplay, EffectFade\]\} effect="fade" autoplay=\{\{ delay: 4000 \}\} loop=\{true\}/,
  `modules={[Autoplay, Navigation]} navigation={true} autoplay={{ delay: 4000, disableOnInteraction: false }} loop={true}`
);

// Add some CSS to customize the navigation arrows for those small sliders to look good (optional, but good)
content = content.replace(
  /import 'swiper\/css\/effect-fade';/,
  `import 'swiper/css/effect-fade';\nimport '../styles/swiper-custom.css';`
);

// 4. "Our Best Clicks" styling & remove grayscale
content = content.replace(
  /className="!w-\[300px\] md:!w-\[400px\] h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden border border-white\/10 relative hover:border-white\/30 transition-colors"/,
  `className="!w-auto h-[300px] md:h-[450px] cursor-pointer overflow-hidden border border-white/10 relative hover:border-white/30 transition-colors"`
);
content = content.replace(
  /className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 grayscale hover:grayscale-0"/g,
  `className="w-auto h-full object-cover transition-transform duration-700 hover:scale-105"`
);

// 5. YouTube Videos Remove grayscale
content = content.replace(
  /className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 grayscale hover:grayscale-0" alt="Video Thumbnail"/g,
  `className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Video Thumbnail"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed ReferenceLandingPage.jsx');
