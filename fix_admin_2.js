const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. Leads Table header -> Add Action
content = content.replace(
  /<th className="px-6 py-4">Status<\/th>\s*<\/tr>/,
  '<th className="px-6 py-4">Status</th>\n                              <th className="px-6 py-4 text-right">Action</th>\n                            </tr>'
);

// 2. Leads Table body -> Add Delete button
content = content.replace(
  /<\/select>\s*<\/td>\s*<\/tr>/g,
  `</select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={async () => {
                                      if(window.confirm('Delete this lead?')) {
                                        try {
                                          await axios.delete(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/\${lead._id}\`);
                                          fetchData();
                                        } catch(err) { console.error(err); }
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest border border-red-500/30 px-3 py-1 rounded"
                                  >
                                    DELETE
                                  </button>
                                </td>
                              </tr>`
);

// 3. Add Quick Filters in Dashboard
const filterHtml = `
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 mb-1">Quick Filters</span>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setDashboardStartDate(today);
                        setDashboardEndDate(today);
                      }} className="bg-[#111] hover:bg-white hover:text-black border border-white/20 text-white font-sans text-xs px-3 py-2 outline-none rounded uppercase tracking-widest transition-colors">Today</button>
                      <button onClick={() => {
                        const today = new Date();
                        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
                        const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                        setDashboardStartDate(firstDay.toISOString().split('T')[0]);
                        setDashboardEndDate(lastDay.toISOString().split('T')[0]);
                      }} className="bg-[#111] hover:bg-white hover:text-black border border-white/20 text-white font-sans text-xs px-3 py-2 outline-none rounded uppercase tracking-widest transition-colors">This Week</button>
                      <button onClick={() => {
                        setDashboardStartDate('');
                        setDashboardEndDate('');
                      }} className="bg-[#111] hover:bg-white hover:text-black border border-white/20 text-white font-sans text-xs px-3 py-2 outline-none rounded uppercase tracking-widest transition-colors">All</button>
                    </div>
                  </div>
`;

content = content.replace(
  /<div className="flex flex-col">\s*<span className="text-\[10px\] uppercase text-gray-500 mb-1">Start Date<\/span>/,
  filterHtml + '\n                  <div className="flex flex-col">\n                    <span className="text-[10px] uppercase text-gray-500 mb-1">Start Date</span>'
);

// 4. Hero slides reordering
// Let's add the handleMoveHeroUp and Down functions in the script, but it's easier to just do it inline inside the button onclick.
content = content.replace(
  /<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">/,
  `<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {i > 0 && (
                                <button onClick={async () => {
                                  try {
                                    const prevSlide = heroSlides[i-1];
                                    await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/hero/\${slide._id}\`, { order: prevSlide.order || i-1 });
                                    await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/hero/\${prevSlide._id}\`, { order: slide.order || i });
                                    fetchData();
                                  } catch (err) { console.error(err); }
                                }} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">↑</button>
                              )}
                              {i < heroSlides.length - 1 && (
                                <button onClick={async () => {
                                  try {
                                    const nextSlide = heroSlides[i+1];
                                    await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/hero/\${slide._id}\`, { order: nextSlide.order || i+1 });
                                    await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/hero/\${nextSlide._id}\`, { order: slide.order || i });
                                    fetchData();
                                  } catch (err) { console.error(err); }
                                }} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">↓</button>
                              )}`
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx Part 1');
