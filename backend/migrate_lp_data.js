import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import LandingPage from './models/LandingPage.js';

const defaultServiceCards = [
  {
    category: '5-15 Days',
    title: 'Newborn Shoots',
    description: 'Safe, sleepy, and beautiful poses.',
    images: ['/images/experience_bg.jpeg', '/images/about_bg.jpeg']
  },
  {
    category: '1-12 Months',
    title: 'Milestone Shoots',
    description: 'Capturing sitting up, crawling, and first teeth.',
    images: ['/images/mobile.jpeg', '/images/studio.jpeg']
  },
  {
    category: '1 Year+',
    title: 'Toddler Shoots',
    description: 'Fun-filled first birthday and cake smash celebrations.',
    images: ['/images/banner_bg.webp', '/images/experience_bg.jpeg']
  }
];

const defaultComfortItems = [
  { title: '100% AC Studio', desc: 'Perfectly temperature-controlled and dust-free.' },
  { title: 'Private Nursing Room', desc: 'A dedicated, quiet space for baby feeding and makeup.' },
  { title: 'Super Patient Team', desc: "We work completely around your baby's nap and feeding time." }
];

const defaultFeatures = [
  { title: '40+ Premium Themes', description: 'Amazing, hand-crafted setups for every mood.' },
  { title: 'Certified Newborn Wraps', description: 'Done by professionals ensuring 100% baby comfort.' },
  { title: 'Cinematic Video & Editing', description: 'Premium-grade videos and high-end photo retouching.' }
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const pages = await LandingPage.find();
  for (let page of pages) {
    if (!page.serviceCards || page.serviceCards.length === 0) {
      page.serviceCards = defaultServiceCards;
    }
    if (!page.comfortItems || page.comfortItems.length === 0) {
      page.comfortItems = defaultComfortItems;
    }
    if (!page.features || page.features.length === 0) {
      page.features = defaultFeatures;
    }
    
    // Also init parallax footer if missing
    if (!page.parallaxFooter) page.parallaxFooter = {};
    if (!page.parallaxFooter.heading) page.parallaxFooter.heading = 'Affordable Premium Baby Shoot';
    if (!page.parallaxFooter.subheading) page.parallaxFooter.subheading = 'Starts From Just ₹3,999/-';
    if (!page.parallaxFooter.description) page.parallaxFooter.description = 'Access to custom themes, wraps, and professional team without breaking your budget.';
    if (!page.parallaxFooter.buttonText) page.parallaxFooter.buttonText = 'Claim Your Spot Now';
    
    await page.save();
    console.log('Migrated data for:', page.name);
  }
  
  mongoose.disconnect();
  console.log('Migration complete.');
}

run().catch(console.error);
