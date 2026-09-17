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
  discount: { type: Number, default: 0 },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'converted', 'confirmed', 'shoot done', 'editing in progress', 'payment pending', 'finished', 'cancelled', 'contacted', 'scheduled']
  },
  subEvents: { type: String }, // Legacy field
  deliverables: [{ type: String }],
  complimentries: [{ type: String }],
  subEventList: [{
    name: { type: String, required: true },
    services: [{
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }]
  }],
  // Album option
  album: {
    enabled: { type: Boolean, default: false },
    sheets: { type: Number, default: 0 },
    pricePerSheet: { type: Number, default: 500 }
  },
  // Payment installments
  payments: [{
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Cash', 'UPI'], default: 'Cash' },
    utrNumber: { type: String },
    receivedBy: { type: String },
    date: { type: Date, default: Date.now }
  }],
  // Work progress notes
  followUps: [{
    note: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  // Team assignment
  assignedTeamMember: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
