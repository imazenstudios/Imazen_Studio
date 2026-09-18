import { generateEventPdf } from './pdfGenerator.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';
dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const event = await Event.findOne();
    if (!event) {
      console.log('No event found');
      return;
    }
    const pdfData = await generateEventPdf(event, 0);
    console.log('PDF generated successfully, size:', pdfData.length);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await mongoose.disconnect();
  }
}
test();
