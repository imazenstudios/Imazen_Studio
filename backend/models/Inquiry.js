import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Pending', 'Negotiation', 'Confirmed', 'Cancelled', 'Junk Lead', 'Converted', 'Lost', 'new', 'contacted', 'pending', 'negotiation', 'confirmed', 'cancelled', 'junk lead'], 
    default: 'Pending' 
  },
  // Follow-ups
  followUps: [{
    note: { type: String, required: true },
    scheduledDate: { type: Date },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
  }]
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);
