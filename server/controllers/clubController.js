const ClubDeLecture = require("../models/clubDeLecture"); // Assurez-vous d'avoir importé votre modèle Mongoose


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
  
  
  

module.exports = {
    ajouterCludLecture,
    afficherClubs,
    afficherOneClub,
    modifierClub,
    supprimerClub,
    ajouterMembreClub,
    ajouterLivreClub,
    supprimerMembreClub,
    findAndSortClub
}