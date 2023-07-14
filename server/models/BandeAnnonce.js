const mongoose = require('mongoose');

const bandeAnnonceSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  Adaptation: { type: mongoose.Schema.Types.ObjectId,ref: 'Adaptation', required: true },
  releaseDate: { type: Date, required: true }
});

const BandeAnnonce = mongoose.model('BandeAnnonce', bandeAnnonceSchema);

module.exports = BandeAnnonce;
