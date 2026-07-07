import mongoose from 'mongoose';

const businessPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sharePercentage: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('BusinessPartner', businessPartnerSchema);
