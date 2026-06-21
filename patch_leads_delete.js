const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// The new select and delete button UI
const replacement = `                                  <select 
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
                                </td>
                              </tr>`;

const regex = /<select[\s\S]*?<option value="New">New<\/option>[\s\S]*?<option value="Closed">Closed<\/option>\s*<\/select>\s*<\/td>\s*<\/tr>/;

if (regex.test(content)) {
  content = content.replace(regex, replacement.trim());
  fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
  console.log('Fixed leads status & delete successfully');
} else {
  console.log('Failed to match leads status select');
}
