const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. ADD STATES
if (!content.includes('const [adminUsers, setAdminUsers] = useState([]);')) {
  content = content.replace(
    "const [teamMembers, setTeamMembers] = useState([]);",
    "const [teamMembers, setTeamMembers] = useState([]);\n  const [adminUsers, setAdminUsers] = useState([]);\n  const [editingAdminUser, setEditingAdminUser] = useState(null);"
  );
}

// 2. FETCH ADMIN USERS IN fetchData
if (!content.includes('setAdminUsers(res.data.adminUsers || []);')) {
  // It's probably easier to just add a dedicated fetchAdminUsers function
  const fetchFunction = `
  const fetchAdminUsers = async () => {
    try {
      const res = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users\`, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken') || localStorage.getItem('token')}\` }
      });
      setAdminUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch admin users', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'permissions') {
      fetchAdminUsers();
    }
  }, [activeTab]);
  `;
  
  content = content.replace(
    /const fetchData = async \(\) => {/,
    fetchFunction + '\n  const fetchData = async () => {'
  );
}

// 3. ADD SIDEBAR ITEM
const oldSidebar = `<button onClick={() => setActiveTab('team')} className={\`w-full text-left px-6 py-4 uppercase tracking-[0.2em] text-xs transition-all \${activeTab === 'team' ? 'bg-white/10 text-white border-l-4 border-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}\`}>Team</button>`;
const newSidebar = `${oldSidebar}
            <button onClick={() => setActiveTab('permissions')} className={\`w-full text-left px-6 py-4 uppercase tracking-[0.2em] text-xs transition-all \${activeTab === 'permissions' ? 'bg-white/10 text-white border-l-4 border-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}\`}>Permissions</button>`;

content = content.replace(oldSidebar, newSidebar);

// 4. ADD TAB UI
const permissionsTabUI = `
          {/* PERMISSIONS TAB */}
          {activeTab === 'permissions' && (
            <div className="p-10 max-w-5xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-oswald text-white uppercase tracking-widest">Admin Permissions</h2>
                <button onClick={() => setEditingAdminUser({ email: '', password: '', permissions: [] })} className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">
                  + Add Admin User
                </button>
              </div>

              {editingAdminUser && (
                <div className="bg-[#111] border border-white/10 p-8 mb-10">
                  <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h3 className="text-lg font-oswald text-white uppercase tracking-widest">{editingAdminUser._id ? 'Edit Admin User' : 'New Admin User'}</h3>
                    <button onClick={() => setEditingAdminUser(null)} className="text-white hover:text-red-500 text-xl leading-none">&times;</button>
                  </div>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
                      const headers = { Authorization: \`Bearer \${token}\` };
                      if (editingAdminUser._id) {
                        await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users/\${editingAdminUser._id}\`, editingAdminUser, { headers });
                      } else {
                        await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users\`, editingAdminUser, { headers });
                      }
                      alert('Admin user saved successfully!');
                      setEditingAdminUser(null);
                      fetchAdminUsers();
                    } catch (err) {
                      console.error(err);
                      alert(err.response?.data?.message || 'Failed to save admin user');
                    }
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase text-gray-500 mb-2 tracking-widest">Admin Email</label>
                        <input 
                          type="email" 
                          required
                          className="w-full bg-black border border-white/10 p-4 text-white outline-none focus:border-white/50 transition-colors" 
                          value={editingAdminUser.email || ''} 
                          onChange={e => setEditingAdminUser({...editingAdminUser, email: e.target.value})} 
                          placeholder="admin@imazen.in"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-gray-500 mb-2 tracking-widest">Password</label>
                        <input 
                          type="password" 
                          required={!editingAdminUser._id}
                          className="w-full bg-black border border-white/10 p-4 text-white outline-none focus:border-white/50 transition-colors" 
                          value={editingAdminUser.password || ''} 
                          onChange={e => setEditingAdminUser({...editingAdminUser, password: e.target.value})} 
                          placeholder={editingAdminUser._id ? "Leave blank to keep existing" : "Required"}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-4 tracking-widest">Assign Permissions</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/5 border border-white/10 rounded">
                        {['dashboard', 'leads', 'inquiries', 'bookings', 'calendar', 'slots', 'customers', 'testimonials', 'team', 'cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'permissions', 'developer options'].map(perm => (
                          <label key={perm} className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 accent-white"
                              checked={(editingAdminUser.permissions || []).includes(perm)}
                              onChange={(e) => {
                                const perms = new Set(editingAdminUser.permissions || []);
                                if (e.target.checked) perms.add(perm);
                                else perms.delete(perm);
                                setEditingAdminUser({...editingAdminUser, permissions: Array.from(perms)});
                              }}
                            />
                            <span className="text-xs text-white uppercase tracking-widest">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
                      <button type="submit" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-gray-200">
                        Save Admin User
                      </button>
                      <button type="button" onClick={() => setEditingAdminUser(null)} className="px-8 py-3 border border-white/20 text-white uppercase tracking-widest text-xs hover:bg-white/5">CANCEL</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-[#111] border border-white/10 overflow-hidden">
                <table className="w-full text-left font-sans text-sm">
                  <thead className="bg-white/5 text-xs uppercase font-oswald tracking-[0.1em] text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Admin Email</th>
                      <th className="px-6 py-4">Permissions</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adminUsers.map(user => (
                      <tr key={user._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-bold">{user.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {user.isSuperAdmin ? (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] uppercase tracking-widest rounded">Super Admin</span>
                            ) : (
                              user.permissions?.length > 0 ? user.permissions.map(p => (
                                <span key={p} className="px-2 py-1 bg-white/10 text-gray-300 border border-white/10 text-[9px] uppercase tracking-widest rounded">{p}</span>
                              )) : <span className="text-gray-500 italic text-xs">No permissions</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingAdminUser(user)} className="text-gray-400 hover:text-white uppercase text-xs tracking-widest transition-colors">Edit</button>
                            <button 
                              onClick={async () => {
                                if(window.confirm('Are you sure you want to delete this admin user?')) {
                                  try {
                                    await axios.delete(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users/\${user._id}\`, {
                                      headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken') || localStorage.getItem('token')}\` }
                                    });
                                    fetchAdminUsers();
                                  } catch(err) {
                                    alert(err.response?.data?.message || 'Failed to delete user');
                                  }
                                }
                              }} 
                              className="text-red-500 hover:text-red-400 uppercase text-xs tracking-widest transition-colors"
                            >Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {adminUsers.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">No admin users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
`;

content = content.replace(
  /\{\/\* DEVELOPER OPTIONS TAB \*\/\}/,
  permissionsTabUI + '\n          {/* DEVELOPER OPTIONS TAB */}'
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Permissions tab created successfully');
