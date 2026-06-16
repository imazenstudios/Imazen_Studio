const fs = require('fs');
const path = require('path');

const targetDir = __dirname;
const excludeDirs = ['node_modules', '.git', '.cache', 'dist', 'build'];
const excludeFiles = ['package-lock.json', 'replace_script.js', 'logo.png'];

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (excludeDirs.includes(file) || excludeFiles.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkAndReplace(fullPath);
    } else if (stat.isFile()) {
      // Check if text file (roughly)
      const ext = path.extname(fullPath).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip'].includes(ext)) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      content = content.replace(/Twilight Studios/g, 'Imazen Studios');
      content = content.replace(/Twilight studios/g, 'Imazen studios');
      content = content.replace(/twilight studios/g, 'imazen studios');
      content = content.replace(/Twilight/g, 'Imazen');
      content = content.replace(/twilight/g, 'imazen');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in: ${fullPath}`);
      }
    }
  }
}

walkAndReplace(targetDir);
console.log('Done replacing.');
