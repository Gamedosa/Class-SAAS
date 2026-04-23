const router = require('express').Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().select('-sponsorPassword');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid event id' });
    const event = await Event.findById(req.params.id).select('-sponsorPassword');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/close', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid event id' });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const passwordMatch = await event.checkPassword(req.body.sponsorPassword || '');
    if (!passwordMatch) {
      return res.status(403).json({ error: 'Invalid sponsor password' });
    }
    event.status = 'closed';
    await event.save();
    res.json({ message: 'Event closed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
