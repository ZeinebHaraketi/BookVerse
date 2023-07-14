const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  membre: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creationDate: { type: Date, default: Date.now },
  contenu: { type: String, required: true },
  reponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  livreAssocie: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre' },
  clubAssocie: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubDeLecture' },
  tags: [String]
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
