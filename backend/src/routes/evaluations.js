const router = require('express').Router();
const mongoose = require('mongoose');
const Evaluation = require('../models/Evaluation');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post('/', async (req, res) => {
  try {
    const { participantId, eventId, rating, comment } = req.body;
    if (!isValidId(participantId) || !isValidId(eventId)) {
      return res.status(400).json({ error: 'Invalid id(s) provided' });
    }
    const evaluation = await Evaluation.create({ participantId, eventId, rating, comment });
    res.status(201).json(evaluation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    if (!isValidId(req.params.eventId)) return res.status(400).json({ error: 'Invalid eventId' });
    const evaluations = await Evaluation.find({ eventId: req.params.eventId })
      .populate('participantId', 'name codename')
      .sort({ createdAt: -1 });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
