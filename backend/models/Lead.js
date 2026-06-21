import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventDate: { type: Date },
  interestedIn: { type: String },
  landingPageSource: { type: String, default: 'General' }, // Stores the slug or name of the landing page
  status: { type: String, enum: ['new', 'contacted', 'pending', 'confirmed', 'cancelled', 'junk lead'], default: 'new' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
