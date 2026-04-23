const router = require('express').Router();
const mongoose = require('mongoose');
const GiftSuggestion = require('../models/GiftSuggestion');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post('/', async (req, res) => {
  try {
    const { participantId, eventId, suggestions } = req.body;
    if (!isValidId(participantId) || !isValidId(eventId)) {
      return res.status(400).json({ error: 'Invalid id(s) provided' });
    }
    const pId = new mongoose.Types.ObjectId(participantId);
    const eId = new mongoose.Types.ObjectId(eventId);
    const doc = await GiftSuggestion.findOneAndUpdate(
      { participantId: pId, eventId: eId },
      { suggestions },
      { upsert: true, new: true }
    );
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/event/:eventId', async (req, res) => {
  try {
    if (!isValidId(req.params.eventId)) return res.status(400).json({ error: 'Invalid eventId' });
    const suggestions = await GiftSuggestion.find({ eventId: req.params.eventId }).populate(
      'participantId',
      'name codename'
    );
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/participant/:participantId', async (req, res) => {
  try {
    if (!isValidId(req.params.participantId)) {
      return res.status(400).json({ error: 'Invalid participant id' });
    }
    const suggestion = await GiftSuggestion.findOne({ participantId: req.params.participantId });
    if (!suggestion) return res.status(404).json({ error: 'No suggestions found' });
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
