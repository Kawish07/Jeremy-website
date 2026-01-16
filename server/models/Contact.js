const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  message: { type: String, default: '' },
  consent: { type: Boolean, default: false }
}, { timestamps: true });

// Add indexes for faster queries
ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
