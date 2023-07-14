const Discussion = require('../models/discussion');


//------------------------- Ajouter Discussion ---------------------------------------------//
const ajouterDiscussion = async (req, res) => {
    try {
      const discussion = await Discussion.create(req.body); // Utilisez les données envoyées dans la requête pour créer un nouveau club de lecture
      res.status(201).json(discussion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Afficher tous les Discussions ---------------------------------------------//
const afficherDiscussion = async (req, res) => {
    try {
      const discussions = await Discussion.find();  
      res.status(200).json(discussions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Afficher Une seule Discussion ---------------------------------------------//
const afficherOneDiscussion = async (req, res) => {
    try {
      const discussion = await Discussion.findById(req.params.id); // Récupérez une discussion par son ID
      if (discussion) {
        res.json(discussion);
      } else {
        res.status(404).json({ error: 'Discussion non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Modifier Discussion ---------------------------------------------//
const modifierDiscussion = async (req, res) => {
    try {
      const discussion = await Discussion.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Mettez à jour une Discussion par son ID avec les données envoyées dans la requête
      if (discussion) {
        res.json(discussion);
      } else {
        res.status(404).json({ error: 'Discussion non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Supprimer Discussion ---------------------------------------------//
const supprimerDiscussion = async (req, res) => {
    try {
      const discussion = await Discussion.findByIdAndDelete(req.params.id); // Supprimez une Discussion par son ID
      if (discussion) {
        res.json({ message: 'Discussion supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Discussion non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    ajouterDiscussion,
    afficherDiscussion,
    afficherOneDiscussion,
    modifierDiscussion,
    supprimerDiscussion
}
