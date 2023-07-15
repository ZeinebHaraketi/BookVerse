var express = require('express');
const { ajouterPanier, afficherPaniers, afficherOnePanier, modifierPanier, supprimerPanier, ajouterProduitDansPanier, supprimerProduitDuPanier } = require('../controllers/PanierController');
var router = express.Router();


router.post('/add', ajouterPanier);
router.get('/', afficherPaniers);
router.get('/:id', afficherOnePanier);
router.put('/mod/:id', modifierPanier);
router.delete('/del/:id', supprimerPanier);

//Produits
router.post('/ajout/:panierId/produits/:produitId', ajouterProduitDansPanier);
router.delete('/del/:panierId/produits/:produitId', supprimerProduitDuPanier);



module.exports = router;
