const fs = require('fs');

let content = fs.readFileSync('backend/models/LandingPage.js', 'utf8');

const newFields = `
  // New Dynamic Content Fields
  logoUrl: { type: String },
  
  approachHeading: { type: String, default: 'Our Approach' },
  approachDescription: { type: String, default: 'Capturing the purest moments with utmost care and creativity.' },
  
  serviceCardsHeading: { type: String, default: 'What We Do Best' },
  serviceCards: [{
    category: { type: String },
    title: { type: String },
    description: { type: String },
    images: [{ type: String }]
  }],

  whyChooseHeading: { type: String, default: 'Why Parents Love Our Studio' },
  whyChooseItems: [{
    title: { type: String },
    desc: { type: String }
  }],

  comfortHeading: { type: String, default: 'Pure Comfort for Mother & Baby' },
  comfortItems: [{
    title: { type: String },
    desc: { type: String }
  }],
`;

// Insert newFields after the heroButtonText line
if (!content.includes('logoUrl: { type: String }')) {
  content = content.replace(
    /heroButtonText: \{ type: String, default: 'Book Your Shoot Now' \},/g,
    `heroButtonText: { type: String, default: 'Book Your Shoot Now' },\n${newFields}`
  );
  fs.writeFileSync('backend/models/LandingPage.js', content, 'utf8');
  console.log("Updated LandingPage.js schema successfully.");
} else {
  console.log("Schema already has the new fields.");
}
