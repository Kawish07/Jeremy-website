const PopupLead = require('../models/PopupLead');
const { sendNotificationEmail } = require('../lib/mailer');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, consent, message, source } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'Missing required fields' });
    const created = await PopupLead.create({ name, email, phone: phone || '', consent: !!consent, message: message || '', source: source || 'homepage-popup' });
    
    // Send notification email via SendGrid
    try {
      await sendNotificationEmail({
        subject: 'New Popup Lead Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nMessage: ${message || ''}\nSource: ${source || 'homepage-popup'}`,
        html: `<h2>New Popup Lead Submission</h2><p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Phone:</b> ${phone || ''}<br/><b>Message:</b> ${message || ''}<br/><b>Source:</b> ${source || 'homepage-popup'}</p>`
      });
    } catch (mailErr) {
      console.error('Failed to send popup email:', mailErr);
    }

    res.status(201).json(created);
  } catch (e) {
    console.error('Create popup lead error', e);
    res.status(500).json({ error: 'Failed to create popup lead' });
  }
};

exports.list = async (req, res) => {
  try {
    const list = await PopupLead.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    console.error('List popup leads error', e);
    res.status(500).json({ error: 'Failed to list popup leads' });
  }
};
