const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. Add state for admin users
const stateToAdd = `
  const [adminUsersList, setAdminUsersList] = useState([]);
  const [editingAdminUser, setEditingAdminUser] = useState(null);
`;

content = content.replace(
  /const \[adminUser, setAdminUser\] = useState\(null\);/,
  `const [adminUser, setAdminUser] = useState(null);\n${stateToAdd}`
);

// 2. Fetch admin users in fetchData
const fetchToAdd = `
      if (userStr && JSON.parse(userStr).isSuperAdmin) {
        const auRes = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users\`, {
          headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
        }).catch(() => ({ data: [] }));
        setAdminUsersList(auRes.data);
      }
`;

content = content.replace(
  /const userStr = localStorage\.getItem\('adminUser'\);/,
  `const userStr = localStorage.getItem('adminUser');\n${fetchToAdd}`
);

// 3. Replace the team access UI placeholder with actual UI
const teamAccessUI = `
                {/* TEAM ACCESS TAB */}
                {activeTab === 'team access' && adminUser?.isSuperAdmin && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
                      <div>
                        <h2 className="text-xl font-oswald text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest">Team Access Management</h2>
                        <p className="text-xs text-gray-500 font-sans mt-1">Manage admin portal access for your team.</p>
                      </div>
                      <button onClick={() => setEditingAdminUser({ email: '', password: '', permissions: [], isSuperAdmin: false })} className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">Add User</button>
                    </div>

                    <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                      <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/5 text-xs uppercase font-oswald tracking-[0.1em] text-gray-400">
                          <tr>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Permissions</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {adminUsersList.map(u => (
                            <tr key={u._id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-medium">{u.email}</td>
                              <td className="px-6 py-4">
                                {u.isSuperAdmin ? <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs uppercase tracking-widest font-bold">Super Admin</span> : <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs uppercase tracking-widest font-bold">Admin</span>}
                              </td>
                              <td className="px-6 py-4 text-xs font-sans">
                                {u.isSuperAdmin ? 'All Access' : (u.permissions.join(', ') || 'None')}
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-3">
                                <button onClick={() => setEditingAdminUser(u)} className="text-gray-400 hover:text-white transition-colors">EDIT</button>
                                {!u.isSuperAdmin && (
                                  <button onClick={async () => {
                                    if(window.confirm('Delete this user?')) {
                                      try {
                                        await axios.delete(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users/\${u._id}\`, {
                                          headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                                        });
                                        fetchData();
                                      } catch(err) { console.error(err); }
                                    }
                                  }} className="text-red-500 hover:text-red-400 transition-colors">DELETE</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
`;

content = content.replace(
  /\{\/\* TEAM ACCESS TAB \*\/\}\s*\{activeTab === 'team access' && adminUser\?\.isSuperAdmin && \(\s*<div className="space-y-8">[\s\S]*?<\/div>\s*\)\}/,
  teamAccessUI
);

// 4. Add the Editing Admin User Modal
const editingAdminUserModal = `
                {/* EDIT ADMIN USER MODAL */}
                {editingAdminUser && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative my-8">
                      <button onClick={() => setEditingAdminUser(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                      <h2 className="text-2xl font-oswald text-white uppercase tracking-widest mb-6">{editingAdminUser._id ? 'Edit User' : 'Add User'}</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Email</label>
                          <input type="email" className={glassInput} value={editingAdminUser.email} onChange={e => setEditingAdminUser({...editingAdminUser, email: e.target.value})} />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{editingAdminUser._id ? 'Reset Password (leave blank to keep current)' : 'Password'}</label>
                          <input type="password" className={glassInput} value={editingAdminUser.password || ''} onChange={e => setEditingAdminUser({...editingAdminUser, password: e.target.value})} />
                        </div>

                        {!editingAdminUser.isSuperAdmin && (
                          <div>
                            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-3 mt-6">Permissions</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {allTabs.filter(t => t !== 'team access' && t !== 'dashboard').map(tab => (
                                <label key={tab} className="flex items-center gap-2 cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    className="accent-white w-4 h-4"
                                    checked={editingAdminUser.permissions?.includes(tab)}
                                    onChange={e => {
                                      const perms = editingAdminUser.permissions || [];
                                      if (e.target.checked) {
                                        setEditingAdminUser({...editingAdminUser, permissions: [...perms, tab]});
                                      } else {
                                        setEditingAdminUser({...editingAdminUser, permissions: perms.filter(p => p !== tab)});
                                      }
                                    }}
                                  />
                                  <span className="text-xs font-sans text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">{tab}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                          <button onClick={() => setEditingAdminUser(null)} className="px-6 py-2 rounded text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Cancel</button>
                          <button onClick={async () => {
                            try {
                              if (editingAdminUser._id) {
                                await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users/\${editingAdminUser._id}\`, editingAdminUser, {
                                  headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                                });
                              } else {
                                await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users\`, editingAdminUser, {
                                  headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                                });
                              }
                              setEditingAdminUser(null);
                              fetchData();
                            } catch (err) {
                              alert(err.response?.data?.message || 'Error saving user');
                            }
                          }} className="px-8 py-2 rounded bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Save</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

content = content.replace(
  /\{\/\* EDIT HERO MODAL \*\/\}/,
  `${editingAdminUserModal}\n                {/* EDIT HERO MODAL */}`
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx Part 6');
