const fs = require('fs');
let content = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const imports = `
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
`;

content = content.replace(/import AdminDashboard from '\.\/pages\/AdminDashboard';/, `import AdminDashboard from './pages/AdminDashboard';${imports}`);

content = content.replace(
  /<Route path="\/admin\/\*" element=\{<Layout><AdminDashboard \/><\/Layout>\} \/>/,
  `<Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />`
);

fs.writeFileSync('frontend/src/App.jsx', content, 'utf8');
console.log('Fixed App.jsx');
