import { generateEventPdf } from './pdfGenerator.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const pdfData = await generateEventPdf({ name: 'Test Event' }, 0);
    console.log('PDF generated successfully, size:', pdfData.length);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await mongoose.disconnect();
  }
}
test();
