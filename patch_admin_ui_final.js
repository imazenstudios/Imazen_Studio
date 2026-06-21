const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. ADD LEADS FILTER STATE
if (!content.includes("const [leadsFilter, setLeadsFilter] = useState('All');")) {
  content = content.replace(
    "const [inquiryFilter, setInquiryFilter] = useState('All');",
    "const [inquiryFilter, setInquiryFilter] = useState('All');\n  const [leadsFilter, setLeadsFilter] = useState('All');"
  );
}

// 2. LEADS TAB UI
// Target exactly the leads tab header
const oldLeadsHeader = '<h2 className="text-xl font-oswald text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest">Landing Page Leads</h2>';
const newLeadsHeader = `
<h2 className="text-xl font-oswald text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest">Landing Page Leads</h2>
<div className="flex gap-4">
  <select 
    className="bg-black/50 border border-white/10 rounded px-4 py-2 text-sm text-gray-300 outline-none uppercase tracking-widest"
    value={leadsFilter}
    onChange={(e) => setLeadsFilter(e.target.value)}
  >
    <option value="All">All Leads</option>
    <option value="Today">Today</option>
    <option value="This Week">This Week</option>
  </select>
</div>
`;

content = content.replace(oldLeadsHeader, newLeadsHeader.trim());

// Target the map function for leads to add the filter
const oldLeadsMap = '{leads.map((lead) => (';
const newLeadsMap = `
{leads.filter(lead => {
  if (leadsFilter === 'All') return true;
  const leadDate = new Date(lead.createdAt);
  const today = new Date();
  if (leadsFilter === 'Today') {
    return leadDate.toDateString() === today.toDateString();
  }
  if (leadsFilter === 'This Week') {
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    return leadDate >= firstDay;
  }
  return true;
}).map((lead) => (
`;

content = content.replace(oldLeadsMap, newLeadsMap.trim());

// Target the Leads table header to add Actions
const oldLeadsTableHead = '<th className="px-6 py-4">Status</th>';
const newLeadsTableHead = `
<th className="px-6 py-4">Status</th>
<th className="px-6 py-4 text-right">Actions</th>
`;
content = content.replace(oldLeadsTableHead, newLeadsTableHead.trim());

// Target the Leads table body to update Status and add Delete button
const oldLeadsStatusSelect = `
                                  <select 
                                    className="bg-black/50 border border-white/10 rounded px-3 py-1 text-xs uppercase"
                                    value={lead.status}
                                    onChange={async (e) => {
                                      try {
                                        await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/\${lead._id}\`, { status: e.target.value });
                                        fetchData();
                                      } catch(err) { console.error(err); }
                                    }}
                                  >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                  </select>
`;
const newLeadsStatusSelect = `
                                  <select 
                                    className="bg-black/50 border border-white/10 rounded px-3 py-1 text-xs uppercase"
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
                                <td className="px-6 py-4 text-right">
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
`;

// It's safer to use a regex that matches the select element
content = content.replace(
  /<select[\s\S]*?<option value="New">New<\/option>\s*<option value="Contacted">Contacted<\/option>\s*<\/select>/,
  newLeadsStatusSelect.trim()
);


// 3. TEAM MEMBERS PERMISSIONS UI
const oldTeamPermissions = `
                    <div className="pt-4 border-t border-white/10 mt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-emerald-500" 
                          checked={editingTeamMember.hasAccess || false} 
                          onChange={e => setEditingTeamMember({...editingTeamMember, hasAccess: e.target.checked})} 
                        />
                        <span className="text-xs uppercase text-emerald-400 tracking-widest font-bold">Grant Dashboard Access</span>
                      </label>
                      
                      {editingTeamMember.hasAccess && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-emerald-900/10 p-6 rounded border border-emerald-500/20">
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
                      )}
                    </div>
`;

const newTeamPermissions = `
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
                              {['dashboard', 'leads', 'inquiries', 'bookings', 'calendar', 'slots', 'customers', 'testimonials', 'team', 'cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'developer options'].map(perm => (
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

content = content.replace(oldTeamPermissions, newTeamPermissions);


// Write file
fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed UI successfully');
