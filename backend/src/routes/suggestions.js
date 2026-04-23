const router = require('express').Router();
const GiftSuggestion = require('../models/GiftSuggestion');

router.post('/', async (req, res) => {
  try {
    const { participantId, eventId, suggestions } = req.body;
    const doc = await GiftSuggestion.findOneAndUpdate(
      { participantId, eventId },
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
    const suggestion = await GiftSuggestion.findOne({ participantId: req.params.participantId });
    if (!suggestion) return res.status(404).json({ error: 'No suggestions found' });
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
