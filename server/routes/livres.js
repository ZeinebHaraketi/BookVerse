var express = require('express');
const { getLivres, ajoutLivre, getLivre, modifierLivre, supprimerLivre } = require('../controllers/livreController');
var router = express.Router();

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



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
router.get('/', getLivres);
router.post('/add',upload.single('image'),ajoutLivre);
router.get('/:id', getLivre);
router.put('/mod/:id',upload.single('image') ,modifierLivre);
router.delete('/del/:id', supprimerLivre);

module.exports = router;
