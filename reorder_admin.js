const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// Find the start of the EDIT LANDING PAGE MODAL
const startMarker = "{/* EDIT LANDING PAGE MODAL */}";
const endMarker = "</form>";

const startIndex = content.indexOf(startMarker);
let formStartIndex = content.indexOf('<form', startIndex);
let formEndIndex = content.indexOf(endMarker, formStartIndex);

if (startIndex === -1 || formStartIndex === -1 || formEndIndex === -1) {
    console.log("Could not find modal bounds");
    process.exit(1);
}

function extractBlock(commentStart, commentEndOrNextComment) {
    let regex;
    if (commentEndOrNextComment) {
        regex = new RegExp(`\\{\\/\\* ${commentStart} \\*\\/\\}[\\s\\S]*?(?=\\{\\/\\* ${commentEndOrNextComment} \\*\\/\\})`);
    } else {
        regex = new RegExp(`\\{\\/\\* ${commentStart} \\*\\/\\}[\\s\\S]*?(?=\\{\\/\\* [A-Z0-9 ()]+ \\*\\/\\}|<\\/form>)`);
    }
    const match = content.match(regex);
    if (match) {
        content = content.replace(match[0], ''); 
        return match[0].trim();
    }
    return '';
}

// Extract the blocks
const customPackages = extractBlock('Custom Packages Manager');
const heroCarousel = extractBlock('HERO CAROUSEL');
const displayVideo = extractBlock('DISPLAY VIDEO');
const approachSections = extractBlock('APPROACH SECTIONS');
const portfolioImages = extractBlock('PORTFOLIO IMAGES');
const logoUpload = extractBlock('LOGO UPLOAD');
const serviceCards = extractBlock('SERVICE CARDS \\(WHAT WE DO BEST\\)');
const comfortSections = extractBlock('COMFORT SECTIONS');
const whyChoose = extractBlock('WHY CHOOSE IMAZEN');
const faqs = extractBlock('FAQS SECTION');
const portfolioVideos = extractBlock('PORTFOLIO VIDEOS');
const parallaxFooter = extractBlock('PARALLAX FOOTER');
const viewerImages = extractBlock('360 VIEWER IMAGES');

// Locate the button area
const buttonAreaMarker = `<div className="flex justify-end gap-3 pt-6 border-t border-white/5">`;
const buttonIndex = content.indexOf(buttonAreaMarker, formStartIndex);

if (buttonIndex === -1) {
    console.log("Could not find button area");
    process.exit(1);
}

// The new floating buttons section
const floatingButtons = `
                        {/* FLOATING BUTTONS */}
                        <div className="border-t border-white/5 pt-6 mt-6">
                            <h3 className="text-sm text-gray-400 font-sans tracking-[0.2em] uppercase mb-4">Floating Buttons</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-2">Floating Bubble Text (Top)</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors text-xs" value={editingLandingPage.floatingBubbleText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, floatingBubbleText: e.target.value})} placeholder="e.g. Hurry, Limited Slots Available!" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-2">Floating Button Text (Bottom)</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors text-xs" value={editingLandingPage.floatingButtonText || ''} onChange={e => setEditingLandingPage({...editingLandingPage, floatingButtonText: e.target.value})} placeholder="e.g. BOOK NOW" />
                                </div>
                            </div>
                        </div>
`;

// Reassemble in the exact order of the landing page:
const reorderedContent = [
    logoUpload,
    heroCarousel,
    serviceCards,
    displayVideo,
    approachSections,
    whyChoose,
    comfortSections,
    portfolioImages,
    portfolioVideos,
    customPackages,
    faqs,
    parallaxFooter,
    viewerImages,
    floatingButtons
].filter(Boolean).join('\n\n                        ');

// Insert it right before the button area
content = content.slice(0, buttonIndex) + reorderedContent + '\n\n                        ' + content.slice(buttonIndex);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log("Successfully reordered AdminDashboard.jsx");
