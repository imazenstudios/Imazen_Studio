const fs = require('fs');

let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

if (!lp.includes("import { Swiper, SwiperSlide } from 'swiper/react';")) {
    lp = lp.replace("import NotFound from './NotFound';", 
`import NotFound from './NotFound';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';`);
}

// Images Gallery Replace
// The previous code had:
// <div className="relative w-full">
//   <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 lg:px-12 pb-8">
//     {pageData.portfolioImages.map((img, i) => (
//       <div ...>
//         <img ... />
//       </div>
//     ))}
//   </div>
// </div>

const imagesRegex = /<div className="relative w-full">\s*<div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 lg:px-12 pb-8">([\s\S]*?)<\/div>\s*<\/div>/;
const imagesMatch = lp.match(imagesRegex);
if (imagesMatch) {
    let imagesContent = imagesMatch[1];
    // Replace <div key={i} ...> with <SwiperSlide key={i} ...>
    imagesContent = imagesContent.replace(/<div\s+key=\{i\}\s+onClick=\{\(\) => setSelectedImageIndex\(i\)\}/g, '<SwiperSlide key={i} onClick={() => setSelectedImageIndex(i)}');
    imagesContent = imagesContent.replace(/className="w-\[300px\] md:w-\[400px\] h-\[400px\] md:h-\[500px\] flex-shrink-0 cursor-pointer overflow-hidden border border-white\/10 relative snap-start hover:border-white\/30 transition-colors"/g, 'className="!w-[300px] md:!w-[400px] h-[400px] md:h-[500px] cursor-pointer overflow-hidden border border-white/10 relative hover:border-white/30 transition-colors"');
    imagesContent = imagesContent.replace(/<img src=\{optimizeCloudinaryUrl\(img\)\} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" \/>\s*<\/div>/g, '<img src={optimizeCloudinaryUrl(img)} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />\n                </SwiperSlide>');

    const swiperWrapper = `
          <div className="relative w-full px-6 lg:px-12 pb-8">
            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={16}
              freeMode={true}
              loop={true}
              autoplay={{ delay: 1, disableOnInteraction: true }}
              speed={4000}
              className="mySwiper"
            >
              ${imagesContent}
            </Swiper>
          </div>`;
    lp = lp.replace(imagesMatch[0], swiperWrapper);
}

// Videos Gallery Replace
const videosRegex = /<div className="relative w-full">\s*<div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 lg:px-12 pb-8">([\s\S]*?)<\/div>\s*<\/div>/;
const videosMatch = lp.match(videosRegex);
if (videosMatch) {
    let videosContent = videosMatch[1];
    videosContent = videosContent.replace(/<div key=\{i\} className="w-\[300px\] md:w-\[500px\] aspect-video flex-shrink-0 overflow-hidden border border-white\/10 relative cursor-pointer snap-start hover:border-white\/30 transition-colors" onClick=\{\(\) => setSelectedVideoIndex\(i\)\}>/g, '<SwiperSlide key={i} className="!w-[300px] md:!w-[500px] aspect-video overflow-hidden border border-white/10 relative cursor-pointer hover:border-white/30 transition-colors" onClick={() => setSelectedVideoIndex(i)}>');
    videosContent = videosContent.replace(/<\/div>\s*<\/div>\s*\);/g, '</div>\n                  </SwiperSlide>\n                );');

    const swiperWrapper = `
          <div className="relative w-full px-6 lg:px-12 pb-8">
            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={16}
              freeMode={true}
              loop={true}
              autoplay={{ delay: 1, disableOnInteraction: true }}
              speed={4000}
              className="mySwiper"
            >
              ${videosContent}
            </Swiper>
          </div>`;
    lp = lp.replace(videosMatch[0], swiperWrapper);
}

// Lead Form Updates
// Currently:
// <form onSubmit={handleSubmit} className="space-y-4 font-sans">
//   <div>
//     <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
//     <input required type="text" ... />
//   </div>
//   ...
//   <button type="submit" ...>Submit Inquiry</button>
// </form>

