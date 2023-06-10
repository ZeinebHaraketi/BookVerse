var express = require('express');
const { ajouterCludLecture, afficherClubs, afficherOneClub, modifierClub, supprimerClub, ajouterMembreClub, ajouterLivreClub, supprimerMembreClub, findAndSortClub } = require('../controllers/clubController');
var router = express.Router();


router.post('/add', ajouterCludLecture);
router.post('/add/:id/membres', ajouterMembreClub);
router.post('/add/:id/livres', ajouterLivreClub);


router.get('/', afficherClubs);
router.get('/:id', afficherOneClub);
router.get('/findClub', findAndSortClub);

router.put('/mod/:id', modifierClub);
router.delete('/del/:id', supprimerClub);
router.delete('/del/:id/membres/:memberId', supprimerMembreClub);



module.exports = router;
