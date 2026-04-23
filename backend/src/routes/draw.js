const router = require('express').Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const DrawHistory = require('../models/DrawHistory');

const MAX_DRAW_ATTEMPTS = 200;
const FORBIDDEN_PAIRS_HISTORY_LIMIT = 4;

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildValidAssignment(ids, forbiddenPairs) {
  const n = ids.length;
  // Try up to 200 times to find a valid derangement
  for (let attempt = 0; attempt < MAX_DRAW_ATTEMPTS; attempt++) {
    const receivers = shuffle([...ids]);
    let valid = true;
    for (let i = 0; i < n; i++) {
      const giverId = ids[i].toString();
      const receiverId = receivers[i].toString();
      if (giverId === receiverId) { valid = false; break; }
      const key = `${giverId}-${receiverId}`;
      if (forbiddenPairs.has(key)) { valid = false; break; }
    }
    if (valid) return receivers;
  }
  return null;
}

router.post('/:eventId', async (req, res) => {
  try {
    if (!isValidId(req.params.eventId)) return res.status(400).json({ error: 'Invalid eventId' });
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    const passwordMatch = await event.checkPassword(req.body.sponsorPassword || '');
    if (!passwordMatch) {
      return res.status(403).json({ error: 'Invalid sponsor password' });
    }

    const existing = await DrawHistory.findOne({ eventId: event._id });
    if (existing) return res.status(400).json({ error: 'Draw already performed for this event' });

    const participants = await Participant.find({ eventId: event._id });
    if (participants.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 participants to perform the draw' });
    }

    // Collect forbidden pairs from the last 4 events
    const recentHistory = await DrawHistory.find().sort({ createdAt: -1 }).limit(FORBIDDEN_PAIRS_HISTORY_LIMIT);
    const forbiddenPairs = new Set();
    for (const history of recentHistory) {
      for (const pair of history.pairs) {
        forbiddenPairs.add(`${pair.giverId}-${pair.receiverId}`);
      }
    }

    const ids = participants.map((p) => p._id);

    // Try with forbidden pairs first, then without if impossible
    let receivers = buildValidAssignment(ids, forbiddenPairs);
    if (!receivers) {
      receivers = buildValidAssignment(ids, new Set());
    }
    if (!receivers) {
      return res.status(500).json({ error: 'Could not perform draw, try again' });
    }

    const pairs = [];
    for (let i = 0; i < ids.length; i++) {
      await Participant.findByIdAndUpdate(ids[i], { secretFriendId: receivers[i] });
      pairs.push({ giverId: ids[i], receiverId: receivers[i] });
    }

    await DrawHistory.create({ eventId: event._id, pairs, year: event.year || new Date().getFullYear() });

    res.json({ message: 'Draw performed successfully', totalPairs: pairs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
