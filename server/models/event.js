const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date,default: Date.now  },
  imageE: { type: String },
  time: { type: String },
  localisation: { type: String },
  clubDeLecture: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubDeLecture' },
  adaptation: { type: mongoose.Schema.Types.ObjectId, ref: 'Adaptation' },
  organisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  specialGuests: [{ type: String }],
  theme: { type: String },
  activites: [{ type: String }],
  resources: [{ type: String }],
  commentaires: 
  [{
    user: { type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    contenu: { type: String }, 
    date: {type: Date, default: Date.now }
  }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