const formOld = `<form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
              <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
              <input required type="email" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Phone</label>
              <input required type="tel" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Event Date</label>
              <input required type="date" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#B89859] outline-none" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
            </div>
            <button type="submit" disabled={status === 'submitting'} className="w-full py-4 mt-4 bg-[#B89859] hover:bg-white text-black font-oswald text-sm uppercase tracking-[0.2em] rounded-xl transition-colors disabled:opacity-50">
              {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>`;

const formNew = `<form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#B89859] mb-1">Name *</label>
              <input required placeholder="e.g. Aarav Sharma" type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-[#B89859] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#B89859] mb-1">Email Address *</label>
                <input required placeholder="aarav@example.com" type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-[#B89859] outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#B89859] mb-1">Phone Number *</label>
                <input required placeholder="+91 XXXXX XXXXX" type="tel" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-[#B89859] outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#B89859] mb-1">Event Date (Optional)</label>
                <input type="date" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-[#B89859] outline-none" value={formData.eventDate || ''} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#B89859] mb-1">Location (Optional)</label>
                <input placeholder="e.g. Hyderabad, India" type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-[#B89859] outline-none" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#B89859] mb-1">Interested In</label>
              <select className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-[#B89859] outline-none" value={formData.interestedIn || 'Wedding Photography & Film'} onChange={e => setFormData({...formData, interestedIn: e.target.value})}>
                <option value="Wedding Photography & Film">Wedding Photography & Film</option>
                <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                <option value="Maternity Shoot">Maternity Shoot</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#B89859] mb-1">Tell us about your vision</label>
              <textarea placeholder="Give us details about your dates, preferences, number of guests, or custom requests..." rows={3} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-[#B89859] outline-none" value={formData.vision || ''} onChange={e => setFormData({...formData, vision: e.target.value})} />
            </div>
            <button type="submit" disabled={status === 'submitting'} className="w-full py-4 mt-4 bg-[#B89859] hover:bg-white text-black font-oswald text-sm uppercase tracking-[0.2em] rounded transition-colors disabled:opacity-50">
              {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>`;

if (lp.includes(formOld.split('\\n')[0])) {
    // Basic fallback to replace block, using string match might fail if whitespace differs.
    // Let's use regex
    const formRegex = /<form onSubmit=\{handleSubmit\} className="space-y-4 font-sans">[\s\S]*?<\/form>/;
    lp = lp.replace(formRegex, formNew);
}

// Update formData initial state
lp = lp.replace(
    "const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventDate: '' });",
    "const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventDate: '', location: '', interestedIn: 'Wedding Photography & Film', vision: '' });"
);

// Reset state
lp = lp.replace(
    "setFormData({ name: '', email: '', phone: '', eventDate: '' });",
    "setFormData({ name: '', email: '', phone: '', eventDate: '', location: '', interestedIn: 'Wedding Photography & Film', vision: '' });"
);

// Logo UI tweaks: remove dark box background
lp = lp.replace(
    '<div className="fixed top-6 left-6 md:top-8 md:left-12 z-[200] bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 hover:bg-black/60 transition-colors shadow-2xl">',
    '<div className="fixed top-6 left-6 md:top-8 md:left-12 z-[200] cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:"smooth"})}>'
);
// Also link is inside the div, but since we added onClick to div, let's keep the link or remove it to avoid double action
lp = lp.replace(
    '<Link to="/" className="inline-block">\n          <img src="/images/logo.png"',
    '<Link to="/" className="inline-block">\n          <img src="/images/logo.png"' // keep it the same
);

// Floating button overlap
lp = lp.replace(
    '<div className="flex flex-col items-end pointer-events-auto">',
    '<div className="flex flex-col items-end pointer-events-auto gap-2">'
);
lp = lp.replace(
    'text-white font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] mb-2 px-4 py-1 border border-white/30 rounded-full bg-black/80 backdrop-blur-md shadow-2xl',
    'text-white font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-1 border border-white/30 rounded-full bg-black/80 backdrop-blur-md shadow-2xl'
);

