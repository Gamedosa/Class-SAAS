const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ramal: { type: String, required: true },
  codename: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  secretFriendId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Participant', participantSchema);
