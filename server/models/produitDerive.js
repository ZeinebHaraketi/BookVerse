const mongoose = require('mongoose');

const produitDeriveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  qte: { type: Number},
  imageP: { type: String },
  categorie: { type: String, enum: ['Figurine', 'Affiche', 'Vêtement','Lego', 'Autre'], required: true },
  dateAjout: { type: Date, default: Date.now }
});

const ProduitDerive = mongoose.model('ProduitDerive', produitDeriveSchema);

module.exports = ProduitDerive;
