const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// Replace the slide container and image with a bulletproof auto-width Swiper approach
content = content.replace(
  /<SwiperSlide key=\{i\}[\s\S]*?className="!w-auto h-\[500px\] cursor-pointer overflow-hidden border-0 relative transition-colors"[\s\S]*?>[\s\S]*?<img src=\{img\} alt="Gallery" className="h-full w-auto max-w-none object-cover transition-transform duration-700 hover:scale-105" \/>[\s\S]*?<\/SwiperSlide>/g,
  `<SwiperSlide key={i} style={{ width: 'auto' }} className="h-[400px] md:h-[500px] cursor-pointer overflow-hidden relative transition-colors">
                <img src={img} alt="Gallery" className="h-full w-auto block transition-transform duration-700 hover:scale-105" />
              </SwiperSlide>`
);

content = content.replace(
  /<SwiperSlide key=\{i\} className="!w-auto h-\[500px\] cursor-pointer overflow-hidden border-0 relative transition-colors">[\s\S]*?<img src=\{`https:\/\/img\.youtube\.com\/vi\/\$\{videoId\}\/maxresdefault\.jpg`\} className="h-full w-auto max-w-none object-cover transition-transform duration-700 hover:scale-105" alt="Video Thumbnail" \/>[\s\S]*?<div className="absolute inset-0 flex items-center justify-center pointer-events-none">[\s\S]*?<div className="w-16 h-16 rounded-full bg-black\/50 border border-white\/50 flex items-center justify-center backdrop-blur-sm">[\s\S]*?<span className="text-white text-xl ml-1">▶<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/SwiperSlide>/g,
  `<SwiperSlide key={i} style={{ width: 'auto' }} className="h-[400px] md:h-[500px] cursor-pointer overflow-hidden relative transition-colors">
                  <img src={\`https://img.youtube.com/vi/\${videoId}/maxresdefault.jpg\`} className="h-full w-auto block transition-transform duration-700 hover:scale-105" alt="Video Thumbnail" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 border border-white/50 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-xl ml-1">▶</span>
                    </div>
                  </div>
                </SwiperSlide>`
);

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed Our Portfolio bulletproof auto width');
