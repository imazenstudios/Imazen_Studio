const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. Remove t !== 'dashboard' from the permissions checkbox map
content = content.replace(
  /\{allTabs\.filter\(t => t !== 'team access' && t !== 'dashboard'\)\.map\(tab => \(/,
  `{allTabs.filter(t => t !== 'team access').map(tab => (`
);

// 2. Fix the Save button to actually re-fetch the admin users list
// Current:
/*
                              if (editingAdminUser._id) {
                                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users/${editingAdminUser._id}`, editingAdminUser, {
                                  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                                });
                              } else {
                                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users`, editingAdminUser, {
                                  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                                });
                              }
                              setEditingAdminUser(null);
                              fetchData();
*/
const oldSaveLogic = `if (editingAdminUser._id) {
                                await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users/\${editingAdminUser._id}\`, editingAdminUser, {
                                  headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                                });
                              } else {
                                await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users\`, editingAdminUser, {
                                  headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                                });
                              }
                              setEditingAdminUser(null);
                              fetchData();`;

const newSaveLogic = `if (editingAdminUser._id) {
                                await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users/\${editingAdminUser._id}\`, editingAdminUser, {
                                  headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                                });
                              } else {
                                await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users\`, editingAdminUser, {
                                  headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                                });
                              }
                              setEditingAdminUser(null);
                              
                              // Re-fetch admin users
                              const auRes = await axios.get(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin-users\`, {
                                headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
                              }).catch(() => ({ data: [] }));
                              setAdminUsersList(auRes.data);
                              
                              fetchData();`;

content = content.replace(oldSaveLogic, newSaveLogic);

// Wait, the implicit dashboard logic is:
// const allowedTabs = adminUser?.isSuperAdmin 
//     ? allTabs 
//     : allTabs.filter(tab => adminUser?.permissions?.includes(tab) || tab === 'dashboard');
// I should remove `|| tab === 'dashboard'` so they can explicitly toggle it.

content = content.replace(
  /: allTabs\.filter\(tab => adminUser\?\.permissions\?\.includes\(tab\) \|\| tab === 'dashboard'\);/,
  `: allTabs.filter(tab => adminUser?.permissions?.includes(tab));`
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx Part 8');
