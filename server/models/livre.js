const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  auteur: { type: String, required: true
  },
  genre: { type: String, required: true },
  categorie: { type: String,enum: ['fanfiction', 'Manga', 'BD','Roman'], required: true },
  chapitres: [{ type: mongoose.Schema.Types.ObjectId,ref: 'Chapitre' }],
  anneePublication: { type: Number },
  resume: { type: String },
  image: { type: String },
  adaptations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Adaptation' }],
  critiques: { type: [mongoose.Schema.Types.ObjectId],
    ref: 'Critique',
    default: [] },
  note: { type: Number,min: 0,max: 5},
  nbVus: { type: Number,min: 0},
  avis: { type: String }
});

const Livre = mongoose.model('Livre', livreSchema);

module.exports = Livre;
