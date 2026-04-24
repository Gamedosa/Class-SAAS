const mongoose = require('mongoose');

const giftSuggestionSchema = new mongoose.Schema({
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  suggestions: [{ type: String }],
});

module.exports = mongoose.model('GiftSuggestion', giftSuggestionSchema);
