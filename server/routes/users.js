var express = require('express');
const { register,login, logout, forgetPassword, reset_password, FaceDetectorAuth, authMiddleware, updateProfile, getUserReadBooks, addBookToLibrary, LectureAuth, AjoutClub, getUserClubs, addMembersByInterests, addDefaultCartToUser, getCartByUserId, addProductToCart, getUserCartProducts } = require('../controllers/userController');
var router = express.Router();
const http = require('http');


const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/users');
const Livre = require('../models/livre');
const Event = require('../models/event');




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
// router.post('/register',upload.single('avatar'), register);
router.post('/register',upload.single('avatar'), register);

router.post('/login',login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', reset_password);
router.get('/logout', logout);

router.get("/login", async (req, res) => {
  res.status(200).json({ Message: "bonjour" });
});

// Route to fetch read books for a user
router.get('/ReadBooks/:userId', getUserReadBooks);
router.post('/user/addBookToLibrary/:userId', addBookToLibrary);

//ALL books
router.get("/books", authMiddleware, async (req, res) => {
  try {
    const books = await Livre.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Display Critiques
router.get('/librairieCritique/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('critiques');
    res.status(200).json(user.critiques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Ca marche
router.get('/librairie/:userId/critiques/:livreId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const livreId = req.params.livreId;

    const user = await User.findById(userId).populate({
      path: 'librairie',
      populate: {
        path: 'livres',
        populate: {
          path: 'critiques',
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let critiques = [];

    user.librairie.forEach((librairieItem) => {
      librairieItem.livres.forEach((livre) => {
        if (livre._id.toString() === livreId) {
          critiques = livre.critiques;
        }
      });
    });

    res.status(200).json(critiques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Club de Lecture
router.post('/addClub/:id', AjoutClub);
router.get('/getClubs/:userId', getUserClubs);
router.post('/addMembersByInterests/:clubId/:userId', addMembersByInterests);


//Panier
router.post('/addDefaultCart/:id', addDefaultCartToUser);
router.get('/getCart/:id', getCartByUserId);

//Produits
// router.post('/addProductToCart/:userId/', addProductToCart);
router.post('/addProductToCart/:userId/:productId', addProductToCart);
router.get('/getUserCartProducts/:userId', getUserCartProducts);


//Payment
router.post('/payment', async (req, res) => {
  try {
    const flouciApiKey = process.env.FLOUCI_API_KEY;
    const flouciApiSecret = process.env.FLOUCI_API_SECRET;

    // Payment data from the request body
    const paymentData = {
      amount: req.body.amount,
      description: req.body.description,
      // Add any other required parameters
    };

    // Convert payment data to JSON
    const postData = JSON.stringify(paymentData);

    // Create options for the HTTP request
    const options = {
      hostname: 'api.flouci.com',
      path: '/v1/payments',
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${flouciApiKey}:${flouciApiSecret}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    };

    // Send the HTTP request
    const request = http.request(options, (response) => {
      let data = '';

      // Collect response data
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Handle the response when it's complete
      response.on('end', () => {
        const paymentResponse = JSON.parse(data);
        console.log('Payment response:', paymentResponse);

        // Send the payment response back to the client
        res.json(paymentResponse);
      });
    });

    // Handle errors in the HTTP request
    request.on('error', (error) => {
      console.error('Error making payment:', error);
      res.status(500).json({ error: 'Payment failed' });
    });

    // Send the POST data
    request.write(postData);
    request.end();
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

//Event
router.get("/event", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

router.post('/lecture/:id', authMiddleware, LectureAuth);

// Update the user profile information
// router.put('/mod/profile', authMiddleware, updateProfile);
router.put('/mod/profile/:id', updateProfile);

module.exports = router;
