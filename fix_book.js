const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/Book.jsx', 'utf8');

// Fix the input date class
content = content.replace(/className="w-full bg-\[#111\] border border-white\/20 rounded-none p-4 text-white font-sans focus:outline-none focus:border-white transition-colors"/g, 'className="w-full bg-transparent p-6 font-sans text-lg sm:text-xl text-white focus:outline-none transition-colors [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"');

// Fix the past date blocking in fetchSlots
content = content.replace(/const isToday =[\s\S]*?if\s*\(isToday\)\s*{[\s\S]*?}\s*}/, '');

fs.writeFileSync('frontend/src/pages/Book.jsx', content, 'utf8');
console.log('Fixed Book.jsx');
