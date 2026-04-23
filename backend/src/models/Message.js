const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
