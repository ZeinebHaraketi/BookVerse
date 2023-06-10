const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true 
    },
    prenom: { 
        type: String,
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    avatar: { 
        type: String 
    },
    interets: {
        type: [String]
      },
      quetesEnCours: {
        type: [String]
      },    
    role: { type: String, enum: ['membre', 'moderateur', 'admin'], default: 'membre' },
    niveau: {
        type: Number,
        default: 1
    },
    recompenses: {
        type: [String]
    },
    historiqueLecture: {
        type: [String]
    },
    historiqueAchat: {
        type: [String]
    },
    clubLecture: {
        type: String
    }


});

const User = mongoose.model('User', userSchema);


module.exports = User;
