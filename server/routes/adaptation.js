var express = require('express');
const { ajouterAdaptation, afficherAdaptation, afficherOneAdaptation, modifierAdaptation, supprimerAdaptation, ajouterEvenementAdaptation, modifierEvenementAdaptation, supprimerEvenementAdaptation } = require('../controllers/adaptationController');
var router = express.Router();

router.post('/add', ajouterAdaptation);
router.get('/', afficherAdaptation);
router.get('/:id', afficherOneAdaptation);
router.put('/mod/:id', modifierAdaptation);
router.delete('/del/:id', supprimerAdaptation);

//Event
router.post('/:adaptationId/evenements/:organisateurId', ajouterEvenementAdaptation);
router.put('/:adaptationId/evenements/:evenementId', modifierEvenementAdaptation);
router.delete('/eve/:adaptationId/evenements/:evenementId', supprimerEvenementAdaptation);








module.exports = router;
