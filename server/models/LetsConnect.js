const mongoose = require('mongoose');

const LetsConnectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  bestTime: { type: Date },
  timezone: { type: String, default: 'ET' },
  interest: { type: String, default: '' }
}, { timestamps: true });

// Add indexes for faster queries
LetsConnectSchema.index({ email: 1 });
LetsConnectSchema.index({ createdAt: -1 });
LetsConnectSchema.index({ bestTime: 1 });

module.exports = mongoose.models.LetsConnect || mongoose.model('LetsConnect', LetsConnectSchema);
