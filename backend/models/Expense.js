import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Studio', 'Shoot', 'Event', 'Prop'], required: true },
  description: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: false }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
