const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/LandingPage.jsx', 'utf8');

// Fix the literal \n
content = content.replace(/\\n\s*\{\/\* 5\. WHY PARENTS LOVE OUR STUDIO & PURE COMFORT \*\/\}/g, '\n      {/* 5. WHY PARENTS LOVE OUR STUDIO & PURE COMFORT */}');

// Fix the hardcoded features array
const hardcodedFeatures = /\{\[\s*\{\s*title:\s*'40\+ Premium Themes',\s*desc:\s*'Amazing, hand-crafted setups for every mood\.'\s*\},\s*\{\s*title:\s*'Certified Newborn Wraps',\s*desc:\s*'Done by professionals ensuring 100% baby comfort\.'\s*\},\s*\{\s*title:\s*'Cinematic Video & Editing',\s*desc:\s*'Premium-grade videos and high-end photo retouching\.'\s*\}\s*\]\.map/g;

content = content.replace(hardcodedFeatures, '(pageData?.features?.length > 0 ? pageData.features : [{ title: "40+ Premium Themes", description: "Amazing, hand-crafted setups for every mood." }, { title: "Certified Newborn Wraps", description: "Done by professionals ensuring 100% baby comfort." }, { title: "Cinematic Video & Editing", description: "Premium-grade videos and high-end photo retouching." }]).map');

// Note: features in pageData use "description", but the hardcoded ones here use "desc". We need to map `item.desc || item.description`.
const featureMapItemDesc = /<p className="text-gray-400 font-light">\{item\.desc\}<\/p>/g;
content = content.replace(featureMapItemDesc, '<p className="text-gray-400 font-light">{item.description || item.desc}</p>');

// Fix the hardcoded comfortItems array
const hardcodedComfort = /\{\[\s*\{\s*title:\s*'100% AC Studio',\s*desc:\s*'Perfectly temperature-controlled and dust-free\.'\s*\},\s*\{\s*title:\s*'Private Nursing Room',\s*desc:\s*'A dedicated, quiet space for baby feeding and makeup\.'\s*\},\s*\{\s*title:\s*'Super Patient Team',\s*desc:\s*"We work completely around your baby's nap and feeding time\."\s*\}\s*\]\.map/g;

content = content.replace(hardcodedComfort, '(pageData?.comfortItems?.length > 0 ? pageData.comfortItems : [{ title: "100% AC Studio", desc: "Perfectly temperature-controlled and dust-free." }, { title: "Private Nursing Room", desc: "A dedicated, quiet space for baby feeding and makeup." }, { title: "Super Patient Team", desc: "We work completely around your baby\'s nap and feeding time." }]).map');

fs.writeFileSync('frontend/src/pages/LandingPage.jsx', content, 'utf8');
console.log('Fixed LandingPage fallbacks and literal newline');
