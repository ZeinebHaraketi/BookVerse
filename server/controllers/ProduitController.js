const Produit = require('../models/produitDerive');
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
  

// Ajouter un produit
const ajouterProduit = async (req, res) => {
  try {
    const { nom, description, prix, imageP, categorie } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path);

    const produit = new Produit({
      nom,
      description,
      prix,
      imageP: result.secure_url, // Stockez l'URL sécurisée de l'image de Cloudinary dans le champ 'image' du livre,
      categorie
    });

    const nouveauProduit = await produit.save();

    res.status(201).json(nouveauProduit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Afficher tous les produits
const afficherProduits = async (req, res) => {
  try {
    const produits = await Produit.find();

    res.json(produits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Afficher un produit 
const AfficherOneProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(produit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier un produit 
const modifierProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    produit.nom = req.body.nom;
    produit.description = req.body.description;
    produit.prix = req.body.prix;
    produit.image = req.body.image;
    produit.categorie = req.body.categorie;

    const produitMisAJour = await produit.save();

    res.json(produitMisAJour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un produit 
const supprimerProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndRemove(req.params.id);

    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Recherche
const rechercheProduits = async (req, res) => {
  try {
    const {
      nom,
      prix,
      qte,
      categorie,
     
    } = req.query;

    // Create an array to store individual queries
    const queries = [];

    // Build the query for each search parameter if it exists
    if (nom) {
      queries.push({ nom: { $regex: nom, $options: "i" } });
    }

    if (prix) {
      queries.push({ prix });
    }

    if (qte) {
      queries.push({ qte });
    }

    if (categorie) {
      queries.push({ categorie: { $regex: categorie, $options: "i" } });
    }

   

    // Combine individual queries using "$or" to perform an "OR" operation
    const combinedQuery = { $or: queries };

    const produits = await Produit.find(combinedQuery);

    res.json(produits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  ajouterProduit,
  afficherProduits,
  AfficherOneProduit,
  modifierProduit,
  supprimerProduit,
  rechercheProduits
};
