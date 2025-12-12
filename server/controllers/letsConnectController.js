const LetsConnect = require('../models/LetsConnect');

exports.create = async (req, res) => {
  try {
    const { name, email, phone, bestTime, timezone } = req.body || {};
    if (!name || !email || !bestTime) return res.status(400).json({ error: 'Missing required fields' });
    const bt = bestTime ? new Date(bestTime) : null;
    const created = await LetsConnect.create({ name, email, phone: phone || '', bestTime: bt, timezone: timezone || 'ET' });
    res.status(201).json(created);
  } catch (e) {
    console.error('Create letsconnect error', e);
    res.status(500).json({ error: 'Failed to create letsconnect' });
  }
};

exports.list = async (req, res) => {
  try {
    const list = await LetsConnect.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    console.error('List letsconnect error', e);
    res.status(500).json({ error: 'Failed to list letsconnect' });
  }
};
