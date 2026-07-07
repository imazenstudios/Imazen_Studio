import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clientName: { type: String },
  email: { type: String },
  phone: { type: String },
  services: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  status: { type: String, default: 'Scheduled' }, // manual string input
  assignedTeamMember: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
