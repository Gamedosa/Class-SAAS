const router = require('express').Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Message = require('../models/Message');
const DrawHistory = require('../models/DrawHistory');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get('/:eventId', async (req, res) => {
  try {
    if (!isValidId(req.params.eventId)) return res.status(400).json({ error: 'Invalid eventId' });
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.status !== 'closed') {
      return res.status(403).json({ error: 'Statistics only available when event is closed' });
    }

    const [messages, participants, drawHistory] = await Promise.all([
      Message.find({ eventId: event._id }).populate('senderId', 'name').populate('recipientId', 'name'),
      Participant.find({ eventId: event._id }),
      DrawHistory.findOne({ eventId: event._id })
        .populate('pairs.giverId', 'name')
        .populate('pairs.receiverId', 'name'),
    ]);

    const totalMessages = messages.length;

    // Count messages per recipient
    const receiverCount = {};
    const senderCount = {};
    for (const msg of messages) {
      const rName = msg.recipientId ? msg.recipientId.name : 'Unknown';
      const sName = msg.senderId ? msg.senderId.name : 'Unknown';
      receiverCount[rName] = (receiverCount[rName] || 0) + 1;
      senderCount[sName] = (senderCount[sName] || 0) + 1;
    }

    const topReceivers = Object.entries(receiverCount)
      .map(([name, messageCount]) => ({ name, messageCount }))
      .sort((a, b) => b.messageCount - a.messageCount);

    const topSenders = Object.entries(senderCount)
      .map(([name, messageCount]) => ({ name, messageCount }))
      .sort((a, b) => b.messageCount - a.messageCount);

    const codenameList = participants.map((p) => ({ codename: p.codename, name: p.name }));

    const drawList = drawHistory
      ? drawHistory.pairs.map((pair) => ({
          giverName: pair.giverId ? pair.giverId.name : 'Unknown',
          receiverName: pair.receiverId ? pair.receiverId.name : 'Unknown',
        }))
      : [];

    res.json({ totalMessages, topReceivers, topSenders, codenameList, drawList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
