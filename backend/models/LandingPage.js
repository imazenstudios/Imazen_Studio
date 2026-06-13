import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String }
});

const faqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String }
});

const landingPageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  heroImage: { type: String },
  mobileHeroImage: { type: String },
  landingAbout: {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String }
  },
  features: [featureSchema],
  faqs: [faqSchema],
  portfolioImages: [{ type: String }],
  portfolioVideos: [{ type: String }],
  callToActionLink: { type: String }, // e.g., link to a specific package or whatsapp
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('LandingPage', landingPageSchema);
