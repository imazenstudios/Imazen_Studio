import express from 'express';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { parse } from 'json2csv';
import ClientGallery from '../models/ClientGallery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Initialize Google Drive API
const KEYFILEPATH = path.join(__dirname, '../google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
let driveAuth = null;
let drive = null;

if (fs.existsSync(KEYFILEPATH)) {
  driveAuth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  drive = google.drive({ version: 'v3', auth: driveAuth });
} else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    driveAuth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
    drive = google.drive({ version: 'v3', auth: driveAuth });
  } catch (e) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', e);
  }
} else {
  console.warn('google-credentials.json or GOOGLE_SERVICE_ACCOUNT_JSON env var not found! Google Drive API will not work.');
}

function extractFolderId(link) {
  try {
    const url = new URL(link);
    const pathParts = url.pathname.split('/');
    if (pathParts.includes('folders')) {
      return pathParts[pathParts.indexOf('folders') + 1];
    }
    const idParam = url.searchParams.get('id');
    if (idParam) return idParam;
    return null;
  } catch (err) {
    return null;
  }
}

// Admin: Create Gallery
router.post('/', async (req, res) => {
  try {
    const { clientEmail, clientName, eventName, folderLink } = req.body;
    
    if (!drive) {
      return res.status(500).json({ error: 'Google Drive API is not configured on the server.' });
    }

    const folderId = extractFolderId(folderLink);
    if (!folderId) {
      return res.status(400).json({ error: 'Invalid Google Drive folder link.' });
    }

    // Fetch images from Drive
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name)',
      pageSize: 1000
    });

    const driveFiles = response.data.files;
    if (!driveFiles || driveFiles.length === 0) {
      return res.status(400).json({ error: 'No images found in the provided folder, or the Service Account does not have viewer access.' });
    }

    const images = driveFiles.map(file => ({
      name: file.name,
      driveId: file.id,
      isSelected: false
    }));

    const gallery = new ClientGallery({
      clientEmail: clientEmail.toLowerCase().trim(),
      clientName,
      eventName,
      folderLink,
      images
    });

    await gallery.save();
    res.status(201).json({ message: 'Gallery created successfully!', gallery });
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ error: 'Failed to create gallery. Ensure the service account has access to the folder.' });
  }
});

// Admin: Get all galleries
router.get('/', async (req, res) => {
  try {
    const galleries = await ClientGallery.find().sort({ createdAt: -1 });
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

// Admin: Export CSV
router.get('/:id/export', async (req, res) => {
  try {
    const gallery = await ClientGallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    const selectedImages = gallery.images.filter(img => img.isSelected);
    
    if (selectedImages.length === 0) {
      return res.status(400).json({ error: 'No images selected in this gallery' });
    }

    const csvData = selectedImages.map(img => ({ 'Image Name': img.name }));
    const csv = parse(csvData);

    const safeName = (gallery.clientName || 'client').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const safeEvent = (gallery.eventName || 'event').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeName}_${safeEvent}_selections.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    console.error('CSV Export Error:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

// Admin: Sync images from Google Drive for an existing gallery
router.put('/:id/sync', async (req, res) => {
  try {
    if (!drive) {
      return res.status(500).json({ error: 'Google Drive API is not configured on the server.' });
    }

    const gallery = await ClientGallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

    // Optional folderLink override if admin provided a new one
    const folderLink = req.body.folderLink || gallery.folderLink;
    const folderId = extractFolderId(folderLink);
    if (!folderId) {
      return res.status(400).json({ error: 'Invalid Google Drive folder link.' });
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name)',
      pageSize: 1000,
    });

    const driveFiles = response.data.files || [];
    if (driveFiles.length === 0) {
      return res.status(400).json({ error: 'No images found in the folder or Service Account lacks access.' });
    }

    // Preserve existing isSelected states
    const existingMap = new Map();
    gallery.images.forEach(img => {
      existingMap.set(img.driveId, img.isSelected);
    });

    const updatedImages = driveFiles.map(file => ({
      name: file.name,
      driveId: file.id,
      isSelected: existingMap.has(file.id) ? existingMap.get(file.id) : false,
    }));

    gallery.folderLink = folderLink;
    gallery.images = updatedImages;
    await gallery.save();

    res.json({ message: `Successfully synced ${updatedImages.length} images!`, gallery });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync images from Google Drive folder.' });
  }
});

// Admin: Delete gallery
router.delete('/:id', async (req, res) => {
  try {
    await ClientGallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery' });
  }
});

// Client: Verify email and get assigned galleries
router.post('/verify', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const galleries = await ClientGallery.find({ clientEmail: email.toLowerCase().trim() }).sort({ createdAt: -1 });
    if (galleries.length === 0) {
      return res.status(404).json({ error: 'No galleries found for this email address.' });
    }

    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// Client: Submit selection
router.put('/:id/submit', async (req, res) => {
  try {
    const { selectedDriveIds } = req.body; // Array of driveIds that are selected
    const gallery = await ClientGallery.findById(req.params.id);
    
    if (!gallery) return res.status(404).json({ error: 'Gallery not found' });
    if (gallery.status === 'Submitted') return res.status(400).json({ error: 'Selection has already been submitted.' });

    gallery.images.forEach(img => {
      img.isSelected = selectedDriveIds.includes(img.driveId);
    });

    gallery.status = 'Submitted';
    gallery.submittedAt = new Date();
    await gallery.save();

    res.json({ message: 'Selection submitted successfully!', gallery });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit selection' });
  }
});

export default router;
