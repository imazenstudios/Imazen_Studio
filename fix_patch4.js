const fs = require('fs');

let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// 1. Remove video overlay so native controls work
// The overlay is `<div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y" }}></div>`
// It's located right before `<iframe` in the Fullscreen Video Lightbox section
lp = lp.replace(
    /<div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" style=\{\{ touchAction: "pan-y" \}\}\><\/div>\s*<iframe/g,
    '<iframe'
);

// 2. Swiper Loop Fix
// Find: {pageData.portfolioImages.map((img, i) => (
// Replace with: {[...pageData.portfolioImages, ...pageData.portfolioImages, ...pageData.portfolioImages, ...pageData.portfolioImages].map((img, i) => (
lp = lp.replace(
    /\{pageData\.portfolioImages\.map\(\(img, i\) => \(/g,
    '{[...pageData.portfolioImages, ...pageData.portfolioImages, ...pageData.portfolioImages, ...pageData.portfolioImages].map((img, i) => ('
);

// We need to pass the real index back to setSelectedImageIndex
// Actually, `setSelectedImageIndex(i % pageData.portfolioImages.length)` is better, but since it's just Swiper opening a lightbox, we can just let it open the duplicated index. But the lightbox itself handles prev/next. Better to use modulo.
lp = lp.replace(
    /onClick=\{\(\) => setSelectedImageIndex\(i\)\}/g,
    'onClick={() => setSelectedImageIndex(i % pageData.portfolioImages.length)}'
);

// Same for Videos Gallery
lp = lp.replace(
    /\{pageData\.portfolioVideos\.map\(\(vid, i\) => \{/g,
    '{[...pageData.portfolioVideos, ...pageData.portfolioVideos, ...pageData.portfolioVideos, ...pageData.portfolioVideos].map((vid, i) => {'
);
lp = lp.replace(
    /onClick=\{\(\) => setSelectedVideoIndex\(i\)\}/g,
    'onClick={() => setSelectedVideoIndex(i % pageData.portfolioVideos.length)}'
);

// 3. Parallax Image
// Wait, currently:
// <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
// <div className="absolute inset-0 bg-cover bg-center bg-fixed parallax" style={{ backgroundImage: `url(${optimizeCloudinaryUrl(pageData.parallaxFooter.imageUrl)})` }}></div>
// This works perfectly on desktop. On mobile, bg-fixed is sometimes disabled by iOS Safari. 
// A foolproof parallax is:
// <section className="relative h-[60vh] flex items-center justify-center overflow-hidden" style={{ clipPath: 'inset(0)' }}>
// <div className="fixed inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: ... }}></div>
// But `fixed inset-0` with `clipPath: inset(0)` might be too complex to string-replace easily.
// I will just add `.parallax-true { background-attachment: fixed !important; }` maybe? Let's check `bg-fixed` in Tailwind. It literally adds `background-attachment: fixed;`.
// If it's scrolling WITH the text, it means the element itself is scrolling.
// Let's replace the whole section to use Framer Motion or absolute fixed technique.

const parallaxOld = `<section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed parallax" style={{ backgroundImage: \`url(\${optimizeCloudinaryUrl(pageData.parallaxFooter.imageUrl)})\` }}></div>`;

const parallaxNew = `<section className="relative h-[60vh] flex items-center justify-center" style={{ clipPath: "inset(0)" }}>
        <div className="fixed inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: \`url(\${optimizeCloudinaryUrl(pageData.parallaxFooter.imageUrl)})\`, zIndex: -1 }}></div>`;

if (lp.includes(parallaxOld)) {
    lp = lp.replace(parallaxOld, parallaxNew);
} else {
    // try fallback
    lp = lp.replace(
        /<section className="relative h-\[60vh\] flex items-center justify-center overflow-hidden">\s*<div className="absolute inset-0 bg-cover bg-center bg-fixed parallax"/g,
        '<section className="relative h-[60vh] flex items-center justify-center" style={{ clipPath: "inset(0)" }}>\n        <div className="fixed inset-0 w-full h-full bg-cover bg-center"'
    );
}

// 4. Also center the Book Now button properly in HeroCarousel.
// I replaced `mx-auto` but wait, in `HeroCarousel`, the parent div is:
// <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6">
// So `mx-auto` should center it. 

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');

console.log("Applied patch 4");
