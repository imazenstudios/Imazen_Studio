const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// Rename Why Choose section
content = content.replace(
  /<h3 className="text-sm text-gray-400 font-sans tracking-\[0\.2em\] uppercase">Why Choose Imazen\? \(Features\)<\/h3>/g,
  '<h3 className="text-sm text-gray-400 font-sans tracking-[0.2em] uppercase">Why Parents Love Our Studio (Features)</h3>'
);
content = content.replace(
  /placeholder="e\.g\. Why Choose Imazen\?"/g,
  'placeholder="e.g. Why Parents Love Our Studio"'
);

// Add missing Parallax Footer inputs
const parallaxFooterRegex = /<label className="block text-xs uppercase text-gray-400 mb-2">Heading<\/label>\s*<input type="text" className=\{glassInput\} value=\{editingLandingPage\.parallaxFooter\?\.heading \|\| ''\} onChange=\{e => setEditingLandingPage\(\{...editingLandingPage, parallaxFooter: \{...\(editingLandingPage\.parallaxFooter \|\| \{\}\), heading: e\.target\.value\}\}\)\} placeholder="e\.g\. Ready to Begin Your Story\?" \/>\s*<\/div>/;

const newParallaxFooterInputs = `<label className="block text-xs uppercase text-gray-400 mb-2">Heading</label>
                              <input type="text" className={glassInput} value={editingLandingPage.parallaxFooter?.heading || ''} onChange={e => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter || {}), heading: e.target.value}})} placeholder="e.g. Ready to Begin Your Story?" />
                            </div>
                            <div>
                              <label className="block text-xs uppercase text-gray-400 mb-2">Subheading</label>
                              <input type="text" className={glassInput} value={editingLandingPage.parallaxFooter?.subheading || ''} onChange={e => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter || {}), subheading: e.target.value}})} placeholder="e.g. Starts From Just ₹3,999/-" />
                            </div>
                            <div>
                              <label className="block text-xs uppercase text-gray-400 mb-2">Description</label>
                              <textarea rows="3" className={glassInput + ' text-sm'} value={editingLandingPage.parallaxFooter?.description || ''} onChange={e => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter || {}), description: e.target.value}})} placeholder="Access to custom themes..."></textarea>
                            </div>
                            <div>
                              <label className="block text-xs uppercase text-gray-400 mb-2">Button Text</label>
                              <input type="text" className={glassInput} value={editingLandingPage.parallaxFooter?.buttonText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, parallaxFooter: {...(editingLandingPage.parallaxFooter || {}), buttonText: e.target.value}})} placeholder="e.g. Claim Your Spot Now" />
                            </div>`;

content = content.replace(parallaxFooterRegex, newParallaxFooterInputs);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Patched AdminDashboard.jsx with footer and why choose renaming');
