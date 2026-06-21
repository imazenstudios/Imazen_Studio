const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// For Service portfolio images
content = content.replace(
  /<button onClick=\{\(\) => \{\s*const newImgs = \[\.\.\.editingService\.portfolioImages\];\s*newImgs\.splice\(idx, 1\);\s*setEditingService\(\{\.\.\.editingService, portfolioImages: newImgs\}\);\s*\}\} className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:scale-110">x<\/button>/g,
  `
  <div className="absolute top-1 right-1 flex flex-col gap-1 z-10">
    <button onClick={() => {
      const newImgs = [...editingService.portfolioImages];
      newImgs.splice(idx, 1);
      setEditingService({...editingService, portfolioImages: newImgs});
    }} className="w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:scale-110">x</button>
    {idx > 0 && <button onClick={() => {
      const newImgs = [...editingService.portfolioImages];
      [newImgs[idx-1], newImgs[idx]] = [newImgs[idx], newImgs[idx-1]];
      setEditingService({...editingService, portfolioImages: newImgs});
    }} className="w-6 h-6 bg-black/50 hover:bg-white hover:text-black rounded-full text-white text-xs flex items-center justify-center transition-colors">↑</button>}
    {idx < editingService.portfolioImages.length - 1 && <button onClick={() => {
      const newImgs = [...editingService.portfolioImages];
      [newImgs[idx+1], newImgs[idx]] = [newImgs[idx], newImgs[idx+1]];
      setEditingService({...editingService, portfolioImages: newImgs});
    }} className="w-6 h-6 bg-black/50 hover:bg-white hover:text-black rounded-full text-white text-xs flex items-center justify-center transition-colors">↓</button>}
  </div>
  `
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx Part 3');
