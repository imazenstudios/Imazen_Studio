const fs = require('fs');

// LandingPage.jsx
let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// 1. Logo to fixed
lp = lp.replace('className="absolute top-6 left-6 md:top-8 md:left-12 z-50"', 'className="fixed top-6 left-6 md:top-8 md:left-12 z-[100]"');

// 2. White arrow color fix (text-white -> text-black)
// Since I restored gold, the code currently has bg-[#B89859] with text-white. 
// User wants "in the colors of black, white, grey"
// Up arrow: white background, black arrow
lp = lp.replace('bg-[#B89859]/30 rounded-full blur-md group-hover:bg-[#B89859]/50', 'bg-white/30 rounded-full blur-md group-hover:bg-white/50');
lp = lp.replace('bg-[#B89859] rounded-full flex items-center justify-center border border-white/10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform', 'bg-white rounded-full flex items-center justify-center border border-white/10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform');
lp = lp.replace('<span className="text-white text-xl">↑</span>', '<span className="text-black text-xl font-bold">↑</span>');

// "Hurry, Limited Slots Available!"
lp = lp.replace('text-[#B89859] font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] mb-2 px-4 py-1 border border-[#B89859]', 'text-white font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] mb-2 px-4 py-1 border border-white/30');

// "Book Now" Button to Black/White/Grey + animate-pulse
lp = lp.replace('className="bg-[#B89859] hover:bg-white text-black px-6 md:px-8 py-3 rounded font-oswald text-xs md:text-sm uppercase tracking-[0.2em] transition-colors shadow-2xl animate-bounce"', 'className="bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 rounded font-oswald text-xs md:text-sm uppercase tracking-[0.2em] transition-colors shadow-2xl animate-pulse"');

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');


// Footer.jsx
let footer = fs.readFileSync('frontend/src/components/Footer.jsx', 'utf8');
// Change footer background with /images/logo2.png
footer = footer.replace(
    'className="bg-black text-white relative overflow-hidden pt-32 pb-12 border-t border-white/5"', 
    'className="bg-[#050505] text-white relative overflow-hidden pt-32 pb-12 border-t border-white/5 bg-cover bg-center" style={{ backgroundImage: "url(\'/images/logo2.png\')" }}'
);
// Add a dark overlay so text is readable
if (!footer.includes('absolute inset-0 bg-black/80')) {
    footer = footer.replace(
        'TWILIGHT\n      </div>',
        'TWILIGHT\n      </div>\n      <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>'
    );
}

fs.writeFileSync('frontend/src/components/Footer.jsx', footer, 'utf8');

console.log("Updated LandingPage and Footer");
