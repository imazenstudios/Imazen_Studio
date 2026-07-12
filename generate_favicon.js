const fs = require('fs');
const image = fs.readFileSync('frontend/public/images/logo2.png');
const base64 = image.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="100%" height="100%" fill="white" />
  <image href="data:image/png;base64,${base64}" width="100%" height="100%" />
</svg>`;
fs.writeFileSync('frontend/public/images/favicon.svg', svg);
console.log('Favicon created');
