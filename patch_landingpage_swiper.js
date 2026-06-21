const fs = require('fs');

let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// The hero swiper in LandingPage.jsx already has Keyboard imported and used.
// But let's make sure it has allowTouchMove={true} and navigation={true} for swiping arrows.
// It currently has: 
// <Swiper
//   modules={[Autoplay, EffectFade, Keyboard]}
//   effect="fade"
//   keyboard={{ enabled: true }}
//   autoplay={{ delay: 5000, disableOnInteraction: false }}
//   loop={true}
//   allowTouchMove={true}

// To add arrows, we need Navigation
if (!lp.includes('modules={[Autoplay, EffectFade, Keyboard, Navigation]}')) {
  lp = lp.replace(
    /import \{ Autoplay, FreeMode, Navigation, Pagination, EffectFade, Keyboard \} from 'swiper\/modules';/,
    "import { Autoplay, FreeMode, Navigation, Pagination, EffectFade, Keyboard } from 'swiper/modules';"
  );
  
  lp = lp.replace(
    /modules=\{\[Autoplay, EffectFade, Keyboard\]\}/,
    "modules={[Autoplay, EffectFade, Keyboard, Navigation]}\n            navigation={true}"
  );
  
  // Also ensure pointer-events-none is removed from the content overlay so arrows are clickable
  // Wait, if arrows are from Swiper they might be underneath the absolute overlay.
  // Instead, just let swiping and keyboard work.
}

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');

console.log('LandingPage.jsx patched');
