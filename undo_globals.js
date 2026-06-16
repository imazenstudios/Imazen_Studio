const fs = require('fs');

let navbar = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
navbar = navbar.replace("import { useLocation } from 'react-router-dom';", ""); // Just in case
navbar = navbar.replace("const location = useLocation();\n  const isLandingPage = location.pathname.startsWith('/l/');", "const location = useLocation();");
navbar = navbar.replace("{/* Desktop Menu */}\n        {!isLandingPage && (", "{/* Desktop Menu */}");
navbar = navbar.replace("</div>\n        )}\n\n        {/* Mobile Menu Button */}", "</div>\n\n        {/* Mobile Menu Button */}");
navbar = navbar.replace("{!isLandingPage && (\n        {/* Mobile Menu Button */}", "{/* Mobile Menu Button */}");
navbar = navbar.replace("</button>\n        )}\n      </div>", "</button>\n      </div>");
navbar = navbar.replace(
  `<Link 
            to={isLandingPage ? "#" : "/"} 
            onClick={(e) => {
              if(isLandingPage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo(0, 0);
              }
            }} 
            className="flex items-center gap-4 group"
          >`,
  '<Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-4 group">'
);
fs.writeFileSync('frontend/src/components/Navbar.jsx', navbar, 'utf8');


let footer = fs.readFileSync('frontend/src/components/Footer.jsx', 'utf8');
footer = footer.replace("import { Link, useLocation } from 'react-router-dom';", "import { Link } from 'react-router-dom';");
footer = footer.replace("const Footer = () => {\n  const location = useLocation();\n  const isLandingPage = location.pathname.startsWith('/l/');", "const Footer = () => {");
footer = footer.replace("{!isLandingPage && (\n          {/* Contact & Inquiries */}", "{/* Contact & Inquiries */}");
footer = footer.replace("</div>\n          )}\n        </div>\n      </div>\n\n      {/* Bottom Bar */}", "</div>\n        </div>\n      </div>\n\n      {/* Bottom Bar */}");
fs.writeFileSync('frontend/src/components/Footer.jsx', footer, 'utf8');


let whatsapp = fs.readFileSync('frontend/src/components/WhatsAppButton.jsx', 'utf8');
whatsapp = whatsapp.replace("import { useState, useEffect } from 'react';\nimport { useLocation } from 'react-router-dom';", "import { useState, useEffect } from 'react';");
whatsapp = whatsapp.replace("const [isVisible, setIsVisible] = useState(false);\n  const location = useLocation();\n  const isLandingPage = location.pathname.startsWith('/l/');", "const [isVisible, setIsVisible] = useState(false);");
whatsapp = whatsapp.replace("if (isLandingPage) return null;\n\n  return (", "return (");
fs.writeFileSync('frontend/src/components/WhatsAppButton.jsx', whatsapp, 'utf8');


let scrollbtn = fs.readFileSync('frontend/src/components/ScrollToTopButton.jsx', 'utf8');
scrollbtn = scrollbtn.replace("import { useState, useEffect } from 'react';\nimport { useLocation } from 'react-router-dom';", "import { useState, useEffect } from 'react';");
scrollbtn = scrollbtn.replace("const [isVisible, setIsVisible] = useState(false);\n  const location = useLocation();\n  const isLandingPage = location.pathname.startsWith('/l/');", "const [isVisible, setIsVisible] = useState(false);");
scrollbtn = scrollbtn.replace("if (isLandingPage) return null;\n\n  return (", "return (");
fs.writeFileSync('frontend/src/components/ScrollToTopButton.jsx', scrollbtn, 'utf8');

console.log("Reverted globals successfully.");
