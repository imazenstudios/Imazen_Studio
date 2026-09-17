import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventDate: { type: Date },
  interestedIn: { type: String },
  landingPageSource: { type: String, default: 'General' }, // Stores the slug or name of the landing page
  status: { type: String, enum: ['new', 'contacted', 'pending', 'negotiation', 'confirmed', 'cancelled', 'junk lead'], default: 'new' },
  notes: { type: String },
  followUps: [{
    note: { type: String, required: true },
    scheduledDate: { type: Date },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
  }]
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
