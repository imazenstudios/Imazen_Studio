import mongoose from 'mongoose';
import Service from './models/Service.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const service = await Service.findOne();
  if (!service) return console.log('No service found');
  
  console.log('Before update:', service.subServices[0].heroImage);
  
  service.subServices[0].heroImage = 'https://test-hero.com/img.jpg';
  await service.save();
  
  const updated = await Service.findOne();
  console.log('After update:', updated.subServices[0].heroImage);
  
  mongoose.disconnect();
}
test();
