import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },     // e.g. "Lead Artist"
  subtitle: { type: String, required: true },  // e.g. "Specialist"
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 }          // For sorting team members
}, { timestamps: true });

export default mongoose.model('TeamMember', teamMemberSchema);
