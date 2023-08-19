var express = require('express');
const { ajouterProduit, afficherProduits, AfficherOneProduit, modifierProduit, supprimerProduit, rechercheProduits } = require('../controllers/ProduitController');
var router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//------------------------------- Upload Image --------------------------------------------//
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


router.post('/add', upload.single('imageP'), ajouterProduit);
router.get('/aff', afficherProduits);
router.get('/:id', AfficherOneProduit);
router.put('/mod/:id', modifierProduit);
router.delete('/del/:id', supprimerProduit);

router.get('/produits/recherche', rechercheProduits);



module.exports = router;
