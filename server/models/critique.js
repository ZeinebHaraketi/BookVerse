const mongoose = require('mongoose');

const critiqueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  adaptation: { type: mongoose.Schema.Types.ObjectId, ref: 'Adaptation' },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, required: true },
  livre: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre', required: true },
  date: { type: Date, default: Date.now }
});

const Critique = mongoose.model('Critique', critiqueSchema);

module.exports = Critique;
