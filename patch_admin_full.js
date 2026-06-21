const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. LEADS TAB FIXES
// A. Add Filter Dropdown State and UI
const leadsFilterState = `
  const [filterType, setFilterType] = useState('all'); // all, today, thisWeek
`;

if (!content.includes('const [filterType, setFilterType]')) {
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState\('content'\);/,
    `const [activeTab, setActiveTab] = useState('content');\n${leadsFilterState}`
  );
}

const leadsTabUI = `
            <div className="p-10 relative">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-oswald text-white uppercase tracking-widest">Inquiries & Leads</h2>
                <select 
                  className="bg-[#111] border border-white/10 text-white text-xs uppercase tracking-widest p-2 outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Leads</option>
                  <option value="today">Today</option>
                  <option value="thisWeek">This Week</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-gray-500">
                      <th className="p-4 font-normal">Date</th>
                      <th className="p-4 font-normal">Name</th>
                      <th className="p-4 font-normal">Contact</th>
                      <th className="p-4 font-normal">Details</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries
                      .filter(lead => {
                        if (filterType === 'all') return true;
                        const leadDate = new Date(lead.createdAt);
                        const today = new Date();
                        if (filterType === 'today') {
                          return leadDate.toDateString() === today.toDateString();
                        }
                        if (filterType === 'thisWeek') {
                          const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
                          return leadDate >= firstDay;
                        }
                        return true;
                      })
                      .map((lead) => (
                      <tr key={lead._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-xs text-gray-400 font-sans">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm font-oswald uppercase tracking-wider">{lead.name}</td>
                        <td className="p-4 text-xs font-sans text-gray-400">
                          <div>{lead.email}</div>
                          <div>{lead.phone}</div>
                        </td>
                        <td className="p-4 text-xs font-sans text-gray-400">
                          {lead.interestedIn && <div className="text-emerald-400">{lead.interestedIn}</div>}
                          {lead.eventDate && <div>Event: {new Date(lead.eventDate).toLocaleDateString()}</div>}
                          {lead.landingPageSource && <div className="text-[10px] text-gray-500 uppercase mt-1">Source: {lead.landingPageSource}</div>}
                        </td>
                        <td className="p-4">
                          <select 
                            className="bg-[#111] border border-white/10 text-xs uppercase tracking-widest p-2 text-gray-300 outline-none focus:border-white/50"
                            value={lead.status || 'new'}
                            onChange={async (e) => {
                              try {
                                await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/\${lead._id}\`, { status: e.target.value });
                                fetchData();
                              } catch(err) { console.error(err); }
                            }}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="junk lead">Junk Lead</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={async () => {
                              if(window.confirm('Are you sure you want to delete this lead?')) {
                                try {
                                  await axios.delete(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/\${lead._id}\`);
                                  fetchData();
                                } catch(err) { console.error(err); }
                              }
                            }}
                            className="text-red-500 hover:text-red-400 text-xs uppercase tracking-widest"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
`;

content = content.replace(
  /<div className="p-10 relative">\s*<h2 className="text-2xl font-oswald text-white uppercase tracking-widest mb-10">Inquiries & Leads<\/h2>[\s\S]*?(?=<\/div>\s*<\/div>\s*\)\}\s*\{\/\* TEAM MEMBERS TAB \*\/)/,
  leadsTabUI.trim() + '\n              </div>'
);