// Add Hero Book Now Button
// Inside HeroCarousel
lp = lp.replace(
    '<motion.p \n              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}\n              className="font-sans text-sm md:text-base tracking-[0.2em] text-white/80 uppercase max-w-2xl pointer-events-none"\n            >\n              {slides[currentSlide].description}\n            </motion.p>\n          </div>',
    '<motion.p \n              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}\n              className="font-sans text-sm md:text-base tracking-[0.2em] text-white/80 uppercase max-w-2xl pointer-events-none"\n            >\n              {slides[currentSlide].description}\n            </motion.p>\n            <motion.button \n              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}\n              onClick={(e) => { e.stopPropagation(); document.dispatchEvent(new CustomEvent("openLeadModal")); }}\n              className="mt-8 self-start px-8 py-3 border border-[#B89859] text-[#B89859] hover:bg-[#B89859] hover:text-black uppercase tracking-[0.2em] text-xs font-oswald transition-all pointer-events-auto"\n            >\n              Book Now\n            </motion.button>\n          </div>'
);
// We need to listen for `openLeadModal` inside LandingPage
lp = lp.replace(
    'const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);',
    'const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);\n  useEffect(() => {\n    const handleOpen = () => setIsLeadModalOpen(true);\n    document.addEventListener("openLeadModal", handleOpen);\n    return () => document.removeEventListener("openLeadModal", handleOpen);\n  }, []);'
);

// Custom Packages Heading
lp = lp.replace(
    '<h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white mb-20">Investment</h2>',
    '<h2 className="font-oswald font-light text-3xl md:text-4xl uppercase tracking-[0.2em] text-white mb-20">{pageData.packagesHeading || "Investment"}</h2>'
);

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');

// Backend Model Add `packagesHeading`
let model = fs.readFileSync('backend/models/LandingPage.js', 'utf8');
if (!model.includes('packagesHeading')) {
    model = model.replace(
        'showPackages: { type: Boolean, default: false },',
        'showPackages: { type: Boolean, default: false },\n  packagesHeading: { type: String, default: "Investment" },'
    );
    fs.writeFileSync('backend/models/LandingPage.js', model, 'utf8');
}

// AdminDashboard Updates for Parallax & packagesHeading
let admin = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
if (!admin.includes('packagesHeading')) {
    admin = admin.replace(
        '<label htmlFor="showPackages" className="text-xs uppercase text-gray-400">Show Packages</label>\n                            </div>\n                          </div>',
        '<label htmlFor="showPackages" className="text-xs uppercase text-gray-400">Show Packages</label>\n                            </div>\n                          </div>\n                          {editingLandingPage.showPackages && (\n                            <div className="mt-4">\n                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Packages Heading</label>\n                              <input type="text" className={glassInput + " py-2 text-sm"} placeholder="e.g. Investment" value={editingLandingPage.packagesHeading || ""} onChange={e => setEditingLandingPage({...editingLandingPage, packagesHeading: e.target.value})} />\n                            </div>\n                          )}'
    );
}

// Fix Parallax image upload in AdminDashboard
// The bug might be that the field is updated wrong.
// Currently it is:
// <DragDropImageUploader currentImage={editingLandingPage.parallaxFooter?.imageUrl} aspect={16/9} onUploadSuccess={(url) => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...editingLandingPage.parallaxFooter, imageUrl: url}})} />
// The problem is `editingLandingPage.parallaxFooter` might be undefined.
admin = admin.replace(
    'setEditingLandingPage({...editingLandingPage, parallaxFooter: {...editingLandingPage.parallaxFooter, imageUrl: url}})',
    'setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter || {}), imageUrl: url}})'
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', admin, 'utf8');

console.log("Updated files");
