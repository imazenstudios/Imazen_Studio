const fs = require('fs');

const patchComponent = (filePath, searchStr, replaceStr) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('location.pathname.includes(\'/l/\')') || content.includes('location.pathname.includes(\'/landing-pages/\')')) {
    console.log(filePath + ' already patched.');
    return;
  }
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched ' + filePath);
};

// 1. Navbar
let navbar = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
if (!navbar.includes('const isLandingPage')) {
  navbar = navbar.replace(
    'const location = useLocation();',
    'const location = useLocation();\n  const isLandingPage = location.pathname.startsWith(\'/l/\');'
  );
  navbar = navbar.replace(
    '{/* Desktop Menu */}',
    '{/* Desktop Menu */}\n        {!isLandingPage && ('
  );
  navbar = navbar.replace(
    '</div>\n\n        {/* Mobile Menu Button */}',
    '</div>\n        )}\n\n        {/* Mobile Menu Button */}'
  );
  navbar = navbar.replace(
    '{/* Mobile Menu Button */}',
    '{!isLandingPage && (\n        {/* Mobile Menu Button */}'
  );
  navbar = navbar.replace(
    '</button>\n      </div>',
    '</button>\n        )}\n      </div>'
  );
  
  // Custom logo click for landing pages
  navbar = navbar.replace(
    '<Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-4 group">',
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
          >`
  );
  fs.writeFileSync('frontend/src/components/Navbar.jsx', navbar, 'utf8');
  console.log('Patched Navbar.jsx');
}

// 2. Footer (hide inquiries)
let footer = fs.readFileSync('frontend/src/components/Footer.jsx', 'utf8');
if (!footer.includes('const isLandingPage')) {
  footer = footer.replace(
    'import { Link } from \'react-router-dom\';',
    'import { Link, useLocation } from \'react-router-dom\';'
  );
  footer = footer.replace(
    'const Footer = () => {',
    'const Footer = () => {\n  const location = useLocation();\n  const isLandingPage = location.pathname.startsWith(\'/l/\');'
  );
  footer = footer.replace(
    '{/* Contact & Inquiries */}',
    '{!isLandingPage && (\n          {/* Contact & Inquiries */}'
  );
  footer = footer.replace(
    '</div>\n        </div>\n      </div>\n\n      {/* Bottom Bar */}',
    '</div>\n          )}\n        </div>\n      </div>\n\n      {/* Bottom Bar */}'
  );
  fs.writeFileSync('frontend/src/components/Footer.jsx', footer, 'utf8');
  console.log('Patched Footer.jsx');
}

// 3. WhatsAppButton
let whatsapp = fs.readFileSync('frontend/src/components/WhatsAppButton.jsx', 'utf8');
if (!whatsapp.includes('const isLandingPage')) {
  whatsapp = whatsapp.replace(
    'import { useState, useEffect } from \'react\';',
    'import { useState, useEffect } from \'react\';\nimport { useLocation } from \'react-router-dom\';'
  );
  whatsapp = whatsapp.replace(
    'const [isVisible, setIsVisible] = useState(false);',
    'const [isVisible, setIsVisible] = useState(false);\n  const location = useLocation();\n  const isLandingPage = location.pathname.startsWith(\'/l/\');'
  );
  whatsapp = whatsapp.replace(
    'return (',
    'if (isLandingPage) return null;\n\n  return ('
  );
  fs.writeFileSync('frontend/src/components/WhatsAppButton.jsx', whatsapp, 'utf8');
  console.log('Patched WhatsAppButton.jsx');
}

// 4. ScrollToTopButton
let scrollbtn = fs.readFileSync('frontend/src/components/ScrollToTopButton.jsx', 'utf8');
if (!scrollbtn.includes('const isLandingPage')) {
  scrollbtn = scrollbtn.replace(
    'import { useState, useEffect } from \'react\';',
    'import { useState, useEffect } from \'react\';\nimport { useLocation } from \'react-router-dom\';'
  );
  scrollbtn = scrollbtn.replace(
    'const [isVisible, setIsVisible] = useState(false);',
    'const [isVisible, setIsVisible] = useState(false);\n  const location = useLocation();\n  const isLandingPage = location.pathname.startsWith(\'/l/\');'
  );
  scrollbtn = scrollbtn.replace(
    'return (',
    'if (isLandingPage) return null;\n\n  return ('
  );
  fs.writeFileSync('frontend/src/components/ScrollToTopButton.jsx', scrollbtn, 'utf8');
  console.log('Patched ScrollToTopButton.jsx');
}
