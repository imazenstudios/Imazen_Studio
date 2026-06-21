const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');

// 1. Add permissions to sidebar array
const sidebarRegex = /\{\['dashboard', 'leads', 'inquiries', 'bookings', 'calendar', 'slots', 'customers', 'testimonials', 'team', 'cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'developer options'\]\.map\(tab => \(/;

content = content.replace(sidebarRegex, "{['dashboard', 'leads', 'inquiries', 'bookings', 'calendar', 'slots', 'customers', 'testimonials', 'team', 'cms', 'hero', 'landing pages', 'studio', 'services', 'themes', 'gallery', 'permissions', 'developer options'].map(tab => (");

// 2. Fix the thisWeek date mutation bug
const oldFilterLogic = `
    .filter(item => {
      if (dashboardDateFilter === 'all') return true;
      const itemDate = new Date(item.created);
      const today = new Date();
      if (dashboardDateFilter === 'today') {
        return itemDate.toDateString() === today.toDateString();
      }
      if (dashboardDateFilter === 'thisWeek') {
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        return itemDate >= firstDay;
      }
      return true;
    })
`;

const newFilterLogic = `
    .filter(item => {
      if (dashboardDateFilter === 'all') return true;
      const itemDate = new Date(item.created);
      const today = new Date();
      if (dashboardDateFilter === 'today') {
        return itemDate.toDateString() === today.toDateString();
      }
      if (dashboardDateFilter === 'thisWeek') {
        const todayClone = new Date();
        const firstDay = new Date(todayClone.setDate(todayClone.getDate() - todayClone.getDay()));
        return itemDate >= firstDay;
      }
      return true;
    })
`;

content = content.replace(oldFilterLogic.trim(), newFilterLogic.trim());

fs.writeFileSync('frontend/src/pages/AdminDashboard.jsx', content, 'utf8');
console.log('Sidebar array and filter bug fixed');
