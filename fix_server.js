const fs = require('fs');
let content = fs.readFileSync('backend/server.js', 'utf8');

// 1. Add imports
const imports = `
import authRoutes from './routes/auth.js';
import adminUsersRoutes from './routes/adminUsers.js';
import AdminUser from './models/AdminUser.js';
import bcrypt from 'bcryptjs';
`;
content = content.replace(/import express from 'express';/, `import express from 'express';\n${imports}`);

// 2. Add routes
const routes = `
app.use('/api/auth', authRoutes);
app.use('/api/admin-users', adminUsersRoutes);
`;
content = content.replace(/app.use\('\/api\/bookings', bookingRoutes\);/, `${routes}\napp.use('/api/bookings', bookingRoutes);`);

// 3. Add auto-create super admin logic inside mongoose.connect.then
const createSuperAdminLogic = `
    // Create super admin if not exists
    const createSuperAdmin = async () => {
      try {
        const adminEmail = 'ssaiprasanth333@gmail.com';
        const existingAdmin = await AdminUser.findOne({ email: adminEmail });
        if (!existingAdmin) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('admin123', salt);
          const newAdmin = new AdminUser({
            email: adminEmail,
            password: hashedPassword,
            isSuperAdmin: true,
            permissions: ['dashboard', 'leads', 'inquiries', 'bookings', 'calendar', 'slots', 'customers', 'testimonials', 'team', 'cms', 'hero', 'teamAccess']
          });
          await newAdmin.save();
          console.log('Super Admin created with default password "admin123"');
        }
      } catch (err) {
        console.error('Error creating super admin:', err);
      }
    };
    createSuperAdmin();
`;

content = content.replace(
  /console.log\('Connected to MongoDB'\);/,
  `console.log('Connected to MongoDB');\n${createSuperAdminLogic}`
);

fs.writeFileSync('backend/server.js', content, 'utf8');
console.log('Fixed server.js');
