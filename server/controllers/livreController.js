const Livre = require("../models/livre");
const Chapitre = require('../models/chapitre');
const Adaptation = require('../models/adaptation');
const Critique = require('../models/critique');
const User = require('../models/users');




const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



//------------------------ Cloudinary Infos -----------------------------------------------//
cloudinary.config({
    cloud_name: 'djjimxala',
    api_key: '835443316573354',
    api_secret: '-kCoGza7xNvaAIHDDjGUvr3GRDA'
});
// Configurez le stockage Cloudinary pour Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'BookV', // Spécifiez le dossier dans lequel les images seront stockées sur Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'] // Définissez les formats de fichier autorisés
    }
});
  

//------------------------- Ajouter Livre ---------------------------------------------//
const ajoutLivre = async (req, res) => {
    try {
      const { titre, auteur, genre,categorie } = req.body;
  
  
      // Télécharger l'image sur Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      const livre = new Livre({
        titre,
        auteur,
        genre,
        categorie,
        image: result.secure_url // Stockez l'URL sécurisée de l'image de Cloudinary dans le champ 'image' du livre
      });
  
      await livre.save();
  
      res.status(201).json('Livre créé avec succès');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  

//------------------------- Afficher tout les Livres ---------------------------------------------//
 const getLivres = async(req, res)=>{
    try {

        const livres = await Livre.find();
        res.status(200).json(livres);
 
    } catch (error) {
         res.status(404).json({ message: error.message });
    }
}


