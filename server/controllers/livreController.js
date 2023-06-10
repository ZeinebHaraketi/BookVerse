const Livre = require("../models/livre");
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
//  const ajoutLivre = async(req,res) =>{
//     try {
//         const livre = new Livre(req.body); 
//         console.log(livre);
//         await livre.save();
 
//         res.status(201).json('Livre crée avec succés');
//     } catch (error) {
//          res.status(500).json({ message: error.message });
//     }
// }
const ajoutLivre = async (req, res) => {
    try {
      const { titre, auteur, genre,categorie } = req.body;
  
      console.log("aaaaaa");
  
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
    const { id } = req.params; // Supposons que vous passez l'ID du livre dans les paramètres de l'URL
  
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
  
module.exports = {
    getLivres,
    getLivre,
    ajoutLivre,
    modifierLivre,
    supprimerLivre
}

  

