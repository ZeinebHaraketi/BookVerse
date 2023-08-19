const mongoose = require('mongoose');

const panierSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProduitDerive' }],
  dateCreation: { type: Date, default: Date.now } 
});

const Panier = mongoose.model('Panier', panierSchema);

module.exports = Panier;
