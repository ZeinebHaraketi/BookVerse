const Chapitre = require('../models/chapitre');
const Livre = require('../models/livre');



const ajouterChapitre = async (req, res) => {
    try {
      const chapitre = await Chapitre.create(req.body); // Utilisez les données envoyées dans la requête pour créer un nouveau club de lecture
      res.status(201).json(chapitre);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};



const afficherChapitres = async (req, res) => {
    try {
      const chapitres = await Chapitre.find(); // Récupérez tous les chapitres 
      res.status(200).json(chapitres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


const afficherOneChapitre = async (req, res) => {
    try {
      const chapitres = await Chapitre.findById(req.params.id); // Récupérez un chapitres par son ID
      if (chapitres) {
        res.json(chapitres);
      } else {
        res.status(404).json({ error: 'Chapitre non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


const modifierChapitre = async (req, res) => {
    try {
      const chapitre = await Chapitre.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Mettez à jour un chapitre par son ID avec les données envoyées dans la requête
      if (chapitre) {
        res.json(chapitre);
      } else {
        res.status(404).json({ error: 'Chapitre non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};



const supprimerChapitre = async (req, res) => {
    try {
      const chapitre = await Chapitre.findByIdAndDelete(req.params.id); // Supprimez un chapitre par son ID
      if (chapitre) {
        res.json({ message: 'Chapitre supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Chapitre non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


  


module.exports = {
    ajouterChapitre,
    afficherChapitres,
    afficherOneChapitre,
    modifierChapitre,
    supprimerChapitre,
}