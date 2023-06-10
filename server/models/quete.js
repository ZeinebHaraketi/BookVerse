const mongoose = require('mongoose');

const queteSchema = new mongoose.Schema({
  titre: { type: String,required: true },
  description: { type: String },
  theme: { type: String },
  livresRequis: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre'
  }],
  niveauxRequis: { type: [Number] },
  recompenses: { type: [String] },
  contenuBonus: { type: String }
});

const Quete = mongoose.model('Quete', queteSchema);

module.exports = Quete;
