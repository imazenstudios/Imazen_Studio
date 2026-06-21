const fs = require('fs');

let content = fs.readFileSync('backend/models/LandingPage.js', 'utf8');

// Insert new fields
const newFields = `
  // Global Hero Text
  heroSubheading: { type: String, default: 'Imazen Studios' },
  heroHeading: { type: String, default: 'Beautiful Baby\\nPhotography' },
  heroQuote: { type: String, default: '"Your Baby\\'s Smile, Captured Forever as Art."' },
  heroDescription: { type: String, default: 'Professional baby shoots with stunning themes and complete safety.' },
  heroPriceText: { type: String, default: 'Packages Start From Just' },
  heroPriceAmount: { type: String, default: '₹3,999/-' },
  heroButtonText: { type: String, default: 'Book Your Shoot Now' },

  // Floating Buttons
  floatingBubbleText: { type: String, default: 'Hurry, Limited Slots Available!' },
  floatingButtonText: { type: String, default: 'Book Now' },

  // Parallax CTA (Extended)
  parallaxFooter: {
    heading: { type: String, default: 'Affordable Premium Baby Shoot' },
    subheading: { type: String, default: 'Starts From Just ₹3,999/-' },
    description: { type: String, default: 'Access to custom themes, wraps, and professional team without breaking your budget.' },
    buttonText: { type: String, default: 'Claim Your Spot Now' },
    imageUrl: { type: String },
    align: { type: String, default: 'center' }
  },
`;

// Replace existing parallaxFooter to include the new expanded one, and insert other fields right after heroTextAlign
content = content.replace(
  /heroTextAlign: \{ type: String, default: 'center' \},/,
  `heroTextAlign: { type: String, default: 'center' },\n${newFields.split('// Parallax CTA (Extended)')[0]}`
);

content = content.replace(
  /parallaxFooter: \{[\s\S]*?align: \{ type: String, default: 'center' \}\n\s*\}/,
  newFields.split('// Parallax CTA (Extended)')[1].trim().slice(0, -1) // remove trailing comma for object
);

fs.writeFileSync('backend/models/LandingPage.js', content, 'utf8');
console.log('Updated LandingPage model');
