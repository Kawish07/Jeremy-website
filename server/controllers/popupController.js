const PopupLead = require('../models/PopupLead');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, consent, message, source } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'Missing required fields' });
    const created = await PopupLead.create({ name, email, phone: phone || '', consent: !!consent, message: message || '', source: source || 'homepage-popup' });
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
