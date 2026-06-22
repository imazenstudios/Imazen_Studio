import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filenamePath = fileURLToPath(import.meta.url);
const __dirnamePath = path.dirname(__filenamePath);
const logoPath = path.join(__dirnamePath, '../../frontend/public/images/logo.png');

import Lead from '../models/Lead.js';
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

// Create a new lead (from Landing Page)
router.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();

    // Send emails asynchronously in the background so it doesn't block the response
    const sendEmailsAsync = async () => {
      try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const mailer = getTransporter();
          
          // 1. Email to Client
          await mailer.sendMail({
            from: `"Imazen Studios" <${process.env.EMAIL_USER}>`,
            to: lead.email,
            subject: "Thank you for your interest in Imazen Studios!",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://imazenstudios.com/images/logo2.png" alt="Imazen Studios" style="max-width: 150px; height: auto;" />
                </div>
                <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Thank you, ${lead.name}!</h2>
                <p>We have successfully received your inquiry ${lead.interestedIn ? `for <strong>${lead.interestedIn}</strong>` : ''}${lead.eventDate ? ` for the date: <strong>${new Date(lead.eventDate).toLocaleDateString()}</strong>` : ''}.</p>
                <p>Our team at Imazen Studios is reviewing your details and will get back to you shortly to discuss your vision.</p>
                <br/>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999;">
                  Imazen Studios<br/>
                  This is an automated message.
                </p>
              </div>
            `
          });

          // 2. Email to Admin Team
          await mailer.sendMail({
            from: `"Imazen Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sending to the admin email
            subject: `New Lead: ${lead.name} via ${lead.landingPageSource}`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fcfcfc;">
                <h2 style="color: #d4af37; text-transform: uppercase;">New Landing Page Lead</h2>
                <p><strong>Name:</strong> ${lead.name}</p>
                <p><strong>Email:</strong> ${lead.email}</p>
                <p><strong>Phone:</strong> ${lead.phone}</p>
                ${lead.interestedIn ? `<p><strong>Interested In:</strong> ${lead.interestedIn}</p>` : ''}
                ${lead.eventDate ? `<p><strong>Event Date:</strong> ${new Date(lead.eventDate).toLocaleDateString()}</p>` : ''}
                <p><strong>Source:</strong> ${lead.landingPageSource}</p>
                <br/>
                <p>Please log in to the admin dashboard to manage this lead.</p>
              </div>
            `
          });
        }
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
      }
    };
    sendEmailsAsync(); // Do not await

    res.status(201).json({ message: 'Lead received successfully', lead });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Server error saving lead' });
  }
});

// Admin: Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching leads' });
  }
});

// Admin: Update lead status
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating lead' });
  }
});

// Admin: Delete lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting lead' });
  }
});

export default router;
