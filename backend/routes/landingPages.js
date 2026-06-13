import express from 'express';
import LandingPage from '../models/LandingPage.js';

const router = express.Router();

// GET all landing pages
router.get('/', async (req, res) => {
  try {
    const pages = await LandingPage.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET specific landing page by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await LandingPage.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Landing page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new landing page
router.post('/', async (req, res) => {
  const page = new LandingPage(req.body);
  try {
    const newPage = await page.save();
    res.status(201).json(newPage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a landing page
router.put('/:id', async (req, res) => {
  try {
    const page = await LandingPage.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!page) return res.status(404).json({ message: 'Landing page not found' });
    res.json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a landing page
router.delete('/:id', async (req, res) => {
  try {
    await LandingPage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Landing page deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
