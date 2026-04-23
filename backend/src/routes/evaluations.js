const router = require('express').Router();
const Evaluation = require('../models/Evaluation');

router.post('/', async (req, res) => {
  try {
    const { participantId, eventId, rating, comment } = req.body;
    const evaluation = await Evaluation.create({ participantId, eventId, rating, comment });
    res.status(201).json(evaluation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ eventId: req.params.eventId })
      .populate('participantId', 'name codename')
      .sort({ createdAt: -1 });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
