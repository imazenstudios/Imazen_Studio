const fs = require('fs');

let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// Restore Gold Buttons and add infinite animation to Book Now
lp = lp.replace('bg-white/30 rounded-full blur-md group-hover:bg-white/50', 'bg-[#B89859]/30 rounded-full blur-md group-hover:bg-[#B89859]/50');
lp = lp.replace('bg-white rounded-full flex items-center justify-center border border-white/10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform', 'bg-[#B89859] rounded-full flex items-center justify-center border border-white/10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform');
lp = lp.replace('<span className="text-black text-xl font-bold">↑</span>', '<span className="text-white text-xl">↑</span>');

lp = lp.replace('text-white font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] mb-2 px-4 py-1 border border-white/30 rounded-full bg-black/80', 'text-[#B89859] font-oswald text-[10px] md:text-xs uppercase tracking-[0.1em] mb-2 px-4 py-1 border border-[#B89859] rounded-full bg-black/80');

lp = lp.replace('className="bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 rounded font-oswald text-xs md:text-sm uppercase tracking-[0.2em] transition-colors shadow-2xl"', 'className="bg-[#B89859] hover:bg-white text-black px-6 md:px-8 py-3 rounded font-oswald text-xs md:text-sm uppercase tracking-[0.2em] transition-colors shadow-2xl animate-bounce"');


// Remove Inquiries from Footer
let footer = fs.readFileSync('frontend/src/components/Footer.jsx', 'utf8');
// We need to completely remove the Inquiries block.
// It's under "Contact & Inquiries"
footer = footer.replace(/\{!\s*hideInquiries\s*&&\s*\([\s\S]*?\)\s*\}/g, "");
footer = footer.replace(/\{?\/\*\s*Contact & Inquiries\s*\*\/\s*\}?[\s\S]*?hello@twilightstudios\.in[\s\S]*?\+919182028835[\s\S]*?<\/div>\s*<\/div>/g, "</div>"); // Just in case

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');
fs.writeFileSync('frontend/src/components/Footer.jsx', footer, 'utf8');
console.log("Fixed UI");
