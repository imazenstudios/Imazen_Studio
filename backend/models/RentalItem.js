import mongoose from 'mongoose';

const RentalItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('RentalItem', RentalItemSchema);
