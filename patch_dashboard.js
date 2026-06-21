const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// Replace state
if (content.includes("const [dashboardStartDate, setDashboardStartDate] = useState('');")) {
  content = content.replace(
    "const [dashboardStartDate, setDashboardStartDate] = useState('');\n  const [dashboardEndDate, setDashboardEndDate] = useState('');",
    "const [dashboardCardsDateFilter, setDashboardCardsDateFilter] = useState('all');"
  );
  
  // Replace filterByDate logic
  content = content.replace(
    /const filterByDate = \(items\) => \{[\s\S]*?\};\n/,
    `const filterByDate = (items) => {
    return items.filter(item => {
      if (dashboardCardsDateFilter === 'all') return true;
      const itemDate = new Date(item.createdAt || item.date);
      const today = new Date();
      if (dashboardCardsDateFilter === 'today') {
        return itemDate.toDateString() === today.toDateString();
      }
      if (dashboardCardsDateFilter === 'thisWeek') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return itemDate >= sevenDaysAgo && itemDate <= today;
      }
      return true;
    });
  };\n`
  );
  
  // Replace the HTML inputs for start date and end date
  const startHtml = `<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-oswald uppercase tracking-widest text-white">Performance Overview</h2>
                  <p className="text-gray-400 font-sans font-light text-sm mt-1">Track your inquiries and conversion metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 mb-1">Start Date</span>
                    <input 
                      type="date" 
                      className="bg-black/40 border border-white/20 text-white font-sans text-xs px-3 py-2 outline-none focus:border-white/50 rounded [color-scheme:dark]"
                      value={dashboardStartDate}
                      onChange={(e) => setDashboardStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 mb-1">End Date</span>
                    <input 
                      type="date" 
                      className="bg-black/40 border border-white/20 text-white font-sans text-xs px-3 py-2 outline-none focus:border-white/50 rounded [color-scheme:dark]"
                      value={dashboardEndDate}
                      onChange={(e) => setDashboardEndDate(e.target.value)}
                    />
                  </div>
                  {(dashboardStartDate || dashboardEndDate) && (
                    <button 
                      onClick={() => { setDashboardStartDate(''); setDashboardEndDate(''); }}
                      className="mt-5 text-[10px] uppercase text-gray-400 hover:text-white underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>`;
              
  const replacementHtml = `<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-oswald uppercase tracking-widest text-white">Performance Overview</h2>
                  <p className="text-gray-400 font-sans font-light text-sm mt-1">Track your inquiries and conversion metrics.</p>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    className="bg-black/40 border border-white/20 text-white font-sans text-xs px-4 py-2 outline-none focus:border-white/50 rounded uppercase tracking-widest cursor-pointer"
                    value={dashboardCardsDateFilter}
                    onChange={(e) => setDashboardCardsDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">Past 7 Days</option>
                  </select>
                </div>
              </div>`;
              
  content = content.replace(startHtml, replacementHtml);
}

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content);
console.log("AdminDashboard.jsx patched");
