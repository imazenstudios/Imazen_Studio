const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// Add the UI fields to the Team Members form
const uiAddition = `
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
                    
                    <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
`;

// Inject UI before the submit button
content = content.replace(
  /<div className="flex gap-4 pt-4 border-t border-white\/10">\s*<button type="submit" disabled=\{isGlobalSubmitting\}/,
  uiAddition + '                      <button type="submit" disabled={isGlobalSubmitting}'
);

// Update handleSaveTeamMember to create admin user
const newSaveLogic = `
  const handleSaveTeamMember = async (e, tData) => {
    e.preventDefault();
    try {
      if (tData._id) {
        await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/team/\${tData._id}\`, tData);
      } else {
        await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/team\`, tData);
      }
      
      if (tData.hasAccess && tData.email && tData.password) {
        try {
           await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/adminUsers/register\`, {
             email: tData.email,
             password: tData.password,
             role: 'admin'
           });
           alert('Team member saved and Dashboard Access granted successfully!');
        } catch (err) {
           console.error('Failed to create admin user access:', err);
           alert('Team member saved, but failed to grant dashboard access (Email might already be in use).');
        }
      } else {
        alert('Team member saved!');
      }

      fetchData();
      setEditingTeamMember(null);
    } catch (error) {
      console.error(error);
      alert('Failed to save team member');
    }
  };
`;

content = content.replace(
  /const handleSaveTeamMember = async \(e, tData\) => \{[\s\S]*?alert\('Failed to save team member'\);\s*\}\s*\};/,
  newSaveLogic.trim()
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Restored team access functionality in AdminDashboard.jsx');
