const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// 1. Revert logo size
content = content.replace(
  /<img src="\/images\/logo3\.png" alt="Imazen Studios" className="h-20 sm:h-24 w-auto object-contain drop-shadow-\[0_0_10px_rgba\(255,255,255,0\.2\)\]" \/>/,
  `<img src="/images/logo3.png" alt="Imazen Studios" className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />`
);

// 2. Fix images size in "Our Best Clicks"
// I previously set them to w-auto h-[300px] md:h-[450px], which made them too large.
// Let's set them back to a fixed width and height so they aren't huge.
content = content.replace(
  /className="!w-auto h-\[300px\] md:h-\[450px\] cursor-pointer overflow-hidden border border-white\/10 relative hover:border-white\/30 transition-colors"/g,
  `className="!w-[300px] md:!w-[400px] h-[400px] md:h-[500px] cursor-pointer overflow-hidden border border-white/10 relative hover:border-white/30 transition-colors"`
);
// And revert the img inside to w-full instead of w-auto so it covers the square properly.
content = content.replace(
  /className="w-auto h-full object-cover transition-transform duration-700 hover:scale-105"/g,
  `className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"`
);

// Same for videos in "Memorable Client Stories"
content = content.replace(
  /className="!w-auto h-\[300px\] md:h-\[450px\] cursor-pointer overflow-hidden border border-white\/10 relative hover:border-white\/30 transition-colors"/g,
  `className="!w-[300px] md:!w-[400px] h-[400px] md:h-[500px] cursor-pointer overflow-hidden border border-white/10 relative hover:border-white/30 transition-colors"`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed ReferenceLandingPage.jsx images and logo');
