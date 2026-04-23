const router = require('express').Router();
const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const Event = require('../models/Event');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post('/', async (req, res) => {
  try {
    const { eventId, content, sponsorPassword } = req.body;
    if (!isValidId(eventId)) return res.status(400).json({ error: 'Invalid eventId' });
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const passwordMatch = await event.checkPassword(sponsorPassword || '');
    if (!passwordMatch) {
      return res.status(403).json({ error: 'Invalid sponsor password' });
    }
    const notice = await Notice.create({ eventId, content });
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    if (!isValidId(req.params.eventId)) return res.status(400).json({ error: 'Invalid eventId' });
    const notices = await Notice.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
