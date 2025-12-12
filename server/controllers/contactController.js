const Contact = require('../models/Contact');

exports.create = async (req, res) => {
  try {
    const body = req.body || {};
    console.log('POST /api/contact body:', body);
    const { name, email, phone, message, consent } = body;
    if (!name || !email) {
      console.warn('Contact.create validation failed:', { name, email });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const created = await Contact.create({
      name,
      email,
      phone: phone || '',
      message: message || '',
      consent: !!consent
    });
    console.log('Contact saved id=', created._id);
    res.status(201).json(created);
  } catch (e) {
    console.error('Create contact error', e && e.stack ? e.stack : e);
    res.status(500).json({ error: 'Failed to create contact', detail: e && e.message ? e.message : String(e) });
  }
};

exports.list = async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    console.error('List contact error', e);
    res.status(500).json({ error: 'Failed to list contacts' });
  }
};
