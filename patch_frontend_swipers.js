const fs = require('fs');

// PATCH HERO.JSX
let hero = fs.readFileSync('frontend/src/components/Hero.jsx', 'utf8');

// Add Keyboard to imports
hero = hero.replace(
  /import \{ EffectFade, Navigation, Pagination, Autoplay, Parallax \} from 'swiper\/modules';/,
  "import { EffectFade, Navigation, Pagination, Autoplay, Parallax, Keyboard } from 'swiper/modules';"
);

// Add Keyboard to modules
hero = hero.replace(
  /modules=\{\[EffectFade, Navigation, Pagination, Autoplay, Parallax\]\}/,
  "modules={[EffectFade, Navigation, Pagination, Autoplay, Parallax, Keyboard]}\n          keyboard={{ enabled: true }}\n          allowTouchMove={true}"
);

// Also fix the group hover issue preventing arrows from showing easily on touch devices
hero = hero.replace(
  /group-hover:opacity-100 opacity-0 transition-opacity duration-500/g,
  "opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500"
);

fs.writeFileSync('frontend/src/components/Hero.jsx', hero, 'utf8');


// PATCH TESTIMONIALS.JSX
let testimonials = fs.readFileSync('frontend/src/components/Testimonials.jsx', 'utf8');

// Remove EffectFade
testimonials = testimonials.replace(
  /import \{ Autoplay, Navigation, Pagination, EffectFade \} from 'swiper\/modules';/,
  "import { Autoplay, Navigation, Pagination } from 'swiper/modules';"
);
testimonials = testimonials.replace(
  /import 'swiper\/css\/effect-fade';\n/,
  ""
);
testimonials = testimonials.replace(
  /modules=\{\[Autoplay, Navigation, Pagination, EffectFade\]\}/,
  "modules={[Autoplay, Navigation, Pagination]}"
);
testimonials = testimonials.replace(
  /\s*effect="fade"\n\s*fadeEffect=\{\{ crossFade: true \}\}\n/,
  "\n          slidesPerView={1}\n          spaceBetween={30}\n"
);

fs.writeFileSync('frontend/src/components/Testimonials.jsx', testimonials, 'utf8');

console.log('Hero and Testimonials patched successfully.');
