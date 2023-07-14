const { default: mongoose } = require("mongoose");
const ClubDeLecture = require("../models/clubDeLecture"); // Assurez-vous d'avoir importé votre modèle Mongoose
const Discussion = require('../models/discussion');


const ajouterCludLecture = async (req, res) => {
    try {
      const club = await ClubDeLecture.create(req.body); // Utilisez les données envoyées dans la requête pour créer un nouveau club de lecture
      res.status(201).json(club);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};



const afficherClubs = async (req, res) => {
    try {
      const clubs = await ClubDeLecture.find(); // Récupérez tous les clubs de lecture
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


const afficherOneClub = async (req, res) => {
    try {
      const club = await ClubDeLecture.findById(req.params.id); // Récupérez un club de lecture par son ID
      if (club) {
        res.json(club);
      } else {
        res.status(404).json({ error: 'Club de lecture non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


const modifierClub = async (req, res) => {
    try {
      const club = await ClubDeLecture.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Mettez à jour un club de lecture par son ID avec les données envoyées dans la requête
      if (club) {
        res.json(club);
      } else {
        res.status(404).json({ error: 'Club de lecture non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const supprimerClub = async (req, res) => {
    try {
      const club = await ClubDeLecture.findByIdAndDelete(req.params.id); // Supprimez un club de lecture par son ID
      if (club) {
        res.json({ message: 'Club de lecture supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Club de lecture non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


//------------------------ Ajouter Membre au Club ---------------------------------------------//
const ajouterMembreClub = async (req, res) => {
    try {
      const club = await ClubDeLecture.findById(req.params.id); // Récupérez le club de lecture par son ID
  
      if (!club) {
        return res.status(404).json({ error: 'Club de lecture non trouvé' });
      }
  
      const memberId = req.body.memberId; // Supposons que l'ID du membre soit envoyé dans le corps de la requête
  
      club.membres.push(memberId); // Ajoutez l'ID du membre à la liste des membres du club
      await club.save(); // Sauvegardez les modifications du club
  
      res.json(club);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


//--------------------------------- Ajouter Livre Lus --------------------------------------------------//
const ajouterLivreClub = async (req, res) => {
    try {
      const club = await ClubDeLecture.findById(req.params.id); // Récupérez le club de lecture par son ID
  
      if (!club) {
        return res.status(404).json({ error: 'Club de lecture non trouvé' });
      }
  
      const livreId = req.body.livreId; // Supposons que l'ID du membre soit envoyé dans le corps de la requête
  
      club.livres_lus.push(livreId); // Ajoutez l'ID du membre à la liste des membres du club
      await club.save(); // Sauvegardez les modifications du club
  
      res.status(201).json(club);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

//--------------------------------- Afficher Livre Lus --------------------------------------------------//

const afficherLivresLus = async (req, res) => {
  try {
    const clubDeLectureId = req.params.clubDeLectureId;

    // Récupérer le club de lecture par son ID
    const clubDeLecture = await ClubDeLecture.findById(clubDeLectureId).populate('livres_lus');

    if (!clubDeLecture) {
      return res.status(404).json({ error: 'Club de lecture non trouvé' });
    }

    // Récupérer les livres lus dans le club de lecture
    const livresLus = clubDeLecture.livres_lus;

    res.json({ livresLus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---------------------------------- Supprimer Membre du club ----------------------------------------//
const supprimerMembreClub = async (req, res) => {
    try {
      const club = await ClubDeLecture.findById(req.params.id); // Récupérez le club de lecture par son ID
  
      if (!club) {
        return res.status(404).json({ error: 'Club de lecture non trouvé' });
      }
  
      const memberId = req.params.memberId; // Récupérez l'ID du membre à supprimer
  
      club.membres.pull(memberId); // Retirez l'ID du membre de la liste des membres du club
      await club.save(); // Sauvegardez les modifications du club
  
      res.json(club);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
  
//--------------------------------- Rechercher & Trier ---------------------------------------------//
const findAndSortClub = async (req, res) => {
    try {
      const { query, sort } = req.query;
      
      // Créez un objet de recherche en fonction du nom du club de lecture
      const searchQuery = query ? { name: { $regex: query, $options: 'i' } } : {};
  
      let clubs = await ClubDeLecture.find(searchQuery)
        .populate('membres') // Remplacez 'membres' par les noms des propriétés que vous souhaitez peupler
        .sort({ createdDate: sort === 'asc' ? 1 : -1 }); // Tri par date de création (ascendant ou descendant)
  
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
 
//--------------------------------- Ajouter Discussion au Club --------------------------------------------------//
const ajouterDiscussionClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const userId = req.params.userId;

    // Vérifier si le club de lecture existe
    const club = await ClubDeLecture.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: 'Club de lecture non trouvé' });
    }

    // Créer une nouvelle discussion
    const nouvelleDiscussion = new Discussion({
      titre: req.body.titre,
      membre: userId,
      contenu: req.body.contenu,
      clubAssocie: club._id
    });

    // Enregistrer la discussion dans le modèle "Discussion"
    const discussion = await nouvelleDiscussion.save();

    // Ajouter l'ID de la discussion au club de lecture
    club.discussions.push(discussion._id);
    await club.save();

    res.json({ message: 'Discussion ajoutée avec succès', discussion });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la discussion au club de lecture :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'ajout de la discussion au club de lecture' });
  }
};


// Ajouter une réponse à une discussion dans un club de lecture
const ajouterReponseDiscussion = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const discussionId = req.params.discussionId;
    const membreId = req.params.membreId;

    // Vérifier si le club de lecture existe
    const club = await ClubDeLecture.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: 'Club de lecture non trouvé' });
    }

    // Vérifier si la discussion existe dans le club de lecture
    const discussion = await Discussion.findOne({ _id: discussionId, clubAssocie: club._id });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion non trouvée dans le club de lecture' });
    }

    // Vérifier la validité de l'ID du membre
    if (!mongoose.isValidObjectId(membreId)) {
      return res.status(400).json({ error: 'ID de membre invalide' });
    }

    // Créer une nouvelle réponse
    const nouvelleReponse = {
      membre: mongoose.Types.ObjectId(membreId),
      contenu: req.body.contenu
    };

    // Ajouter la réponse à la discussion
    discussion.reponses.push(nouvelleReponse);
    await discussion.save();

    res.json({ message: 'Réponse ajoutée avec succès', discussion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








// Ajouter un membre à une discussion dans un club de lecture
const ajouterMembreDiscussion = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const discussionId = req.params.discussionId;

    // Vérifier si le club de lecture existe
    const club = await ClubDeLecture.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: 'Club de lecture non trouvé' });
    }

    // Vérifier si la discussion existe dans le club de lecture
    const discussion = await Discussion.findOne({ _id: discussionId, clubAssocie: club._id });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion non trouvée dans le club de lecture' });
    }

    // Ajouter le membre à la discussion
    discussion.membre = req.body.membre;
    await discussion.save();

    res.json({ message: 'Membre ajouté avec succès à la discussion', discussion });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre à la discussion :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'ajout du membre à la discussion' });
  }
};

// Fonction pour ajouter un like à une discussion
const ajouterLikeDiscussion = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const discussionId = req.params.discussionId;

    const club = await ClubDeLecture.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: 'Club de lecture non trouvé' });
    }

    const discussion = await Discussion.findOne({ _id: discussionId, clubAssocie: club._id });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion non trouvée dans le club de lecture' });
    }

    discussion.likes++;
    await discussion.save();

    res.json({ message: 'Like ajouté avec succès', discussion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction pour ajouter un dislike à une discussion
const ajouterDislikeDiscussion = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const discussionId = req.params.discussionId;

    const club = await ClubDeLecture.findById(clubId);

    if (!club) {
      return res.status(404).json({ error: 'Club de lecture non trouvé' });
    }

    const discussion = await Discussion.findOne({ _id: discussionId, clubAssocie: club._id });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion non trouvée dans le club de lecture' });
    }

    discussion.dislikes++;
    await discussion.save();

    res.json({ message: 'Dislike ajouté avec succès', discussion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






module.exports = {
    ajouterCludLecture,
    afficherClubs,
    afficherOneClub,
    modifierClub,
    supprimerClub,
    ajouterMembreClub,
    ajouterLivreClub,
    afficherLivresLus,
    supprimerMembreClub,
    findAndSortClub,
    ajouterDiscussionClub,
    ajouterReponseDiscussion,
    ajouterMembreDiscussion,
    ajouterLikeDiscussion,
    ajouterDislikeDiscussion
}