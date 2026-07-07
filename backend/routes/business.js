import express from 'express';
import BusinessPartner from '../models/BusinessPartner.js';
import Expense from '../models/Expense.js';
import PropRental from '../models/PropRental.js';
import Event from '../models/Event.js';
import TeamMember from '../models/TeamMember.js';
import { sendEmail } from '../mailer.js';

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

// --- Events ---

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().populate('assignedTeamMember').sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    if (event.services) {
       event.totalAmount = event.services.reduce((sum, item) => sum + item.price, 0);
    }
    await event.save();
    
    // Notify team member if assigned
    if (event.assignedTeamMember) {
      const teamMember = await TeamMember.findById(event.assignedTeamMember);
      if (teamMember && teamMember.email) {
        await sendEmail({
          to: teamMember.email,
          subject: `You have been assigned to an Event: ${event.name}`,
          text: `Hi ${teamMember.name},\n\nYou have been assigned to the event "${event.name}" scheduled for ${event.date}.\n\nClient: ${event.clientName || 'N/A'}\nStatus: ${event.status}\n\nThanks,\nImazen OS`
        }).catch(err => console.error("Failed to send assignment email:", err));
      }
    }
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const oldEvent = await Event.findById(req.params.id);
    
    // Handle empty team member assignment
    if (req.body.assignedTeamMember === '') {
      req.body.assignedTeamMember = null;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (event.services) {
       event.totalAmount = event.services.reduce((sum, item) => sum + item.price, 0);
       await event.save();
    }
    
    // Notify team member if assigned (and wasn't already assigned to this person)
    if (event.assignedTeamMember && String(oldEvent?.assignedTeamMember) !== String(event.assignedTeamMember)) {
      const teamMember = await TeamMember.findById(event.assignedTeamMember);
      if (teamMember && teamMember.email) {
        await sendEmail({
          to: teamMember.email,
          subject: `You have been assigned to an Event: ${event.name}`,
          text: `Hi ${teamMember.name},\n\nYou have been assigned to the event "${event.name}" scheduled for ${event.date}.\n\nClient: ${event.clientName || 'N/A'}\nStatus: ${event.status}\n\nThanks,\nImazen OS`
        }).catch(err => console.error("Failed to send assignment email:", err));
      }
    }
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
