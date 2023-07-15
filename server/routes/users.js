var express = require('express');
const { register,login, logout, forgetPassword, reset_password, FaceDetectorAuth } = require('../controllers/userController');
var router = express.Router();

/* GET users listing. */
router.post('/register',register);
router.post('/login',login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', reset_password);
router.get('/logout', logout);


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
