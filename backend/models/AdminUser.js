import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSuperAdmin: { type: Boolean, default: false },
  permissions: [{ type: String }], // e.g. ['dashboard', 'leads', 'bookings', 'cms']
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

export default mongoose.model('AdminUser', adminUserSchema);
