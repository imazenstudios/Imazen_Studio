import mongoose from 'mongoose';

const clientGallerySchema = new mongoose.Schema({
  clientEmail: { type: String, required: true },
  clientName: { type: String },
  eventName: { type: String, required: true },
  folderLink: { type: String, required: true }, 
  images: [{
    name: { type: String, required: true }, 
    driveId: { type: String, required: true }, 
    isSelected: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['Pending', 'Submitted'], default: 'Pending' },
  submittedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('ClientGallery', clientGallerySchema);
