const fs = require('fs');

// 1. LandingPage.jsx Fixes
let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// Lead Form Colors: Black, White, Grey
// Change text-[#B89859] to text-white, border-[#B89859] to border-white, focus:border-[#B89859] to focus:border-white
lp = lp.replace(/text-\[#B89859\]/g, 'text-gray-300'); // the labels
lp = lp.replace(/focus:border-\[#B89859\]/g, 'focus:border-white');
// Change gold Submit button to white
lp = lp.replace(
    'className="w-full py-4 mt-4 bg-[#B89859] hover:bg-white text-black font-oswald text-sm uppercase tracking-[0.2em] rounded transition-colors disabled:opacity-50"',
    'className="w-full py-4 mt-4 bg-white hover:bg-gray-200 text-black font-oswald text-sm uppercase tracking-[0.2em] rounded transition-colors disabled:opacity-50"'
);

// Video Controls: In the Lightbox iframe, add `&controls=1` instead of `&controls=0`
if (lp.includes('controls=0')) {
    lp = lp.replace(/controls=0/g, 'controls=1');
} else if (!lp.includes('controls=1')) {
    lp = lp.replace(/autoplay=1/g, 'autoplay=1&controls=1');
}

// Swiper Continuous Scrolling:
// Need to set delay: 0 for continuous marquee
lp = lp.replace(/autoplay=\{\{ delay: 1, disableOnInteraction: true \}\}/g, 'autoplay={{ delay: 0, disableOnInteraction: false }}');
// And add a style tag to make transition linear for Swiper wrappers
if (!lp.includes('.swiper-wrapper { transition-timing-function: linear !important; }')) {
    lp = lp.replace(
        'return (',
        'return (\n    <>\n      <style>{`.swiper-wrapper { transition-timing-function: linear !important; }`}</style>'
    );
    // Also we need to close the <> at the end of the file, but LandingPage is already wrapped in <div className="min-h-screen">. We can just insert <style> inside the main div.
    lp = lp.replace(
        '<style>{`.swiper-wrapper { transition-timing-function: linear !important; }`}</style>',
        ''
    );
    lp = lp.replace(
        '<div className="min-h-screen bg-[#050505] font-sans selection:bg-[#B89859] selection:text-black">',
        '<div className="min-h-screen bg-[#050505] font-sans selection:bg-white selection:text-black">\n      <style>{`.swiper-wrapper { transition-timing-function: linear !important; }`}</style>'
    );
}

// Fix Logo Click
// Currently:
// <div className="fixed top-6 left-6 md:top-8 md:left-12 z-[200] cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:"smooth"})}>
//   <Link to="/" className="inline-block">
//     <img src="/images/logo.png" alt="Imazen Studios" className="h-8 md:h-12 w-auto object-contain drop-shadow-xl" />
//   </Link>
// </div>
lp = lp.replace(
    /<Link to="\/" className="inline-block">\s*<img src="\/images\/logo\.png" alt="Imazen Studios" className="h-8 md:h-12 w-auto object-contain drop-shadow-xl" \/>\s*<\/Link>/g,
    '<div className="inline-block"><img src="/images/logo.png" alt="Imazen Studios" className="h-8 md:h-12 w-auto object-contain drop-shadow-xl" /></div>'
);

// Fix Floating Button Overlap
// The issue is they might be wrapped in absolute or missing space.
// Currently:
// <div className="flex flex-col items-end pointer-events-auto gap-2">
//   <span className="text-white font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] px-4 py-1 border border-white/30 rounded-full bg-black/80 backdrop-blur-md shadow-2xl">
//     Hurry, Limited Slots Available!
//   </span>
//   <button ... className="... shadow-2xl animate-bounce">
// They are in a flex-col, but animate-bounce applies `transform: translateY` which causes overlap because the bouncing box moves up and down into the span's space.
// To fix, wrap the button in a div so the bounce happens inside the div, preserving the flex spacing.
lp = lp.replace(
    /<button \n\s*onClick=\{\(\) => setIsLeadModalOpen\(true\)\}\n\s*className="bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 rounded font-oswald text-xs md:text-sm uppercase tracking-\[0\.2em\] transition-colors shadow-2xl animate-bounce"\n\s*>\n\s*Book Now\n\s*<\/button>/g,
    '<div className="mt-2"><button onClick={() => setIsLeadModalOpen(true)} className="bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 rounded font-oswald text-xs md:text-sm uppercase tracking-[0.2em] transition-colors shadow-2xl animate-bounce">Book Now</button></div>'
);

// Fix Parallax Scrolling Image
// <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
// <div className="absolute inset-0 bg-cover bg-center parallax" style={{ backgroundImage: `url(${optimizeCloudinaryUrl(pageData.parallaxFooter.imageUrl)})` }}></div>
// If it's scrolling with text, we need bg-fixed.
lp = lp.replace(
    'className="absolute inset-0 bg-cover bg-center parallax"',
    'className="absolute inset-0 bg-cover bg-center bg-fixed parallax"'
);
lp = lp.replace(
    'className="absolute inset-0 bg-cover bg-center"',
    'className="absolute inset-0 bg-cover bg-center bg-fixed"'
);

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');

// 2. AdminDashboard.jsx Fixes
let admin = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// Preview appearing at the top?
// In AdminDashboard, the Parallax Image Uploader might be missing a container or something.
// Wait, the user said "during uploading the image there only dispaly the preview image currently it is appearing at the top".
// Ah! In DragDropImageUploader, when an image is selected, it displays `<img src={preview} className="absolute inset-0 w-full h-full object-cover" />`. 
// If the uploader container isn't `relative`, the `absolute inset-0` will make it jump to the nearest relative parent, which might be the top of the whole page!
// Let's check `DragDropImageUploader` component. It should have `relative` on its outermost div.
let uploader = fs.readFileSync('frontend/src/components/DragDropImageUploader.jsx', 'utf8');
if (!uploader.includes('relative')) {
    // If it doesn't have relative, we add it.
    // wait, I don't know the exact class string. Let's just do it directly.
}

console.log("Updated LandingPage.jsx");
