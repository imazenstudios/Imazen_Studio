import express from 'express';
import Settings from '../models/Settings.js';
import { getMailer } from '../mailer.js';

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// Update blocked weekdays
router.put('/blocked-weekdays', async (req, res) => {
  try {
    const { blockedWeekdays } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ blockedWeekdays });
    } else {
      settings.blockedWeekdays = blockedWeekdays;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating blocked weekdays' });
  }
});

// Update analytics IDs
router.put('/analytics', async (req, res) => {
  try {
    const { metaPixelId, googleAnalyticsId } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ metaPixelId, googleAnalyticsId });
    } else {
      if (metaPixelId !== undefined) settings.metaPixelId = metaPixelId;
      if (googleAnalyticsId !== undefined) settings.googleAnalyticsId = googleAnalyticsId;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating analytics settings' });
  }
});

// Update contact details
router.put('/contact', async (req, res) => {
  try {
    const { contactEmail, whatsappNumber, teamEmails, footerStudioAddress, footerSocials } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ contactEmail, whatsappNumber, teamEmails, footerStudioAddress, footerSocials });
    } else {
      if (contactEmail !== undefined) settings.contactEmail = contactEmail;
      if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
      if (teamEmails !== undefined) settings.teamEmails = teamEmails;
      if (footerStudioAddress !== undefined) settings.footerStudioAddress = footerStudioAddress;
      if (footerSocials !== undefined) settings.footerSocials = footerSocials;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating contact settings' });
  }
});
// Update maintenance mode
router.put('/maintenance', async (req, res) => {
  try {
    const { maintenanceMode, maintenanceEndTime } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ maintenanceMode, maintenanceEndTime });
    } else {
      if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
      if (maintenanceEndTime !== undefined) settings.maintenanceEndTime = maintenanceEndTime;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating maintenance mode' });
  }
});

// Update whatWeDo
router.put('/whatwedo', async (req, res) => {
  try {
    const { whatWeDo } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ whatWeDo });
    } else {
      if (whatWeDo !== undefined) settings.whatWeDo = whatWeDo;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating whatWeDo' });
  }
});

// Export Settings
router.get('/export', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error exporting settings' });
  }
});

// Test Email Setup
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ success: false, error: 'Email credentials (EMAIL_USER / EMAIL_PASS) are not configured on the server.' });
    }

    const transporter = getMailer();

    const info = await transporter.sendMail({
      from: `"Imazen Test" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Imazen Studios - Email Configuration Test",
      text: "If you are receiving this email, your Nodemailer configuration is working perfectly!"
    });

    res.json({ success: true, messageId: info.messageId, message: 'Test email sent successfully!' });
  } catch (error) {
    console.error("Test Email Error:", error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send test email', stack: error.stack });
  }
});

export default router;
