const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

content = content.replace(
  /\{pageData\?\.heroHeading \|\| 'Beautiful Baby\\nPhotography'\}/g,
  `<span style={{ whiteSpace: 'pre-line' }}>{pageData?.heroHeading || 'Beautiful Baby\\nPhotography'}</span>`
);

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', content, 'utf8');
console.log('Fixed newline in LandingPage.jsx');
