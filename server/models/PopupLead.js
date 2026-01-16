const mongoose = require('mongoose');

const PopupLeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  consent: { type: Boolean, default: false },
  message: { type: String, default: '' },
  source: { type: String, default: 'homepage-popup' },
}, { timestamps: true });

// Add indexes for faster queries
PopupLeadSchema.index({ email: 1 });
PopupLeadSchema.index({ createdAt: -1 });
PopupLeadSchema.index({ source: 1 });

module.exports = mongoose.model('PopupLead', PopupLeadSchema);
