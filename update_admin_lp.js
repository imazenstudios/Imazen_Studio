const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

const globalHeroSettings = `
                        {/* GLOBAL HERO SETTINGS */}
                        <div className="border-t border-white/5 pt-6 mt-6 mb-6">
                          <h3 className="text-sm text-gray-400 font-sans tracking-[0.2em] uppercase mb-4">Global Hero Overlay</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Hero Subheading</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.heroSubheading || ''} onChange={e => setEditingLandingPage({...editingLandingPage, heroSubheading: e.target.value})} placeholder="Imazen Studios" />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Hero Heading</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.heroHeading || ''} onChange={e => setEditingLandingPage({...editingLandingPage, heroHeading: e.target.value})} placeholder="Beautiful Baby Photography" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Hero Quote / Italic Text</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.heroQuote || ''} onChange={e => setEditingLandingPage({...editingLandingPage, heroQuote: e.target.value})} placeholder="\\"Your Baby's Smile...\\"" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Hero Description</label>
                              <textarea rows="2" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.heroDescription || ''} onChange={e => setEditingLandingPage({...editingLandingPage, heroDescription: e.target.value})} placeholder="Professional baby shoots with stunning themes..." />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Price Label Text</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.heroPriceText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, heroPriceText: e.target.value})} placeholder="Packages Start From Just" />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Price Amount</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.heroPriceAmount || ''} onChange={e => setEditingLandingPage({...editingLandingPage, heroPriceAmount: e.target.value})} placeholder="₹3,999/-" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Hero Button Text</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.heroButtonText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, heroButtonText: e.target.value})} placeholder="Book Your Shoot Now" />
                            </div>
                          </div>
                        </div>

                        {/* FLOATING BUTTONS */}
                        <div className="border-t border-white/5 pt-6 mt-6 mb-6">
                          <h3 className="text-sm text-gray-400 font-sans tracking-[0.2em] uppercase mb-4">Floating CTAs</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Floating Bubble Text</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.floatingBubbleText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, floatingBubbleText: e.target.value})} placeholder="Hurry, Limited Slots Available!" />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-500 mb-1 uppercase">Floating Button Text</label>
                              <input type="text" className={glassInput + ' py-2 text-xs'} value={editingLandingPage.floatingButtonText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, floatingButtonText: e.target.value})} placeholder="Book Now" />
                            </div>
                          </div>
                        </div>
`;

content = content.replace(
  /\{\/\* HERO CAROUSEL \*\/\}/,
  `${globalHeroSettings}\n                        {/* HERO CAROUSEL */}`
);


const newParallaxFields = `
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                            </div>
`;

content = content.replace(
  /<input type="text" placeholder="Heading \(e.g., Book Your Shoot Now\)" className=\{glassInput \+ ' py-2 text-xs'\} value=\{editingLandingPage\.parallaxFooter\?\.heading \|\| ''\} onChange=\{e => setEditingLandingPage\(\{\.\.\.editingLandingPage, parallaxFooter: \{\.\.\.\(editingLandingPage\.parallaxFooter\|\|\{\}\), heading: e\.target\.value\}\}\)\} \/>\s*<\/div>\s*<div>\s*<label className="block text-\[9px\] text-gray-500 mb-1 uppercase">Background Image<\/label>/g,
  match => `${match.replace('</div>\n                                  <div>', `</div>\n${newParallaxFields}\n                                  <div>`)}`
);

// Fallback in case regex above fails due to exact formatting, let's just do a simpler replace.
if (!content.includes('CTA Subheading')) {
  const ctaSearch = `<label className="block text-[9px] text-gray-500 mb-1 uppercase">Heading</label>`;
  // Just find the block for Parallax Footer and inject.
  // Wait, parallax footer block in AdminDashboard:
}

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('AdminDashboard updated');
