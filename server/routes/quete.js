var express = require('express');
const { ajouterQuete, afficherOneQuete, afficherQuetes, modifierQuete, supprimerQuete } = require('../controllers/queteController');
var router = express.Router();



router.post('/add', ajouterQuete);
router.get('/', afficherQuetes);
router.get('/:id', afficherOneQuete);
router.put('/mod/:id', modifierQuete);
router.delete('/del/:id', supprimerQuete);




module.exports = router;
