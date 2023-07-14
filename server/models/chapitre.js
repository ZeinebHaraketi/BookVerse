const mongoose = require('mongoose');

const chapitreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  numero: { type: Number, required: true },
  numero_page: { type: Number, required: true },
  livre: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre', required: true },
  dateCreation: { type: Date, default: Date.now }
});

const Chapitre = mongoose.model('Chapitre', chapitreSchema);

module.exports = Chapitre;
