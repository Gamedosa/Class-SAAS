const router = require('express').Router();
const Participant = require('../models/Participant');

router.post('/', async (req, res) => {
  try {
    const { name, ramal, codename, eventId } = req.body;
    const participant = await Participant.create({ name, ramal, codename, eventId });
    res.status(201).json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/event/:eventId', async (req, res) => {
  try {
    const participants = await Participant.find({ eventId: req.params.eventId }).select(
      'name codename ramal'
    );
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).json({ error: 'Participant not found' });
    res.json(participant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:participantId/secret-friend', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.participantId).populate(
      'secretFriendId',
      'name codename'
    );
    if (!participant) return res.status(404).json({ error: 'Participant not found' });
    if (!participant.secretFriendId) {
      return res.status(404).json({ error: 'Draw has not been performed yet' });
    }
    res.json({ secretFriend: participant.secretFriendId.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
