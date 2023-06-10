const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  auteur: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true

  },
  categorie: {
    type: String,
    enum: ['fanfiction', 'Manga', 'BD','Roman'],
    required: true

  },
  anneePublication: {
    type: Number,

  },
  resume: {
    type: String
  },
  image: {
    type: String
  },
  adaptationsCinematographiques: {
    type: [String]
  },
  adaptationsJeuxVideo: {
    type: [String]
  },
  note: {
    type: Number,
    min: 0,
    max: 5
  },
  avis: {
    type: String
  }
});

const Livre = mongoose.model('Livre', livreSchema);

module.exports = Livre;
