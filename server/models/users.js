const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    interets: { type: [String] },
    quetesEnCours: { type: [String] },    
    role: { type: String, enum: ['membre', 'moderateur', 'admin'], default: 'membre' },
    niveau: { type: Number, default: 1 },
    recompenses: { type: [String] },
    historiqueLecture: { type: [String] },
    historiqueAchat: { type: [String] },
    clubLecture: {type: mongoose.Schema.Types.ObjectId, ref: 'ClubDeLecture' },
    discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
    livres_lus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }],
    critiques_faits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Critique' }],
    faceDescriptor: { type: Array },
});

const User = mongoose.model('User', userSchema);


module.exports = User;
