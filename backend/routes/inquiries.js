import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filenamePath = fileURLToPath(import.meta.url);
const __dirnamePath = path.dirname(__filenamePath);
const logoPath = path.join(__dirnamePath, '../../frontend/public/images/logo.png');

import Inquiry from '../models/Inquiry.js';
import { getMailer } from '../mailer.js';

const router = express.Router();

// Configure Nodemailer transporter lazily to ensure env vars are loaded
let transporter;
const getTransporter = () => {
  if (!transporter) {
    transporter = getMailer();
  }
  return transporter;
};

// Create a new inquiry (from contact page)
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();

    // Send thank you email
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await getTransporter().sendMail({
          from: `"Imazen Studios" <${process.env.EMAIL_USER}>`,
          to: inquiry.email,
          subject: "Thank you for contacting Imazen Studios!",
          html: `
            <div style="background-color: #000000; font-family: Arial, sans-serif; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://imazenstudios.com/images/logo.png" alt="Imazen Studios" style="max-width: 150px; height: auto;" />
              </div>
              <h2 style="color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">Thank you, ${inquiry.name}!</h2>
              <p>We have successfully received your inquiry regarding <strong>"${inquiry.subject}"</strong>.</p>
              <p>Our team at Imazen Studios is currently reviewing your message and will get back to you shortly.</p>
              <br/>
              <p><strong>Your Message:</strong></p>
              <blockquote style="background: #1a1a1a; padding: 15px; border-left: 4px solid #ffffff; font-style: italic; color: #ffffff;">
                ${inquiry.message}
              </blockquote>
              <br/>
              <hr style="border: none; border-top: 1px solid #333333; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">
                Imazen Studios<br/>
                This is an automated message.
              </p>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.status(201).json({ message: 'Inquiry received successfully', inquiry });
  } catch (error) {
    res.status(500).json({ error: 'Server error saving inquiry' });
  }
});

// Admin: Get all inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching inquiries' });
  }
});

// Admin: Update inquiry status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating inquiry' });
  }
});

// Admin: Add a follow-up note
router.post('/:id/followup', async (req, res) => {
  try {
    const { note } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    
    inquiry.followUps.push({ note, date: new Date() });
    await inquiry.save();
    
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Server error adding follow-up' });
  }
});

// Admin: Delete inquiry
router.delete('/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting inquiry' });
  }
});

export default router;
