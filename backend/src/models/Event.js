const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  sponsorPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
