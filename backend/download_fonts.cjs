const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir);
}

const fonts = {
  'PlayfairDisplay-Bold.ttf': 'https://fonts.googleapis.com/css?family=Playfair+Display:700',
  'PlayfairDisplay-Regular.ttf': 'https://fonts.googleapis.com/css?family=Playfair+Display:400',
  'Oswald-Bold.ttf': 'https://fonts.googleapis.com/css?family=Oswald:700',
  'Oswald-Regular.ttf': 'https://fonts.googleapis.com/css?family=Oswald:400',
  'Raleway-Regular.ttf': 'https://fonts.googleapis.com/css?family=Raleway:400',
  'Raleway-Bold.ttf': 'https://fonts.googleapis.com/css?family=Raleway:700'
};

const getTtfUrl = (cssUrl) => {
  return new Promise((resolve, reject) => {
    https.get(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko' // IE11 requests TTF/WOFF
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find url(...) in the CSS
        const match = data.match(/url\((https:\/\/[^)]+\.ttf)\)/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          // fallback try to find any url
          const fallbackMatch = data.match(/url\((https:\/\/[^)]+)\)/);
          if (fallbackMatch) {
             resolve(fallbackMatch[1]);
          } else {
             reject(new Error('No TTF URL found in CSS'));
          }
        }
      });
    }).on('error', reject);
  });
};

const download = (filename, url) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(fontsDir, filename);
    const file = fs.createWriteStream(filePath);
    https.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to download ${url}, status: ${response.statusCode}`));
      }
    }).on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });
  });
};

async function downloadAll() {
  for (const [filename, cssUrl] of Object.entries(fonts)) {
    console.log(`Getting TTF URL for ${filename}...`);
    try {
      const ttfUrl = await getTtfUrl(cssUrl);
      console.log(`Found TTF URL: ${ttfUrl}`);
      console.log(`Downloading ${filename}...`);
      await download(filename, ttfUrl);
      console.log(`Finished ${filename}`);
    } catch (e) {
      console.error(`Error with ${filename}`, e);
    }
  }
}

downloadAll();
