const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  sponsorPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

eventSchema.pre('save', async function () {
  if (this.isModified('sponsorPassword')) {
    this.sponsorPassword = await bcrypt.hash(this.sponsorPassword, 10);
  }
});

eventSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.sponsorPassword);
};

module.exports = mongoose.model('Event', eventSchema);
