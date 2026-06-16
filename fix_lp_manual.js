const fs = require('fs');
let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// Fix the loading return to not have <Helmet> inside
lp = lp.replace(
    '<Helmet>\n        <title>{pageData.name} | Imazen Studios</title>\n      </Helmet>\n      <div className="flex flex-col items-center justify-center',
    '<div className="flex flex-col items-center justify-center'
);

// Add the style block to the main return correctly
if (!lp.includes('<div className="min-h-screen bg-[#050505] font-sans selection:bg-[#B89859] selection:text-black">')) {
    // If it's there, do nothing. If not, maybe it's selection:bg-white
}
lp = lp.replace(
    '<div className="min-h-screen bg-[#050505] font-sans selection:bg-[#B89859] selection:text-black">',
    '<div className="min-h-screen bg-[#050505] font-sans selection:bg-white selection:text-black">\n      <style>{`.swiper-wrapper { transition-timing-function: linear !important; }`}</style>'
);

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');
console.log('Fixed LandingPage.jsx manually');
