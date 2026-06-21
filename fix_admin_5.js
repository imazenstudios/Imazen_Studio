const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. Add adminUser state or just parse from localStorage inside component
const adminUserSnippet = `
  const [adminUser, setAdminUser] = useState(null);
  useEffect(() => {
    const userStr = localStorage.getItem('adminUser');
    if(userStr) {
      setAdminUser(JSON.parse(userStr));
    }
  }, []);
  
  const allTabs = ['dashboard', 'leads', 'inquiries', 'bookings', 'calendar', 'slots', 'customers', 'testimonials', 'team', 'cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'developer options', 'team access'];
  const allowedTabs = adminUser?.isSuperAdmin 
    ? allTabs 
    : allTabs.filter(tab => adminUser?.permissions?.includes(tab) || tab === 'dashboard');
`;

content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\('dashboard'\);/,
  `const [activeTab, setActiveTab] = useState('dashboard');\n${adminUserSnippet}`
);

content = content.replace(
  /\{\['dashboard', 'leads', 'inquiries', 'bookings', 'calendar', 'slots', 'customers', 'testimonials', 'team', 'cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'developer options'\]\.map\(tab => \(/,
  `{allowedTabs.map(tab => (`
);

content = content.replace(
  /localStorage\.clear\(\); window\.location\.href = '\/';/,
  `localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); window.location.href = '/admin/login';`
);

// Add the Team Access UI placeholder.
const teamAccessHtml = `
                {/* TEAM ACCESS TAB */}
                {activeTab === 'team access' && adminUser?.isSuperAdmin && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
                      <h2 className="text-xl font-oswald text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest">Team Access Management</h2>
                      <p className="text-xs text-gray-500 font-sans">Manage admin portal access for your team.</p>
                    </div>
                    {/* Add actual admin users management logic here later or simple placeholder */}
                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                      <p className="text-sm text-gray-400">Team members will be listed here.</p>
                    </div>
                  </div>
                )}
`;

content = content.replace(
  /\{activeTab === 'developer options' && \(/,
  `${teamAccessHtml}\n                {activeTab === 'developer options' && (`
);

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Fixed AdminDashboard.jsx Part 5');
