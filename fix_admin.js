const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. Change 'spots' to 'slots'
content = content.replace(/spots remaining/g, 'slots remaining');

// 2. Change Lead Status dropdown values
const oldLeadSelect = `<select 
                                    className="bg-[#222] border border-white/10 text-white text-xs px-2 py-1 rounded focus:outline-none"
                                    value={lead.status}
                                    onChange={async (e) => {
                                      try {
                                        await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/\${lead._id}\`, { status: e.target.value });
                                        fetchLeads(); // Refresh leads
                                      } catch (err) {
                                        console.error('Error updating lead status', err);
                                      }
                                    }}
                                  >
                                    <option value="NEW">NEW</option>
                                    <option value="CONTACTED">CONTACTED</option>
                                    <option value="BOOKED">BOOKED</option>
                                    <option value="CLOSED">CLOSED</option>
                                  </select>`;

const newLeadSelect = `<select 
                                    className="bg-[#222] border border-white/10 text-white text-xs px-2 py-1 rounded focus:outline-none"
                                    value={lead.status || 'NEW'}
                                    onChange={async (e) => {
                                      try {
                                        await axios.put(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads/\${lead._id}\`, { status: e.target.value });
                                        fetchLeads(); // Refresh leads
                                      } catch (err) {
                                        console.error('Error updating lead status', err);
                                      }
                                    }}
                                  >
                                    <option value="NEW">NEW</option>
                                    <option value="CONTACTED">CONTACTED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                    <option value="JUNK LEAD">JUNK LEAD</option>
                                  </select>`;

// Replace old select with new one, we will use regex to be safe.
content = content.replace(/<select[\s\S]*?value=\{lead\.status\}[\s\S]*?onChange=\{async \(e\) => {[\s\S]*?\}[\s\S]*?>[\s\S]*?<\/select>/, newLeadSelect);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx leads and slots');
