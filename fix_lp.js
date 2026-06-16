const fs = require('fs');

// 1. Update Footer.jsx to accept props
let footer = fs.readFileSync('frontend/src/components/Footer.jsx', 'utf8');
footer = footer.replace("const Footer = () => {", "const Footer = ({ isLandingPage = false, hideInquiries = false }) => {");
if (footer.includes("{/* Contact & Inquiries */}")) {
    footer = footer.replace(
        "{/* Contact & Inquiries */}",
        "{!hideInquiries && (\n        {/* Contact & Inquiries */}"
    );
    footer = footer.replace(
        "            </div>\n        </div>\n      </div>\n\n      {/* Bottom Bar */}",
        "            </div>\n        )}\n        </div>\n      </div>\n\n      {/* Bottom Bar */}"
    );
}
fs.writeFileSync('frontend/src/components/Footer.jsx', footer, 'utf8');


// 2. Update LandingPage.jsx
let lp = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// Import Footer
if (!lp.includes("import Footer from")) {
    lp = lp.replace("import NotFound from './NotFound';", "import NotFound from './NotFound';\nimport Footer from '../components/Footer';");
}
if (!lp.includes("import { Link } from 'react-router-dom';")) {
    lp = lp.replace("import { useParams, useNavigate } from 'react-router-dom';", "import { useParams, useNavigate, Link } from 'react-router-dom';");
}

// Fix Hero Carousel Swiping
lp = lp.replace('className="absolute inset-0 cursor-grab active:cursor-grabbing"', 'className="absolute inset-0 cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y" }}');

// Fix Lightbox Images Swiping
lp = lp.replace('className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl cursor-grab active:cursor-grabbing"', 'className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y" }}');

// Fix Lightbox Videos Swiping (adding transparent overlay for touch events so drag works)
lp = lp.replace(
    '<iframe',
    '<div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y" }}></div>\n                      <iframe'
);

// Fix Testimonials fields
lp = lp.replace('"{testimonials[0]?.text}"', '"{testimonials[0]?.reviewText}"');
lp = lp.replace('{testimonials[0]?.name}', '{testimonials[0]?.authorName}');

// Fix Floating UI Colors
lp = lp.replace('bg-[#B89859]/30 rounded-full blur-md group-hover:bg-[#B89859]/50', 'bg-white/30 rounded-full blur-md group-hover:bg-white/50');
lp = lp.replace('bg-[#B89859] rounded-full flex items-center', 'bg-white rounded-full flex items-center');
lp = lp.replace('text-white text-xl', 'text-black text-xl font-bold');

lp = lp.replace('text-[#B89859] font-oswald text-[10px] md:text-xs', 'text-white font-oswald text-[10px] md:text-xs');
lp = lp.replace('border-[#B89859] rounded-full', 'border-white/30 rounded-full');

lp = lp.replace('bg-[#B89859] hover:bg-white text-black', 'bg-white hover:bg-gray-200 text-black');

// Add Logo
if (!lp.includes("Logo at top left")) {
    lp = lp.replace(
        "{/* Floating UI */}",
        `{/* Logo at top left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-12 z-50">
        <Link to="/" className="inline-block">
          <img src="/images/logo.png" alt="Imazen Studios" className="h-8 md:h-12 w-auto object-contain drop-shadow-xl" />
        </Link>
      </div>\n\n      {/* Floating UI */}`
    );
}

// Add Footer at bottom
if (!lp.includes("<Footer")) {
    lp = lp.replace(
        "    </div>\n  );\n};\n\nexport default LandingPage;",
        "      <Footer isLandingPage={true} hideInquiries={true} />\n    </div>\n  );\n};\n\nexport default LandingPage;"
    );
}

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', lp, 'utf8');

console.log("Updated LandingPage and Footer");
