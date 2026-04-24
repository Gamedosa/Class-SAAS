const mongoose = require('mongoose');

const drawHistorySchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  pairs: [
    {
      giverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
    },
  ],
  year: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DrawHistory', drawHistorySchema);
