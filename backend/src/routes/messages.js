const router = require('express').Router();
const Message = require('../models/Message');
const Participant = require('../models/Participant');

router.post('/', async (req, res) => {
  try {
    const { senderId, recipientId, eventId, content } = req.body;

    const [sender, recipient] = await Promise.all([
      Participant.findById(senderId),
      Participant.findById(recipientId),
    ]);

    if (!sender || !recipient) {
      return res.status(404).json({ error: 'Sender or recipient not found' });
    }
    if (sender.eventId.toString() !== eventId || recipient.eventId.toString() !== eventId) {
      return res.status(400).json({ error: 'Both participants must belong to the same event' });
    }

    const message = await Message.create({ senderId, recipientId, eventId, content });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/inbox/:participantId', async (req, res) => {
  try {
    const messages = await Message.find({ recipientId: req.params.participantId })
      .populate('senderId', 'codename')
      .sort({ createdAt: -1 });

    const result = messages.map((m) => ({
      _id: m._id,
      content: m.content,
      senderCodename: m.senderId ? m.senderId.codename : 'Unknown',
      createdAt: m.createdAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/outbox/:participantId', async (req, res) => {
  try {
    const messages = await Message.find({ senderId: req.params.participantId })
      .populate('recipientId', 'name')
      .sort({ createdAt: -1 });

    const result = messages.map((m) => ({
      _id: m._id,
      content: m.content,
      recipientName: m.recipientId ? m.recipientId.name : 'Unknown',
      createdAt: m.createdAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
