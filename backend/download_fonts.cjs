const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir);
}

const fonts = {
  'PlayfairDisplay-Bold.ttf': 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Bold.ttf',
  'PlayfairDisplay-Regular.ttf': 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Regular.ttf',
  'Oswald-Bold.ttf': 'https://github.com/google/fonts/raw/main/ofl/oswald/Oswald-Bold.ttf',
  'Oswald-Regular.ttf': 'https://github.com/google/fonts/raw/main/ofl/oswald/Oswald-Regular.ttf',
  'Raleway-Regular.ttf': 'https://github.com/google/fonts/raw/main/ofl/raleway/Raleway-Regular.ttf',
  'Raleway-Bold.ttf': 'https://github.com/google/fonts/raw/main/ofl/raleway/Raleway-Bold.ttf'
};

const download = (filename, url) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(fontsDir, filename);
    const file = fs.createWriteStream(filePath);
    https.get(url, response => {
      if (response.statusCode === 302) {
        https.get(response.headers.location, res => {
          res.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    }).on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });
  });
};

async function downloadAll() {
  for (const [filename, url] of Object.entries(fonts)) {
    console.log(`Downloading ${filename}...`);
    try {
      await download(filename, url);
      console.log(`Finished ${filename}`);
    } catch (e) {
      console.error(`Error downloading ${filename}`, e);
    }
  }
}

downloadAll();
