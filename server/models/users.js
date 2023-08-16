const mongoose = require('mongoose');
const Librairie = require('./librairie');
// const Librairie = require('./librairie'); // Adjust the path as needed



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
    librairie: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Librairie'
      }],
    // librairie: {type: mongoose.Schema.Types.ObjectId, ref: 'Librairie' },
    discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
    livres_lus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }],
    critiques: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Critique' }],
    faceDescriptor: { type: Array },
});


userSchema.pre('save', async function (next) {
  if (this.isNew && this.role === 'membre' && this.librairie.length === 0) {
    try {
      const defaultLibrairie = new Librairie({ name: 'Librairie 1' });
      await defaultLibrairie.save();

      this.librairie.push(defaultLibrairie._id);
    } catch (error) {
      console.error("Error creating default library:", error);
    }
  }

  next();
});

userSchema.post('save', async function (doc, next) {
  if (doc.role === 'membre' && doc.librairie.length > 0) {
    try {
      const librairie = await Librairie.findById(doc.librairie[0]);
      if (librairie) {
        librairie.livres.addToSet(doc._id);
        await librairie.save();
      }
    } catch (error) {
      console.error("Error adding user to library:", error);
    }
  }

  next();
});
// // Function to create the default library
// const createDefaultLibrairie = async () => {
//   try {
//     const defaultLibrairie = new Librairie({ name: 'Librairie 1' });
//     await defaultLibrairie.save();
//     return defaultLibrairie._id;
//   } catch (error) {
//     console.error("Error creating default library:", error);
//     return null;
//   }
// };

// // Middleware to associate default library with user
// userSchema.post('save', async function (doc, next) {
//   if (this.role === 'membre') {
//     const defaultLibrairieId = await createDefaultLibrairie();
//     if (defaultLibrairieId) {
//       await User.findByIdAndUpdate(doc._id, { librairie: [defaultLibrairieId] });
//     }
//   }
//   next();
// });



const User = mongoose.model('User', userSchema);


module.exports = User;
