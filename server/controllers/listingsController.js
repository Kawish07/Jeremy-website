const Listing = require('../models/Listing');

function normalizeNumericFields(data) {
  if (data.price) data.price = Number(data.price);
  if (data.beds) data.beds = Number(data.beds);
  if (data.baths) data.baths = Number(data.baths);
  if (data.livingArea) data.livingArea = Number(data.livingArea);
}

exports.list = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (e) {
    console.error('List listings error', e);
    res.status(500).json({ error: 'Failed to list listings' });
  }
};

exports.get = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Not found' });
    res.json(listing);
  } catch (e) {
    res.status(400).json({ error: 'Invalid id' });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body || {};
    if (req.files) {
      const imgs = [];
      if (req.files.imageFiles && req.files.imageFiles.length) imgs.push(...req.files.imageFiles);
      if (req.files['imageFiles[]'] && req.files['imageFiles[]'].length) imgs.push(...req.files['imageFiles[]']);
      if (imgs.length) {
        data.images = imgs.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
      }
      if (req.files.agentPhotoFile && req.files.agentPhotoFile[0]) {
        data.agentPhoto = `${req.protocol}://${req.get('host')}/uploads/${req.files.agentPhotoFile[0].filename}`;
      }
    }
    normalizeNumericFields(data);
    const created = await Listing.create(data);
    res.status(201).json(created);
  } catch (e) {
    console.error('Create listing error', e);
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body || {};
    if (req.files) {
      const imgs = [];
      if (req.files.imageFiles && req.files.imageFiles.length) imgs.push(...req.files.imageFiles);
      if (req.files['imageFiles[]'] && req.files['imageFiles[]'].length) imgs.push(...req.files['imageFiles[]']);
      if (imgs.length) {
        data.images = imgs.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
      }
      if (req.files.agentPhotoFile && req.files.agentPhotoFile[0]) {
        data.agentPhoto = `${req.protocol}://${req.get('host')}/uploads/${req.files.agentPhotoFile[0].filename}`;
      }
    }
    normalizeNumericFields(data);
    const updated = await Listing.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (e) {
    console.error('Update listing error', e);
    res.status(400).json({ error: 'Invalid id' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Invalid id' });
  }
};
