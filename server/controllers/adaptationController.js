const Adaptation = require("../models/adaptation");
const Livre = require('../models/livre');
const Event = require('../models/event');



const ajouterAdaptation = async (req, res) => {
    try {
      const adaptation = await Adaptation.create(req.body); // Utilisez les données envoyées dans la requête pour créer un nouveau club de lecture
      res.status(201).json(adaptation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


const afficherAdaptation = async (req, res) => {
    try {
      const adaptations = await Adaptation.find(); // Récupérez tous les adaptations 
      res.status(200).json(adaptations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


const afficherOneAdaptation = async (req, res) => {
    try {
      const adaptation = await Adaptation.findById(req.params.id); // Récupérez une adaptation par son ID
      if (adaptation) {
        res.json(adaptation);
      } else {
        res.status(404).json({ error: 'Adaptation non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const modifierAdaptation = async (req, res) => {
    try {
      const adaptation = await Adaptation.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Mettez à jour un adaptation par son ID avec les données envoyées dans la requête
      if (adaptation) {
        res.json(adaptation);
      } else {
        res.status(404).json({ error: 'Adaptation non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const supprimerAdaptation = async (req, res) => {
    try {
      const adaptation = await Adaptation.findByIdAndDelete(req.params.id); // Supprimez un adaptation par son ID
      if (adaptation) {
        res.json({ message: 'Adaptation supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Adaptation non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//------------------------ Ajouter Chapitre au Livre ---------------------------------------------//
const ajouterAdaptationLivre = async (req, res) => {
    try {
      const livre = await Livre.findById(req.params.id); // Récupérez le livre par son ID
  
      if (!livre) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
  
      const adaptationId = req.body.adaptationId; // Supposons que l'ID du adaptation soit envoyé dans le corps de la requête
  
      livre.adaptations.push(adaptationId); // Ajoutez l'ID du adaptation à la liste des adaptations du livre
      await livre.save(); // Sauvegardez les modifications du livre
  
      res.json(livre);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


//---------------------------------- Supprimer Chapitre de Livre ----------------------------------------//
const supprimerAdaptationLivre = async (req, res) => {
    try {
      const livre = await Livre.findById(req.params.id); // Récupérez le livre par son ID
  
      if (!livre) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
  
      const adaptationId = req.body.adaptationId; 
  
      livre.adaptations.pull(adaptationId); 
      await livre.save(); // Sauvegardez les modifications du club
  
      res.json(livre);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


//---------------------------------- Modifier Adaptation de Livre ----------------------------------------//
const modifierAdaptationLivre = async (req, res) => {
    try {
      const livre = await Livre.findById(req.params.livreId); // Récupérez le livre par son ID
  
      if (!livre) {
        return res.status(404).json({ error: 'Livre non trouvé' });
      }
  
      const adaptationId = req.params.adaptationId; // Supposons que l'ID de l'adaptation soit passé dans les paramètres de la requête
      const adaptation = await Adaptation.findById(adaptationId); // Récupérez l'adaptation par son ID
  
      if (!adaptation) {
        return res.status(404).json({ error: 'Adaptation non trouvée' });
      }
  
      adaptation.titre = req.body.titre; // Modifier le titre de l'adaptation
      adaptation.type = req.body.type; // Modifier le type de l'adaptation
      adaptation.resume = req.body.resume; // Modifier le résumé de l'adaptation
      adaptation.annee = req.body.annee; // Modifier l'année de l'adaptation
      adaptation.directeur = req.body.directeur; // Modifier le directeur de l'adaptation
      adaptation.platforme = req.body.platforme; // Modifier la plateforme de l'adaptation
      adaptation.notes = req.body.notes; // Modifier les notes de l'adaptation
  
      await adaptation.save(); // Sauvegarder les modifications de l'adaptation
  
      res.json(adaptation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//---------------------------------- Rechercher Adaptation ----------------------------------------//

const rechercheAdaptations = async (req, res) => {
  try {
    const { type, titre, annee } = req.query;

    const criteresRecherche = {};

    if (type) {
      criteresRecherche.type = type;
    }

    if (titre) {
      criteresRecherche.titre = { $regex: titre, $options: 'i' };
    }

    if (annee) {
      criteresRecherche.annee = annee;
    }

    const adaptations = await Adaptation.find(criteresRecherche);

    res.json(adaptations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------- Ajouter Event à une Adaptation ----------------------------------------//
const ajouterEvenementAdaptation = async (req, res) => {
  try {
    const adaptationId = req.params.adaptationId;
    const organisateurId = req.params.organisateurId;

    // Vérifier si l'adaptation existe
    const adaptation = await Adaptation.findById(adaptationId);

    if (!adaptation) {
      return res.status(404).json({ error: 'Adaptation non trouvée' });
    }

    // Créer un nouvel événement
    const nouvelEvenement = new Event({
      titre: req.body.titre,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      adaptation: adaptation._id, // Lier l'événement à l'adaptation
      organisateur: organisateurId, // L'ID de l'organisateur récupéré des paramètres
      participants: [], // Initialisez la liste des participants
      specialGuests: [], // Initialisez la liste des invités spéciaux
      theme: req.body.theme,
      activites: [], // Initialisez la liste des activités
      resources: [], // Initialisez la liste des ressources
      commentaires: [] // Initialisez la liste des commentaires
    });

    // Enregistrez l'événement dans le modèle Event
    const evenement = await nouvelEvenement.save();

    // Ajoutez l'ID de l'événement à l'adaptation
    adaptation.event.push(evenement._id);
    await adaptation.save();

    res.json({ message: 'Événement ajouté avec succès', evenement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//---------------------------------- Modifier Event à une Adaptation ----------------------------------------//
const modifierEvenementAdaptation = async (req, res) => {
  try {
    const adaptationId = req.params.adaptationId;
    const evenementId = req.params.evenementId;

    // Vérifier si l'adaptation existe
    const adaptation = await Adaptation.findById(adaptationId);

    if (!adaptation) {
      return res.status(404).json({ error: 'Adaptation non trouvée' });
    }

    // Débogage : afficher les informations de l'adaptation
    console.log('Adaptation:', adaptation);

    // Vérifier si l'événement existe dans l'adaptation
    const evenement = await Event.findById(evenementId).populate('adaptation');

    // Débogage : afficher les informations de l'événement
    console.log('Evenement:', evenement);

    if (!evenement || evenement.adaptation._id.toString() !== adaptationId) {
      return res.status(404).json({ error: 'Event non trouvé' });
    }

    // Mettre à jour les champs de l'événement
    evenement.participants = req.body.participants || evenement.participants;
    evenement.specialGuests = req.body.specialGuests || evenement.specialGuests;
    evenement.activites = req.body.activites || evenement.activites;
    evenement.resources = req.body.resources || evenement.resources;
    evenement.commentaires = req.body.commentaires || evenement.commentaires;

    // Enregistrer les modifications de l'événement
    const evenementModifie = await evenement.save();

    res.json({ message: 'Événement modifié avec succès', evenement: evenementModifie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------------------- Supprimer Event à une Adaptation ----------------------------------------//
const supprimerEvenementAdaptation = async (req, res) => {
  try {
    const adaptationId = req.params.adaptationId;
    const evenementId = req.params.evenementId;

    // Vérifier si l'adaptation existe
    const adaptation = await Adaptation.findById(adaptationId);

    if (!adaptation) {
      return res.status(404).json({ error: 'Adaptation non trouvée' });
    }

    // Vérifier si l'ID de l'événement dans l'adaptation correspond à celui fourni
    if (!adaptation.event || adaptation.event.toString() !== evenementId) {
      return res.status(404).json({ error: 'Événement non trouvé dans l\'adaptation' });
    }

    // Supprimer la référence à l'événement de l'adaptation
    adaptation.event = undefined;
    await adaptation.save();

    res.json({ message: 'Événement supprimé avec succès de l\'adaptation' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
module.exports = {
    ajouterAdaptation,
    afficherAdaptation,
    afficherOneAdaptation,
    modifierAdaptation,
    supprimerAdaptation,
    modifierAdaptationLivre,
    rechercheAdaptations,
    ajouterEvenementAdaptation,
    modifierEvenementAdaptation,
    supprimerEvenementAdaptation
}