//------------------------- Afficher un seul Livre ---------------------------------------------//
 const getLivre = async (req, res) => {
    const { id } = req.params; // Supposons que vous passez l'ID du livre dans les paramètres de l'URL
  
    try {
      const livre = await Livre.findById(id); // Utilisez la méthode findById de Mongoose pour récupérer le livre par son ID
      if (!livre) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      res.status(200).json(livre);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

//------------------------- Modifier un  Livre ---------------------------------------------//
//  const modifierLivre = async (req, res) => {
//     try {
//         const livre = await Livre.findByIdAndUpdate(req.params.id,  req.body, { new: true });

//         if (livre) {
//             res.status(200).json(livre);
//         } else {
//             res.status(404).json({ message: 'Livre not found' });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }
const modifierLivre = async (req, res) => {
    try {
      const { id } = req.params;
      const { titre, auteur, genre, categorie } = req.body;
  
      // Vérifiez si une nouvelle image a été téléchargée
      let imageUrl;
      if (req.file) {
        // Téléchargez la nouvelle image sur Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
  
        // Récupérez l'URL sécurisée de la nouvelle image
        imageUrl = result.secure_url;
      }
  
      // Recherchez le livre à mettre à jour
      const livre = await Livre.findById(id);
  
      if (!livre) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
  
      // Mettez à jour les propriétés du livre
      livre.titre = titre;
      livre.auteur = auteur;
      livre.genre = genre;
      livre.categorie = categorie;
      
      // Mettez à jour l'URL de l'image si une nouvelle image a été téléchargée
      if (imageUrl) {
        livre.image = imageUrl;
      }
  
      // Enregistrez les modifications
      await livre.save();
  
      res.status(200).json('Livre modifié avec succès');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

//------------------------- Supprimer un  Livre ---------------------------------------------//
 const supprimerLivre = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const livre = await Livre.findByIdAndDelete(id); // Trouver le livre par son ID
      if (!livre) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
    
      res.status(200).json({ message: 'Livre supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

//---------------------------------------- Recherche Multi-Critère ------------------------------------------//
// const rechercheLivres = async (req, res) => {
//   try {
//     const {
//       genre,
//       categorie,
//       auteur,
//       titre,
//       anneePublication,
//       adaptationsCinematographiques,
//       adaptationsJeuxVideo,
//       note
//     } = req.query;

//     const criteresRecherche = {};

//     if (genre) {
//       criteresRecherche.genre = genre;
//     }

//     if (categorie) {
//       criteresRecherche.categorie = categorie;
//     }

//     if (auteur) {
//       criteresRecherche.auteur = auteur;
//     }

//     if (titre) {
//       criteresRecherche.titre = { $regex: titre, $options: 'i' };
//     }

//     if (anneePublication) {
//       criteresRecherche.anneePublication = anneePublication;
//     }

//     if (adaptationsCinematographiques) {
//       criteresRecherche.adaptationsCinematographiques = adaptationsCinematographiques;
//     }

//     if (adaptationsJeuxVideo) {
//       criteresRecherche.adaptationsJeuxVideo = adaptationsJeuxVideo;
//     }

//     if (note) {
//       criteresRecherche.note = note;
//     }

//     const livres = await Livre.find({ $and: [criteresRecherche] });

//     res.json(livres);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// Node.js code
// Node.js code
const rechercheLivres = async (req, res) => {
  try {
    const {
      genre,
      categorie,
      auteur,
      titre,
      anneePublication,
      adaptationsCinematographiques,
      adaptationsJeuxVideo,
      note,
    } = req.query;

    // Create an array to store individual queries
    const queries = [];

    // Build the query for each search parameter if it exists
    if (genre) {
      queries.push({ genre });
    }

    if (categorie) {
      queries.push({ categorie });
    }

    if (auteur) {
      queries.push({ auteur });
    }

    if (titre) {
      queries.push({ titre: { $regex: titre, $options: "i" } });
    }

    if (anneePublication) {
      queries.push({ anneePublication });
    }

    if (adaptationsCinematographiques) {
      queries.push({ adaptationsCinematographiques });
    }

    if (adaptationsJeuxVideo) {
      queries.push({ adaptationsJeuxVideo });
    }

    if (note) {
      queries.push({ note });
    }

    // Combine individual queries using "$or" to perform an "OR" operation
    const combinedQuery = { $or: queries };

    const livres = await Livre.find(combinedQuery);

    res.json(livres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




//---------------------------------------- Tri Multi-Critère NE MARCHE PAS ------------------------------------------//
const triLivres  =  async (req, res) => {
  try {
    const { genre, categorie, note, anneePublication, ordre } = req.query;

    const criteresTri = {};

    if (genre) {
      criteresTri.genre = genre;
    }

    if (categorie) {
      criteresTri.categorie = categorie;
    }

    if (note) {
      criteresTri.note = note;
    }

    if (anneePublication) {
      criteresTri.anneePublication = anneePublication;
    }

    const ordreTri = ordre === 'desc' ? -1 : 1;

    const livres = await Livre.find(criteresTri).sort({ genre: ordreTri, categorie: ordreTri, note: ordreTri, anneePublication: ordreTri });

    res.json(livres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//------------------------------------- Ajouter un Chapitre dans un Livre --------------------------------------------//
const ajouterChapitreLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.livreId); // Récupérez le livre par son ID

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const chapitre = new Chapitre({
      titre: req.body.titre,
      contenu: req.body.contenu,
      numero: req.body.numero,
      numero_page: req.body.numero_page,
      livre: livre._id
    });

    await chapitre.save(); // Enregistrez le chapitre dans le modèle Chapitre

    livre.chapitres.push(chapitre._id); // Ajoutez l'ID du chapitre à la liste des chapitres du livre
    await livre.save(); // Sauvegardez les modifications du livre

    res.json(livre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  

//------------------------------------- Modifier un Chapitre dans un Livre --------------------------------------------//
const modifierChapitreLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.livreId); // Récupérez le livre par son ID

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const chapitreId = req.params.chapitreId; // Supposons que l'ID du chapitre soit passé dans les paramètres de la requête

    const chapitre = livre.chapitres.find(chapitre => chapitre._id.toString() === chapitreId);

    if (!chapitre) {
      return res.status(404).json({ error: 'Chapitre non trouvé dans le livre' });
    }

    chapitre.titre = req.body.titre; // Modifier le titre du chapitre
    chapitre.contenu = req.body.contenu; // Modifier le contenu du chapitre
    chapitre.numero = req.body.numero; // Modifier le numéro du chapitre
    chapitre.numero_page = req.body.numero_page; // Modifier le numéro de page du chapitre

    await livre.save(); // Sauvegarder les modifications du livre

    const chapitreModifie = await Chapitre.findByIdAndUpdate(
      chapitreId,
      {
        titre: req.body.titre,
        contenu: req.body.contenu,
        numero: req.body.numero,
        numero_page: req.body.numero_page
      },
      { new: true }
    ); // Modifier le chapitre dans le modèle Chapitre

    res.json({ livre, chapitre: chapitreModifie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------- Supprimer un Chapitre dans un Livre --------------------------------------------//
const supprimerChapitreLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.livreId); // Récupérez le livre par son ID

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const chapitreId = req.params.chapitreId; // Supposons que l'ID du chapitre soit passé dans les paramètres de la requête

    const chapitreIndex = livre.chapitres.findIndex(chapitre => chapitre._id.toString() === chapitreId);

    if (chapitreIndex === -1) {
      return res.status(404).json({ error: 'Chapitre non trouvé dans le livre' });
    }

    livre.chapitres.splice(chapitreIndex, 1); // Supprimer le chapitre du tableau des chapitres du livre

    await livre.save(); // Sauvegarder les modifications du livre

    await Chapitre.findByIdAndRemove(chapitreId); // Supprimer le chapitre du modèle Chapitre

    res.json(livre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------- Lire un chapitre bien spécifique dans un Livre --------------------------------------------//

// Endpoint to read a specific chapter of a book by its Livre ID and Chapitre ID
// const LectureLivre =  async (req, res) => {
//   const { livreId, chapitreId } = req.params;

//   try {
//     // Find the book by its Livre ID and retrieve the Chapitre with the given Chapitre ID
//     const livre = await Livre.findById(livreId);

//     if (!livre) {
//       return res.status(404).json({ message: "Livre not found" });
//     }

//     // Find the specific chapitre by its Chapitre ID within the Livre
//     const chapitre = livre.chapitres.find(
//       (chapitre) => chapitre._id.toString() === chapitreId
//     );

//     if (!chapitre) {
//       return res.status(404).json({ message: "Chapitre not found" });
//     }

//     // Assuming you have a property called "contenu" in your Chapitre model that contains the chapter content
//     const chapitreContent = chapitre.contenu;

//     res.status(200).json({ contenu: chapitreContent });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }
const LectureLivre = async (req, res) => {
  const { livreId, chapitreId } = req.params;

  try {
    // Find the book by its Livre ID and retrieve the Chapitre with the given Chapitre ID
    const livre = await Livre.findById(livreId);

    if (!livre) {
      return res.status(404).json({ message: "Livre not found" });
    }

    // Find the specific chapitre by its Chapitre ID within the Livre
    const chapitre = livre.chapitres.find(
      (chapitre) => chapitre._id.toString() === chapitreId
    );

    if (!chapitre) {
      return res.status(404).json({ message: "Chapitre not found" });
    }

    // Assuming you have a property called "contenu" in your Chapitre model that contains the chapter content
    const chapitreContent = chapitre.contenu;

    res.status(200).json({ contenu: chapitreContent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Supposons que vous avez un modèle 'Chapitre' dans votre fichier modèle

const getChapitresByTitre = async (req, res) => {
  const { id } = req.params; // Supposons que vous passez l'ID du livre dans les paramètres de l'URL

  try {
    // Utilisez la méthode find de Mongoose pour récupérer les chapitres du livre par leur titre, triés par ordre alphabétique
    const chapitres = await Chapitre.find({ livreId: id }).sort({ titre: 1 });

    res.status(200).json(chapitres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//------------------------------------- Ajouter une Adaptation dans un Livre --------------------------------------------//
const ajouterAdaptationLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.livreId); // Récupérez le livre par son ID

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const { titre, type, resume, annee, directeur, plateforme, notes } = req.body; // Supposons que les données de l'adaptation sont envoyées dans le corps de la requête

    // Créez une nouvelle instance du modèle Adaptation
    const nouvelleAdaptation = new Adaptation({
      titre,
      type,
      resume,
      annee,
      directeur,
      plateforme,
      notes
    });

    // Ajoutez l'ID de l'adaptation au livre
    livre.adaptations.push(nouvelleAdaptation._id);

    // Sauvegardez l'adaptation et le livre
    await nouvelleAdaptation.save();
    await livre.save();

    res.json({ livre, adaptation: nouvelleAdaptation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------- Modifier une Adaptation dans un Livre --------------------------------------------//
// const modifierAdaptationLivre = async (req, res) => {
//   try {
//     const livre = await Livre.findById(req.params.livreId); // Récupérer le livre par son ID

//     if (!livre) {
//       return res.status(404).json({ error: 'Livre non trouvé' });
//     }

//     const adaptationId = req.params.adaptationId; // Supposons que l'ID de l'adaptation soit passé dans les paramètres de la requête

//     const adaptationModifiee = await Adaptation.findOneAndUpdate(
//       { _id: adaptationId },
//       {
//         titre: req.body.titre,
//         type: req.body.type,
//         resume: req.body.resume,
//         annee: req.body.annee,
//         directeur: req.body.directeur,
//         plateforme: req.body.plateforme,
//         notes: req.body.notes
//       },
//       { new: true }
//     );

//     const adaptationIndex = livre.adaptations.findIndex(adaptation => adaptation._id.toString() === adaptationId);

//     if (adaptationIndex === -1) {
//       return res.status(404).json({ error: 'Adaptation non trouvée dans le livre' });
//     }

//     livre.adaptations[adaptationIndex] = adaptationModifiee; // Mettre à jour l'adaptation dans le livre

//     await livre.save(); // Sauvegarder les modifications du livre

//     res.json({ livre, adaptation: adaptationModifiee });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//------------------------------------- Supprimer une Adaptation dans un Livre --------------------------------------------//
const supprimerAdaptationLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.livreId); // Récupérer le livre par son ID

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const adaptationId = req.params.adaptationId; // Supposons que l'ID de l'adaptation soit passé dans les paramètres de la requête

    const adaptationIndex = livre.adaptations.findIndex(adaptation => adaptation._id.toString() === adaptationId);

    if (adaptationIndex === -1) {
      return res.status(404).json({ error: 'Adaptation non trouvée dans le livre' });
    }

    const adaptationSupprimee = await Adaptation.findByIdAndRemove(adaptationId);

    livre.adaptations.splice(adaptationIndex, 1); // Supprimer l'adaptation dans le livre

    await livre.save(); // Sauvegarder les modifications du livre

    res.json({ livre, adaptation: adaptationSupprimee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------- Ajouter une Critique à un Livre --------------------------------------------//
//CA MARCHE 
const ajouterCritiqueLivre = async (req, res) => {
  try {
    const livreId = req.params.livreId;
    const userId = req.params.userId;

    const livre = await Livre.findById(livreId);

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const critique = new Critique({
      user: userId,
      rating: req.body.rating,
      comment: req.body.comment,
      livre: livre._id
    });

    const savedCritique = await critique.save();

    const user = await User.findById(userId);
    console.log(savedCritique._id);
    user.critiques.push(savedCritique._id);
    await user.save();

    if (!Array.isArray(livre.critiques)) {
      livre.critiques = []; // Initialiser la liste des critiques du livre si ce n'est pas un tableau
    }
    livre.critiques.push(savedCritique._id);
    await livre.save();

    res.status(201).json({ message: 'Critique ajoutée avec succès', critique: savedCritique });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// const ajouterCritiqueLivre = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const { rating, comment, livreId } = req.body;

//     const livre = await Livre.findById(livreId);

//     if (!livre) {
//       return res.status(404).json({ error: 'Livre non trouvé' });
//     }

//     const critique = new Critique({
//       user: userId,
//       rating: rating,
//       comment: comment,
//       livre: livre._id
//     });

//     const savedCritique = await critique.save();

//     const user = await User.findById(userId);
//     user.critiques.push(savedCritique._id);
//     await user.save();

//     if (!Array.isArray(livre.critiques)) {
//       livre.critiques = [];
//     }
//     livre.critiques.push(savedCritique._id);
//     await livre.save();

//     res.status(201).json({ message: 'Critique ajoutée avec succès', critique: savedCritique });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



//------------------------------------- Modifier une Critique dans un Livre --------------------------------------------//
const modifierCritiqueLivre = async (req, res) => {
  try {
    const livreId = req.params.livreId;
    const critiqueId = req.params.critiqueId;
    const userId = req.params.userId;

    const livre = await Livre.findById(livreId);

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const critique = await Critique.findOneAndUpdate(
      { _id: critiqueId, livre: livreId, user: userId }, // Filtre pour trouver la critique spécifique
      {
        rating: req.body.rating,
        comment: req.body.comment
      },
      { new: true }
    );

    if (!critique) {
      return res.status(404).json({ error: 'Critique non trouvée dans le livre' });
    }

    // Mettre à jour la critique dans le modèle User
    await User.findOneAndUpdate(
      { _id: userId, critiques: critiqueId },
      { $set: { 'critiques.$.rating': req.body.rating, 'critiques.$.comment': req.body.comment } }
    );

    res.json({ livre, critique });
  } catch (error) {
    console.error('Erreur lors de la modification de la critique sur le livre :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la modification de la critique sur le livre' });
  }
};

//------------------------------------- Supprimer une Critique dans un Livre --------------------------------------------//
const supprimerCritiqueLivre = async (req, res) => {
  try {
    const livreId = req.params.livreId;
    const critiqueId = req.params.critiqueId;
    const userId = req.params.userId;

    const livre = await Livre.findById(livreId);

    if (!livre) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    const critique = await Critique.findOneAndDelete({ _id: critiqueId, livre: livreId, user: userId });

    if (!critique) {
      return res.status(404).json({ error: 'Critique non trouvée dans le livre' });
    }

    // Supprimer la critique du modèle User
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { critiques: critiqueId } }
    );

    res.json({ message: 'Critique supprimée avec succès', critique });
  } catch (error) {
    console.error('Erreur lors de la suppression de la critique sur le livre:', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression de la critique sur le livre' });
  }
};




module.exports = {
    getLivres,
    getLivre,
    ajoutLivre,
    modifierLivre,
    supprimerLivre,
    rechercheLivres,
    triLivres,
    ajouterChapitreLivre,
    modifierChapitreLivre,
    supprimerChapitreLivre,
    getChapitresByTitre,
    LectureLivre,
    ajouterAdaptationLivre,
    //modifierAdaptationLivre,
    supprimerAdaptationLivre,
    ajouterCritiqueLivre,
    modifierCritiqueLivre,
    supprimerCritiqueLivre,
    
}

  

