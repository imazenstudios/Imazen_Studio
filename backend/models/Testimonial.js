import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, default: 5 },
  googleReviewUrl: { type: String },
  reviewDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
