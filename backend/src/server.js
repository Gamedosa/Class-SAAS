require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/events', require('./routes/events'));
app.use('/api/participants', require('./routes/participants'));
app.use('/api/draw', require('./routes/draw'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/evaluations', require('./routes/evaluations'));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/class-saas';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
