const Critique = require('../models/critique');



//------------------------- Ajouter Critique ---------------------------------------------//
const ajouterCritique = async (req, res) => {
    try {
      const critique = await Critique.create(req.body); // Utilisez les données envoyées dans la requête pour créer un nouveau club de lecture
      res.status(201).json(critique);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Afficher tous les Critiques ---------------------------------------------//
const afficherCritiques = async (req, res) => {
    try {
      const critiques = await Critique.find();  
      res.status(200).json(critiques);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Afficher Un seul  Critique ---------------------------------------------//
const afficherOneCritique = async (req, res) => {
    try {
      const critique = await Critique.findById(req.params.id); // Récupérez un critique par son ID
      if (critique) {
        res.json(critique);
      } else {
        res.status(404).json({ error: 'Critique non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Modifier Critique ---------------------------------------------//
const modifierCritique = async (req, res) => {
    try {
      const critique = await Critique.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Mettez à jour un critique par son ID avec les données envoyées dans la requête
      if (critique) {
        res.json(critique);
      } else {
        res.status(404).json({ error: 'Critique non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------- Supprimer Critique ---------------------------------------------//
const supprimerCritique = async (req, res) => {
    try {
      const critique = await Critique.findByIdAndDelete(req.params.id); // Supprimez un chapitre par son ID
      if (critique) {
        res.json({ message: 'Critique supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Critique non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    ajouterCritique,
    afficherCritiques,
    afficherOneCritique, 
    modifierCritique,
    supprimerCritique
}