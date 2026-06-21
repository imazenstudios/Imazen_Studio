const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/ReferenceLandingPage.jsx', 'utf8');

// Change object-cover to object-contain for the gallery images
content = content.replace(
  /<img src=\{img\} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" \/>/g,
  `<img src={img} alt="Gallery" className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" />`
);

// We can also apply it to the video thumbnails if they are having the same issue
content = content.replace(
  /className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Video Thumbnail"/g,
  `className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" alt="Video Thumbnail"`
);

// Add a subtle background color or just keep it transparent to clearly show the boundaries.
// Transparent is fine, the border can be added back if they want, but they said "like the first image".
// In the 1st image there's no border, just a gap between images.

fs.writeFileSync('frontend/src/pages/ReferenceLandingPage.jsx', content, 'utf8');
console.log('Fixed Our Portfolio object fit');
