const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
