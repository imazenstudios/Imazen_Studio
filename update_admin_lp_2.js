const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

const newParallaxFields = `
                                  <div className="sm:col-span-2">
                                    <label className="block text-[9px] text-gray-500 mb-1 uppercase">CTA Subheading (Price)</label>
                                    <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.parallaxFooter?.subheading || ''} onChange={e => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter||{}), subheading: e.target.value}})} placeholder="Starts From Just ₹3,999/-" />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-[9px] text-gray-500 mb-1 uppercase">CTA Description</label>
                                    <textarea rows="2" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.parallaxFooter?.description || ''} onChange={e => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter||{}), description: e.target.value}})} placeholder="Access to custom themes..." />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-[9px] text-gray-500 mb-1 uppercase">CTA Button Text</label>
                                    <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.parallaxFooter?.buttonText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter||{}), buttonText: e.target.value}})} placeholder="Claim Your Spot Now" />
                                  </div>
`;

// Insert after the Parallax CTA Heading input
content = content.replace(
  /<label className="block text-\[9px\] text-gray-500 mb-1 uppercase">Heading<\/label>\s*<input type="text" placeholder="Heading \(e\.g\., Book Your Shoot Now\)" className=\{glassInput \+ ' py-2 text-xs'\} value=\{editingLandingPage\.parallaxFooter\?\.heading \|\| ''\} onChange=\{e => setEditingLandingPage\(\{\.\.\.editingLandingPage, parallaxFooter: \{\.\.\.\(editingLandingPage\.parallaxFooter\|\|\{\}\), heading: e\.target\.value\}\}\)\} \/>\s*<\/div>/,
  match => `${match}\n${newParallaxFields}`
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed Parallax fields in AdminDashboard');
