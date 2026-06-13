import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Silver, Gold, Platinum
  price: { type: String }, // e.g., "₹24,999"
  features: [{ type: String }], // Array of included features
  isPopular: { type: Boolean, default: false }
});

const faqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String }
});

const featureSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String }
});

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Newborn Stories"
  slug: { type: String, required: true }, // e.g., "newborn-stories"
  tagline: { type: String }, // e.g. "Capturing Moments That Last Forever"
  description: { type: String },
  imageUrl: { type: String },
  heroImage: { type: String },
  mobileHeroImage: { type: String },
  portfolioImages: [{ type: String }],
  portfolioVideos: [{ type: String }],
  packages: [packageSchema],
  landingAbout: {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String }
  },
  features: [featureSchema],
  faqs: [faqSchema]
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Maternity Stories", "Baby Shoots"
  slug: { type: String, required: true, unique: true }, // e.g. "maternity-stories"
  tagline: { type: String }, // e.g. "Capturing Moments That Last Forever"
  description: { type: String },
  imageUrl: { type: String },
  heroImage: { type: String },
  mobileHeroImage: { type: String },
  portfolioImages: [{ type: String }],
  portfolioVideos: [{ type: String }],
  packages: [packageSchema], // Embedded packages since they belong to a specific service
  landingAbout: {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String }
  },
  features: [featureSchema],
  faqs: [faqSchema],
  subServices: [subServiceSchema], // Array of nested subservices
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