// 2. HERO SLIDES REORDER
const heroReorderRegex = /<button type="button" onClick=\{[\s\S]*?className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-xs uppercase">Remove<\/button>/g;

content = content.replace(heroReorderRegex, (match) => {
  return match + `
                                <div className="absolute top-2 right-16 flex gap-2">
                                  <button type="button" onClick={() => {
                                    if(idx > 0) {
                                      const newSlides = [...editingLandingPage.heroSlides];
                                      [newSlides[idx-1], newSlides[idx]] = [newSlides[idx], newSlides[idx-1]];
                                      setEditingLandingPage({...editingLandingPage, heroSlides: newSlides});
                                    }
                                  }} className="text-gray-400 hover:text-white text-xs">↑</button>
                                  <button type="button" onClick={() => {
                                    if(idx < editingLandingPage.heroSlides.length - 1) {
                                      const newSlides = [...editingLandingPage.heroSlides];
                                      [newSlides[idx+1], newSlides[idx]] = [newSlides[idx], newSlides[idx+1]];
                                      setEditingLandingPage({...editingLandingPage, heroSlides: newSlides});
                                    }
                                  }} className="text-gray-400 hover:text-white text-xs">↓</button>
                                </div>
  `;
});


// 3. SERVICE CARDS IMAGES REORDER
const serviceImageReorderRegex = /<button type="button" onClick=\{[\s\S]*?className="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 rounded-full text-\[10px\] flex justify-center items-center opacity-0 group-hover:opacity-100">×<\/button>/g;

content = content.replace(serviceImageReorderRegex, (match) => {
  return match + `
                                        <div className="absolute top-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100">
                                          <button type="button" onClick={() => {
                                            if(i > 0) {
                                              const newCards = [...editingLandingPage.serviceCards];
                                              [newCards[idx].images[i-1], newCards[idx].images[i]] = [newCards[idx].images[i], newCards[idx].images[i-1]];
                                              setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                            }
                                          }} className="bg-black/50 text-white w-4 h-4 rounded-full text-[10px] flex justify-center items-center">↑</button>
                                          <button type="button" onClick={() => {
                                            if(i < card.images.length - 1) {
                                              const newCards = [...editingLandingPage.serviceCards];
                                              [newCards[idx].images[i+1], newCards[idx].images[i]] = [newCards[idx].images[i], newCards[idx].images[i+1]];
                                              setEditingLandingPage({...editingLandingPage, serviceCards: newCards});
                                            }
                                          }} className="bg-black/50 text-white w-4 h-4 rounded-full text-[10px] flex justify-center items-center">↓</button>
                                        </div>
  `;
});


// 4. TEAM ACCESS & PERMISSIONS
const newTeamAccessUI = `
                    <div className="pt-4 border-t border-white/10 mt-6">
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-emerald-500" 
                          checked={editingTeamMember.hasAccess || false} 
                          onChange={e => setEditingTeamMember({...editingTeamMember, hasAccess: e.target.checked})} 
                        />
                        <span className="text-xs uppercase text-emerald-400 tracking-widest font-bold">Grant Dashboard Access</span>
                      </label>
                      
                      {editingTeamMember.hasAccess && (
                        <div className="bg-emerald-900/10 p-6 rounded border border-emerald-500/20 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs uppercase text-emerald-500/70 mb-2 tracking-widest">Login Email</label>
                              <input 
                                type="email" 
                                className="w-full bg-black border border-emerald-500/30 p-4 text-white outline-none focus:border-emerald-500 transition-colors" 
                                value={editingTeamMember.email || ''} 
                                onChange={e => setEditingTeamMember({...editingTeamMember, email: e.target.value})} 
                                placeholder="team@imazen.in"
                              />
                            </div>
                            <div>
                              <label className="block text-xs uppercase text-emerald-500/70 mb-2 tracking-widest">Login Password</label>
                              <input 
                                type="password" 
                                className="w-full bg-black border border-emerald-500/30 p-4 text-white outline-none focus:border-emerald-500 transition-colors" 
                                value={editingTeamMember.password || ''} 
                                onChange={e => setEditingTeamMember({...editingTeamMember, password: e.target.value})} 
                                placeholder="Leave blank to keep existing"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs uppercase text-emerald-500/70 mb-3 tracking-widest">Select Permissions</label>
                            <div className="flex flex-wrap gap-4">
                              {['dashboard', 'leads', 'content', 'team', 'settings'].map(perm => (
                                <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="accent-emerald-500"
                                    checked={(editingTeamMember.permissions || []).includes(perm)}
                                    onChange={(e) => {
                                      const perms = new Set(editingTeamMember.permissions || []);
                                      if (e.target.checked) perms.add(perm);
                                      else perms.delete(perm);
                                      setEditingTeamMember({...editingTeamMember, permissions: Array.from(perms)});
                                    }}
                                  />
                                  <span className="text-xs text-white uppercase">{perm}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
`;

// Find and replace the old basic Grant Dashboard Access logic I just injected
content = content.replace(
  /<div className="pt-4 border-t border-white\/10 mt-6">\s*<label className="flex items-center gap-3 cursor-pointer">[\s\S]*?<\/div>\s*<\/div>\s*\}\)\}\s*<\/div>\s*<div className="flex gap-4 pt-4 border-t border-white\/10 mt-6">/,
  newTeamAccessUI + '\n                    <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">'
);

// Update handleSaveTeamMember API call to pass permissions
content = content.replace(
  /await axios\.post\(`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000\/api'\}\/adminUsers\/register`, \{\s*email: tData\.email,\s*password: tData\.password,\s*role: 'admin'\s*\}\);/g,
  "await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users`, { email: tData.email, password: tData.password, permissions: tData.permissions || [] });"
);

// We need to add the JWT to requests if it's missing, but AdminDashboard usually relies on axios interceptors. Let's assume the auth token is managed properly. Wait, admin-users route requires JWT. I will explicitly pass token just in case.
const authHeaders = "headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }";

content = content.replace(
  /await axios\.post\(`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000\/api'\}\/admin-users`, \{(.*?)\}\);/g,
  "await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users`, {$1}, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` } });"
);


fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Massive patch applied successfully');
