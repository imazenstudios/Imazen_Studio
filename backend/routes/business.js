import express from 'express';
import BusinessPartner from '../models/BusinessPartner.js';
import Expense from '../models/Expense.js';
import PropRental from '../models/PropRental.js';

const router = express.Router();

// --- Business Partners ---

router.get('/partners', async (req, res) => {
  try {
    const partners = await BusinessPartner.find();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/partners', async (req, res) => {
  try {
    const partner = new BusinessPartner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/partners/:id', async (req, res) => {
  try {
    const partner = await BusinessPartner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(partner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/partners/:id', async (req, res) => {
  try {
    await BusinessPartner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Expenses ---

router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Props ---

router.get('/props', async (req, res) => {
  try {
    const props = await PropRental.find().sort({ createdAt: -1 });
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/props', async (req, res) => {
  try {
    const prop = new PropRental(req.body);
    if (prop.items) {
       prop.totalAmount = prop.items.reduce((sum, item) => sum + item.price, 0);
    }
    await prop.save();
    res.status(201).json(prop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/props/:id', async (req, res) => {
  try {
    const prop = await PropRental.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Re-trigger pre-save calculations by saving explicitly if needed, or just calculate on frontend
    if (prop.items) {
       prop.totalAmount = prop.items.reduce((sum, item) => sum + item.price, 0);
       await prop.save();
    }
    res.json(prop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/props/:id', async (req, res) => {
  try {
    await PropRental.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prop deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
