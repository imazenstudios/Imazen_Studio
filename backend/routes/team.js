import express from 'express';
import TeamMember from '../models/TeamMember.js';

const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching team members' });
  }
});

// Admin: Create team member
router.post('/', async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating team member' });
  }
});

// Admin: Update team member
router.put('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating team member' });
  }
});

// Admin: Delete team member
router.delete('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting team member' });
  }
});

export default router;
