var express = require('express');
const { ajouterChapitre, afficherChapitres, afficherOneChapitre, modifierChapitre, supprimerChapitre, ajouterChapitreLivre } = require('../controllers/chapitreController');
var router = express.Router();

router.post('/add', ajouterChapitre);
router.get('/', afficherChapitres);
router.get('/:id', afficherOneChapitre);
router.put('/mod/:id', modifierChapitre);
router.delete('/del/:id', supprimerChapitre);












module.exports = router;
