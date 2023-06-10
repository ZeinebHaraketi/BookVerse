const mongoose = require('mongoose');

const critiqueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adaptation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adaptation',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Critique = mongoose.model('Critique', critiqueSchema);

module.exports = Critique;
