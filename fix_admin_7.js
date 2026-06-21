const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

const filterHtmlToReplace = `
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

const newFilterHtml = `
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 mb-1">Quick Filters</span>
                    <select 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'today') {
                          const today = new Date().toISOString().split('T')[0];
                          setDashboardStartDate(today);
                          setDashboardEndDate(today);
                        } else if (val === 'this_week') {
                          // This week (Monday to Sunday)
                          const curr = new Date();
                          const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
                          const last = first + 6;
                          
                          const firstDay = new Date(curr.setDate(first));
                          const lastDay = new Date(curr.setDate(last));
                          
                          setDashboardStartDate(firstDay.toISOString().split('T')[0]);
                          setDashboardEndDate(lastDay.toISOString().split('T')[0]);
                        } else {
                          setDashboardStartDate('');
                          setDashboardEndDate('');
                        }
                      }}
                      className="bg-[#111] border border-white/20 text-white font-sans text-xs px-3 py-2 outline-none focus:border-white/50 rounded uppercase tracking-widest cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="this_week">This Week</option>
                    </select>
                  </div>
`;

// It might have weird spacing since it was inserted by a script earlier, so let's do a more robust regex
content = content.replace(/<span className="text-\[10px\] uppercase text-gray-500 mb-1">Quick Filters<\/span>[\s\S]*?<\/div>\s*<\/div>/, `<span className="text-[10px] uppercase text-gray-500 mb-1">Quick Filters</span>
                    <select 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'today') {
                          const today = new Date().toISOString().split('T')[0];
                          setDashboardStartDate(today);
                          setDashboardEndDate(today);
                        } else if (val === 'this_week') {
                          // This week (Monday to Sunday)
                          const curr = new Date();
                          const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
                          const last = first + 6;
                          
                          const firstDay = new Date(new Date(curr).setDate(first));
                          const lastDay = new Date(new Date(curr).setDate(last));
                          
                          setDashboardStartDate(firstDay.toISOString().split('T')[0]);
                          setDashboardEndDate(lastDay.toISOString().split('T')[0]);
                        } else {
                          setDashboardStartDate('');
                          setDashboardEndDate('');
                        }
                      }}
                      className="bg-[#111] border border-white/20 text-white font-sans text-xs px-3 py-2 outline-none focus:border-white/50 rounded uppercase tracking-widest cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="this_week">This Week</option>
                    </select>
                  </div>`);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx Part 7');
