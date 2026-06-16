import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventDate: { type: Date, required: true },
  landingPageSource: { type: String, default: 'General' }, // Stores the slug or name of the landing page
  status: { type: String, enum: ['New', 'Contacted', 'Booked', 'Closed'], default: 'New' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
