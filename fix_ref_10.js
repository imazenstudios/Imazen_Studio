const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// 1. Restore the Hero Slider
content = content.replace(
  /\{heroImages\.map\(\(img, i\) => \([\s\S]*?<SwiperSlide key=\{i\} style=\{\{ width: 'auto' \}\} className="h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden relative transition-colors">[\s\S]*?<img src=\{img\} alt="Gallery" className="h-full w-auto block transition-transform duration-700 hover:scale-105" \/>[\s\S]*?<\/SwiperSlide>[\s\S]*?\)\)\}/g,
  `{heroImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-full">
                  <img src={img} alt="Hero Background" className="w-full h-full object-cover opacity-60 scale-105 transform hover:scale-100 transition-transform duration-[10s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-black/20" />
                </div>
              </SwiperSlide>
            ))}`
);

// 2. Fix the Portfolio Slider
content = content.replace(
  /className="!w-\[280px\] md:!w-\[350px\] h-\[400px\] md:h-\[500px\] cursor-pointer overflow-hidden border-0 relative transition-colors"/g,
  `style={{ width: 'auto' }} className="h-[400px] md:h-[500px] cursor-pointer overflow-hidden border-0 relative transition-colors"`
);

content = content.replace(
  /<img src=\{img\} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" \/>/g,
  `<img src={img} alt="Gallery" className="h-full w-auto block object-cover transition-transform duration-700 hover:scale-105" />`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed everything');
