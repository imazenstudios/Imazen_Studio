import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config({ path: './.env' });

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/twilight');
  console.log('Connected to DB');
  
  // Wipe portfolioImages from main services
  const services = await Service.find({});
  for (let s of services) {
    if (s.portfolioImages && s.portfolioImages.length > 0) {
      console.log('Clearing ' + s.portfolioImages.length + ' images from ' + s.name + ' main portfolio.');
      s.portfolioImages = [];
      await s.save();
    }
  }
  console.log('Done');
  process.exit(0);
}

fix();
