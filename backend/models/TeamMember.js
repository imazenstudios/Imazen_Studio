import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  email: { type: String },                     // For sending assignment emails
  imageUrl: { type: String, default: '' },
  order: { type: Number, default: 0 }          // For sorting team members
}, { timestamps: true });

export default mongoose.model('TeamMember', teamMemberSchema);
