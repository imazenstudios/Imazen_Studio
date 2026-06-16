const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. State variable for leads
content = content.replace(
  'const [inquiries, setInquiries] = useState([]);',
  'const [inquiries, setInquiries] = useState([]);\n  const [leads, setLeads] = useState([]);'
);

// 2. Fetch leads in Promise.all
content = content.replace(
  'subscriptionsRes',
  'subscriptionsRes,\n        leadsRes'
);

content = content.replace(
  "axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/subscriptions`)",
  "axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/subscriptions`),\n        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads`)"
);

// 3. Set leads state
content = content.replace(
  'setInquiries(inquiriesRes.data);',
  'setInquiries(inquiriesRes.data);\n      setLeads(leadsRes.data);'
);

// 4. Update sidebar tabs
content = content.replace(
  "['cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'bookings', 'slots', 'inquiries', 'customers', 'testimonials', 'team', 'developer options']",
  "['cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'bookings', 'slots', 'inquiries', 'leads', 'customers', 'testimonials', 'team', 'developer options']"
);

// 5. Add Leads tab component
const leadsTabUI = `
                {/* LEADS TAB */}
                {activeTab === 'leads' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
                      <h2 className="text-xl font-oswald text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest">Landing Page Leads</h2>
                    </div>
                    <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm text-gray-300">
                          <thead className="bg-white/5 text-xs uppercase font-oswald tracking-[0.1em] text-gray-400">
                            <tr>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Source</th>
                              <th className="px-6 py-4">Name</th>
                              <th className="px-6 py-4">Contact</th>
                              <th className="px-6 py-4">Event Date</th>
                              <th className="px-6 py-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {leads.map((lead) => (
                              <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className="bg-white/10 px-3 py-1 rounded-full text-xs">{lead.landingPageSource}</span></td>
                                <td className="px-6 py-4 font-bold text-white">{lead.name}</td>
                                <td className="px-6 py-4">
                                  <div>{lead.email}</div>
                                  <div className="text-gray-500 text-xs">{lead.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-emerald-400">{new Date(lead.eventDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
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
                                    <option value="Booked">Booked</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {leads.length === 0 && (
                              <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">No leads found yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
`;

content = content.replace(
  "{activeTab === 'customers' && (",
  leadsTabUI + "\n                {activeTab === 'customers' && ("
);

// 6. Update Landing Page Package Selector
const packageSelector = `
                            <div className="flex items-center gap-3">
                              <input type="checkbox" id="showPackages" checked={editingLandingPage.showPackages || false} onChange={e => setEditingLandingPage({...editingLandingPage, showPackages: e.target.checked})} className="w-5 h-5 accent-emerald-500" />
                              <label htmlFor="showPackages" className="text-xs uppercase text-gray-400">Show Packages</label>
                            </div>
                          </div>
                          
                          {/* Selected Packages Manager */}
                          {editingLandingPage.showPackages && (
                            <div className="mt-4 p-4 border border-white/10 rounded bg-black/40">
                              <label className="block text-[9px] text-gray-500 mb-2 uppercase">Select Packages to Display</label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {services.map(pkg => {
                                  const isSelected = (editingLandingPage.selectedPackages || []).includes(pkg._id);
                                  return (
                                    <div key={pkg._id} className="flex items-start gap-2">
                                      <input 
                                        type="checkbox" 
                                        checked={isSelected}
                                        onChange={(e) => {
                                          let newPackages = [...(editingLandingPage.selectedPackages || [])];
                                          if (e.target.checked) {
                                            newPackages.push(pkg._id);
                                          } else {
                                            newPackages = newPackages.filter(id => id !== pkg._id);
                                          }
                                          setEditingLandingPage({...editingLandingPage, selectedPackages: newPackages});
                                        }}
                                        className="mt-1"
                                      />
                                      <span className="text-xs text-white/80">{pkg.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
`;

content = content.replace(
  /<div className="flex items-center gap-3">[\s\n]*<input type="checkbox" id="showPackages" checked=\{editingLandingPage\.showPackages \|\| false\} onChange=\{e => setEditingLandingPage\(\{\.\.\.editingLandingPage, showPackages: e\.target\.checked\}\)\} className="w-5 h-5 accent-emerald-500" \/>[\s\n]*<label htmlFor="showPackages" className="text-xs uppercase text-gray-400">Show Packages<\/label>[\s\n]*<\/div>[\s\n]*<\/div>/g,
  packageSelector
);


fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Successfully patched AdminDashboard.jsx for leads and packages');
