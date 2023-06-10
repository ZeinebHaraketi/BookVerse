const mongoose = require('mongoose');

const adaptationSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['film', 'jeu vidéo', 'série', 'autre'], // Ajoutez ici les valeurs possibles
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  annee: {
    type: Number,
    required: true
  },
  directeur: {
    type: String,
    required: true
  },
  platforme: {
    type: String
  },
  livreAssocie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre'
  },
  notes: {
    type: String
  }
});

const Adaptation = mongoose.model('Adaptation', adaptationSchema);

module.exports = Adaptation;
