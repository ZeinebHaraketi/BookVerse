var express = require('express');
const { register,login, logout, forgetPassword, reset_password, FaceDetectorAuth, authMiddleware } = require('../controllers/userController');
var router = express.Router();

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/users');



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

/* GET users listing. */
router.post('/register',upload.single('avatar'), register);
router.post('/login',login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', reset_password);
router.get('/logout', logout);

// Route to get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
});


// Update user profile
router.put('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedProfile = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updatedProfile, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the user profile.' });
  }
});

// Route d'authentification basée sur la détection du visage
router.post('/auth/face', async (req, res) => {
    const { email, avatar } = req.body;
  
    try {
      const isMatch = await FaceDetectorAuth(email, avatar);
  
      if (isMatch) {
        // Authentification réussie
        res.status(200).json({ message: 'Authentification réussie' });
      } else {
        // Échec de l'authentification
        res.status(401).json({ message: 'Échec de l\'authentification' });
      }
    } catch (err) {
      // Erreur lors de l'authentification
      res.status(500).json({ message: 'Erreur lors de l\'authentification', error: err.message });
    }
});

module.exports = router;
