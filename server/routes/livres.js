var express = require('express');
const { getLivres, ajoutLivre, getLivre, modifierLivre, supprimerLivre, rechercheLivres, triLivres, ajouterChapitreLivre, modifierChapitreLivre, supprimerChapitreLivre, ajouterAdaptationLivre, modifierAdaptationLivre, supprimerAdaptationLivre, ajouterCritiqueLivre, modifierCritiqueLivre, supprimerCritiqueLivre, LectureLivre, getChapitresByTitre } = require('../controllers/livreController');
var router = express.Router();

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Livre = require('../models/livre');



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

const upload = multer({ storage: storage });


/* GET livres listing. */
router.get('/aff', getLivres);
router.post('/add',upload.single('image'),ajoutLivre);
router.get('/:id', getLivre);
router.put('/mod/:id',upload.single('image') ,modifierLivre);
router.delete('/del/:id', supprimerLivre);

router.get('/livres/recherche', rechercheLivres);
router.get('/livres/tri', triLivres);

//Chapitres
router.post('/ajout/livres/:livreId/chapitres', ajouterChapitreLivre);
router.put('/livres/:livreId/chapitres/:chapitreId', modifierChapitreLivre);
router.delete('/supp/livres/:livreId/chapitres/:chapitreId', supprimerChapitreLivre);
router.get("/getChapitresByTitre/:id", getChapitresByTitre)
router.get("/:id/chapitres/titre", async (req, res) => {
  const { id } = req.params;

  try {
    const livre = await Livre.findById(id).populate("chapitres");
    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Triez les chapitres par titre
    livre.chapitres.sort((a, b) => a.titre.localeCompare(b.titre));

    res.status(200).json(livre.chapitres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer les chapitres d'un livre spécifique
// router.get('/:livreId/chapitres', async (req, res) => {
//   const { livreId } = req.params;

//   try {
//     const livre = await Livre.findById(livreId);
//     if (!livre) {
//       return res.status(404).json({ message: 'Livre not found' });
//     }

//     const chapitres = livre.chapitres;
//     res.status(200).json(chapitres);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.get('/:livreId/chapitres', async (req, res) => {
  const { livreId } = req.params;

  try {
    const livre = await Livre.findById(livreId).populate('chapitres');
    if (!livre) {
      return res.status(404).json({ message: 'Livre not found' });
    }

    res.status(200).json(livre.chapitres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// router.get("/lire/livreId/chapitres/chapitreId", LectureLivre)
router.get('/lireL/:livreId/chapitres/:chapitreId', LectureLivre);


//Adaptations
router.post('/ajout/livres/:livreId/adaptations', ajouterAdaptationLivre);
//router.put('/upd/livres/:livreId/adaptation/:adaptationId', modifierAdaptationLivre);
// Supprimer une adaptation d'un livre
router.delete('/:livreId/adaptations/:adaptationId', supprimerAdaptationLivre);

//Critiques
router.post('/:livreId/critiques/:userId', ajouterCritiqueLivre); //Ca marche
// router.post('/:userId/critiques', ajouterCritiqueLivre);
router.put('/:livreId/critiques/:userId/:critiqueId', modifierCritiqueLivre);
router.delete('/supp/:livreId/critiques/:userId/:critiqueId', supprimerCritiqueLivre);





module.exports = router;
