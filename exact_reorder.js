const fs = require('fs');

const lines = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8').split('\n');

const getRange = (start, end) => lines.slice(start, end + 1).join('\n');

const prefix = getRange(0, 1449);
const block_customPackages = getRange(1450, 1495);
const block_heroCarousel = getRange(1496, 1561);
const block_displayVideo = getRange(1562, 1567);
const block_approachSections = getRange(1568, 1619);
const block_portfolioImages = getRange(1620, 1655);
const block_logoUpload = getRange(1656, 1661);
const block_serviceCards = getRange(1662, 1736);
const block_comfortSections = getRange(1737, 1778);
const block_whyChoose = getRange(1779, 1828);
const block_portfolioVideos = getRange(1829, 1868);
const block_parallaxFooter = getRange(1869, 1892);
const block_viewerImages = getRange(1893, 1914);
const block_floatingButtons = getRange(1915, 1929);
const suffix = getRange(1930, lines.length - 1);

// New order based on landing page layout:
// Logo Upload -> Hero Carousel -> Service Cards -> Display Video -> Approach Sections -> Why Choose -> Comfort -> Portfolio Images -> Portfolio Videos -> Custom Packages -> Parallax Footer -> Viewer Images -> Floating Buttons

const newContent = [
    prefix,
    block_logoUpload,
    block_heroCarousel,
    block_serviceCards,
    block_displayVideo,
    block_approachSections,
    block_whyChoose,
    block_comfortSections,
    block_portfolioImages,
    block_portfolioVideos,
    block_customPackages,
    block_parallaxFooter,
    block_viewerImages,
    block_floatingButtons,
    suffix
].join('\n');

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', newContent, 'utf8');
console.log('Reordered AdminDashboard.jsx safely by exact line numbers.');
