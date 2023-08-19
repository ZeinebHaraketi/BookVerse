const mongoose = require('mongoose');

const clubDeLectureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  membres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
  livres_lus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }],
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

const ClubDeLecture = mongoose.model('ClubDeLecture', clubDeLectureSchema);

module.exports = ClubDeLecture;
