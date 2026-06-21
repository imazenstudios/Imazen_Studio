const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// For Landing Page portfolio images
content = content.replace(
  /<button onClick=\{\(\) => \{\s*const newImgs = \[\.\.\.editingLandingPage\.portfolioImages\];\s*newImgs\.splice\(idx, 1\);\s*setEditingLandingPage\(\{\.\.\.editingLandingPage, portfolioImages: newImgs\}\);\s*\}\} className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:scale-110">x<\/button>/g,
  `
  <div className="absolute top-1 right-1 flex flex-col gap-1">
    <button onClick={() => {
      const newImgs = [...editingLandingPage.portfolioImages];
      newImgs.splice(idx, 1);
      setEditingLandingPage({...editingLandingPage, portfolioImages: newImgs});
    }} className="w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:scale-110">x</button>
    {idx > 0 && <button onClick={() => {
      const newImgs = [...editingLandingPage.portfolioImages];
      [newImgs[idx-1], newImgs[idx]] = [newImgs[idx], newImgs[idx-1]];
      setEditingLandingPage({...editingLandingPage, portfolioImages: newImgs});
    }} className="w-6 h-6 bg-black/50 hover:bg-white hover:text-black rounded-full text-white text-xs flex items-center justify-center transition-colors">↑</button>}
    {idx < editingLandingPage.portfolioImages.length - 1 && <button onClick={() => {
      const newImgs = [...editingLandingPage.portfolioImages];
      [newImgs[idx+1], newImgs[idx]] = [newImgs[idx], newImgs[idx+1]];
      setEditingLandingPage({...editingLandingPage, portfolioImages: newImgs});
    }} className="w-6 h-6 bg-black/50 hover:bg-white hover:text-black rounded-full text-white text-xs flex items-center justify-center transition-colors">↓</button>}
  </div>
  `
);

// For SubService portfolio images
content = content.replace(
  /<button onClick=\{\(\) => \{\s*const newImgs = \[\.\.\.editingSubService\.data\.portfolioImages\];\s*newImgs\.splice\(idx, 1\);\s*setEditingSubService\(\{\.\.\.editingSubService, data: \{\.\.\.editingSubService\.data, portfolioImages: newImgs\}\}\);\s*\}\} className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:scale-110">x<\/button>/g,
  `
  <div className="absolute top-1 right-1 flex flex-col gap-1 z-10">
    <button onClick={() => {
      const newImgs = [...editingSubService.data.portfolioImages];
      newImgs.splice(idx, 1);
      setEditingSubService({...editingSubService, data: {...editingSubService.data, portfolioImages: newImgs}});
    }} className="w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:scale-110">x</button>
    {idx > 0 && <button onClick={() => {
      const newImgs = [...editingSubService.data.portfolioImages];
      [newImgs[idx-1], newImgs[idx]] = [newImgs[idx], newImgs[idx-1]];
      setEditingSubService({...editingSubService, data: {...editingSubService.data, portfolioImages: newImgs}});
    }} className="w-6 h-6 bg-black/50 hover:bg-white hover:text-black rounded-full text-white text-xs flex items-center justify-center transition-colors">↑</button>}
    {idx < editingSubService.data.portfolioImages.length - 1 && <button onClick={() => {
      const newImgs = [...editingSubService.data.portfolioImages];
      [newImgs[idx+1], newImgs[idx]] = [newImgs[idx], newImgs[idx+1]];
      setEditingSubService({...editingSubService, data: {...editingSubService.data, portfolioImages: newImgs}});
    }} className="w-6 h-6 bg-black/50 hover:bg-white hover:text-black rounded-full text-white text-xs flex items-center justify-center transition-colors">↓</button>}
  </div>
  `
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx Part 2');
