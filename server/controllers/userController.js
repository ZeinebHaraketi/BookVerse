const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// const faceapi = require('face-api.js');
// const canvas = require('canvas');




require("dotenv").config();


const User = require('../models/users');
const Librairie = require('../models/librairie');
const Livre = require('../models/livre');
const Club = require('../models/clubDeLecture'); 




const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Panier = require('../models/panier');



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
  


//---------------------------------------- Login ----------------------------------------------//

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Vérification si l'utilisateur existe
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
      }
  
      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Identifiants invalides.' });
      }
  
      // Génération du jeton d'authentification
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
      const role = user.role; // Assuming the role is stored in the 'role' field of the user document

      // Réponse avec le jeton d'authentification
      res.json({ token,  userId: user._id, role});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
    }
};
  
  
  //----------------------------------- Register ---------------------------------------------------//
 

//------------------------------- Verify Mail + Code Verif automatique ---------------------------------------------------------//
const generateVerificationCode = () => {
  const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  return verificationCode;
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL_MAIL,
      pass: process.env.USER_GMAIL_PWD,
    },
    html: {
        path: path.join(__dirname, 'Bookverse.png'),
        cid: 'logo',
      },
  });

  
  const register = async (req, res) => {
  
      const { nom, prenom, email, password } = req.body;
      const role = req.query.role;

  
      try {
        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre utilisateur.' });
        }
  
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();

         // Télécharger l'image sur Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
        // Création du nouvel utilisateur
        const newUser = new User({
          nom,
          prenom,
          email,
          role,
          password: hashedPassword,
          avatar: result.secure_url // Stockez l'URL sécurisée de l'image de Cloudinary dans le champ 'image' du livre

          // avatar: req.file ? req.file.filename : undefined,
          // role,
          // verificationCode,
          // Autres champs du schéma...
        });
  
        // Sauvegarde de l'utilisateur dans la base de données
        await newUser.save();

        if (newUser.save()) {
          res.status(200).json(newUser);
        }
  
        // Envoi de l'e-mail de vérification
        const mailOptions = {
          from: process.env.USER_GMAIL_MAIL,
          to: email,
          subject: 'Vérification de votre adresse e-mail',
          html: `
            <h1>Vérification de votre adresse e-mail</h1>
            <img src="cid:logo" alt="Logo de l'application"  style="max-width: 100px;" />
          `,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Une erreur est survenue lors de l\'envoi de l\'e-mail de vérification.' });
          }
          console.log('E-mail de vérification envoyé : ' + info.response);
          res.json({ message: 'L\'utilisateur a été enregistré avec succès. Veuillez vérifier votre adresse e-mail.' });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur.' });
      }
    ;
  };


//---------------------------------------- Reset Password + Mail ---------------------------------------------//
const sendRestPasswordMail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_GMAIL_MAIL,
        pass: process.env.USER_GMAIL_PWD
      }
    });
    const mailOptions = {
      from: process.env.USER_GMAIL_MAIL,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; line-height: 1.5; text-align: center; background-image: url('https://wallpapercave.com/w/wp2220623.jpg'); background-repeat: no-repeat; background-size: cover; background-position: center; padding: 50px;">
          <h2 style="margin-top: 50px; margin-bottom: 30px; color: navy; font-size: 28px;">Password Reset</h2>
          <p style="margin-bottom: 30px; color: navy; font-size: 20px;">To reset your password, please click the button below:</p>   
          <div style="text-align: center; width: 100%;">
            <a href="http://localhost:3000/resetPassword/${token}" style="display: inline-block; background-color: navy; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 20px; font-weight: bold; cursor: pointer; margin-bottom: 50px;">
              Change Password
            </a>
          </div>
        </div>     
      `
    };  
           
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent:- ", info.response);
      }
    })

  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}


const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const randomString = generateRandomString(20); // Generate a random string of 20 characters
      const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
      sendRestPasswordMail(user.email, randomString);
      res.status(200).send({ success: true, msg: "Please check your inbox of mail and reset your password." });
    } else {
      res.status(400).send({ success: true, msg: "This email does not exist." });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message })
  }
};

  
const reset_password = async (req, res) => {
  const saltRounds = 10;
  try {
    const token = req.params.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      const password = req.body.password;
      const hashedPassword = tokenData.password; // Get the hashed password from the tokenData object

      const passwordMatches = await bcrypt.compare(password, hashedPassword); // Compare the entered password with the hashed password

      if (passwordMatches) {
        res.status(400).json({ success: false, msg: "New password must be different from old password." });
      } else {
        const newPassword = await bcrypt.hash(password, saltRounds); // Hash the new password

        const userData = await User.findByIdAndUpdate(
          { _id: tokenData._id },
          { $set: { password: newPassword, token: '' } },
          { new: true }
        );
        res.status(200).json({ success: true, msg: "User password has been reset" });
        console.log(userData);
      }
    } else {
      res.status(200).json({ success: true, msg: "This link has expired." });
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
}
  
//-------------------------------- Logout -------------------------------------------------//
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Vous avez été déconnecté avec succès.' });
};

//-------------------------------- Profile -------------------------------------------------//

// Middleware to verify JWT token and extract user ID
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Authorization token not found.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Save the decoded user ID to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authorization token.' });
  }
};




// Update the user profile information
const updateProfile = async (req, res) => {
  try {
    const { prenom, nom, email, interets, niveau } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { prenom, nom, email, interets, niveau },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile.' });
  }
};


//------------------------------------- Afficher Livre Lus par le User -------------------------------------------//

const getUserReadBooks = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by their ID and populate the 'librairie' field
    const user = await User.findById(userId).populate({ path: 'librairie', populate: { path: 'livres'} });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the 'librairie' field is populated
    if (!user.librairie) {
      return res.status(400).json({ message: "User's library is empty" });
    }

    const libraryBooks = user.librairie[0].livres; // Assuming you're accessing the first librairie

    // Populate the 'livres' array to get the book documents
    const populatedLibraryBooks = await Livre.find({ _id: { $in: libraryBooks } });

    res.status(200).json(populatedLibraryBooks);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};



const addBookToLibrary = async (req, res) => {
  const { userId } = req.params;
  const { livreId } = req.body;

  try {
    const user = await User.findById(userId).populate('librairie');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'membre') {
      return res.status(400).json({ message: 'Cannot add book to non-member user' });
    }

    if (user.librairie.length === 0) {
      return res.status(404).json({ message: 'User does not have a default library' });
    }

    const librairie = user.librairie[0]; // Get the default library

    // Add the livreId to the library's livres array
    librairie.livres.push(livreId);
    await librairie.save();

    res.status(200).json({ message: 'Book added to library successfully' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};


const LectureAuth = async (req, res) => {
  const livreId = req.params.id;

  try {
    const userId = req.user.id; // L'ID de l'utilisateur authentifié depuis le middleware d'authentification

    // Vérifiez si l'utilisateur a le livre dans sa librairie
    const user = await User.findById(userId);
    const librairie = await Librairie.findOne({ user: userId, livres: livreId });

    if (!librairie) {
      return res.status(403).json({ message: "Vous n'avez pas accès à ce livre." });
    }

    // Si l'utilisateur est autorisé à lire le livre, renvoyez une réponse réussie
    res.status(200).json({ message: 'Vous pouvez lire le livre maintenant.' });
  } catch (error) {
    console.error('Error reading book:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la lecture du livre.' });
  }
}

//------------------------ Club de Lecture --------------------------------------//
const AjoutClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const createdBy = req.params.id; // Use the user ID from req.params

    // Create a new club in the ClubDeLecture collection
    const club = new Club({
      name,
      description,
      createdBy,
      membres: [createdBy], // Add the createdBy user as a member
    });

    const savedClub = await club.save();

    // Update user's clubLecture field with the new club's ID
    await User.findByIdAndUpdate(createdBy, { $push: { clubLecture: savedClub._id } });

    console.log(createdBy);
    res.status(201).json(savedClub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getUserClubs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('clubLecture');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.clubLecture) {
      return res.status(200).json([]); // Return an empty array if the user has no clubs
    }

    const userClubs = user.clubLecture.map((club) => ({
      name: club.name,
      description: club.description
    }));

    res.status(200).json(userClubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addMembersByInterests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const clubId = req.params.clubId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    // Check if the user is the creator of the club
    if (club.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'You are not the creator of this club' });
    }

    // Find users with shared interests and add them as members
    const sharedInterestUsers = await User.find({ interets: { $in: user.interets } });

    sharedInterestUsers.forEach(async (sharedUser) => {
      if (!club.membres.includes(sharedUser._id.toString())) {
        club.membres.push(sharedUser._id);
        await club.save();
      }
    });

    res.status(200).json({ message: 'Members with shared interests added to the club' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//------------------------- Panier ---------------------------------//
const addDefaultCartToUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from req.params
    console.log('User ID:', userId); // Log the user ID
    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Create an empty default shopping cart
    const defaultCart = new Panier({
      user: user._id,
    });

    await defaultCart.save();

    // Update user's defaultCart field
    user.defaultCart = defaultCart._id;
    await user.save();

    res.status(201).json({ message: 'cart added to user', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getCartByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('defaultCart'); // Populate the defaultCart field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.defaultCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------------- Produit ----------------------------------------------//
// const addProductToCart = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const productId = req.body.productId; // Assuming you send the product ID in the request body

//     // Find the user by ID
//     const user = await User.findById(userId).populate('defaultCart');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Add the product ID to the user's cart
//     user.defaultCart.produits.push(productId);
//     await user.save();

//     res.status(201).json({ message: 'Product added to cart', user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const addProductToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Find the user by ID and populate the defaultCart field
    const user = await User.findById(userId).populate('defaultCart');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user's defaultCart is populated
    if (!user.defaultCart) {
      // Create a new Panier instance and add the product's ID
      const newCart = new Panier({
        user: user._id,
        produits: [productId],
      });

      await newCart.save();

      // Update the user's defaultCart field
      user.defaultCart = newCart;
      await user.save();
    } else {
      // Add the product's ID to the existing cart
      user.defaultCart.produits.push(productId);
      await user.defaultCart.save();
    }

    res.status(201).json({ message: 'Product added to cart', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};










const getUserCartProducts = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and populate the defaultCart field
    const user = await User.findById(userId).populate({
      path: 'defaultCart',
      populate: {
        path: 'produits',
        model: 'ProduitDerive',
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.defaultCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartProducts = user.defaultCart.produits.map((produit) => ({
      _id: produit._id,
      nom: produit.nom,
      description: produit.description,
      prix: produit.prix,
      qte: produit.qte,
      imageP: produit.imageP,
      categorie: produit.categorie,
    }));

    res.status(200).json(cartProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//-------------------- Face Detector -------------------------------------------//
// const FaceDetectorAuth = async (email, avatar) => {
//   // Chargement des modèles
//   await faceapi.nets.ssdMobilenetv1.loadFromDisk('../models');
//   await faceapi.nets.faceRecognitionNet.loadFromDisk('../models');

//   // Recherche de l'utilisateur par email
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error('Utilisateur introuvable');
//   }

//   // Chargement de l'image d'authentification
//   const authImage = await canvas.loadImage(avatar);
//   const authDetection = await faceapi.detectSingleFace(authImage).withFaceLandmarks().withFaceDescriptor();

//   // Comparaison des caractéristiques du visage
//   const isMatch = faceapi.euclideanDistance(authDetection.descriptor, user.faceDescriptor) < 0.5;

//   return isMatch;
// };
  
  
  
  module.exports = { 
    login, 
    register, 
    forgetPassword,  
    reset_password, 
    logout, 
    authMiddleware, 
    updateProfile,
    getUserReadBooks,
    addBookToLibrary,
    LectureAuth,
    AjoutClub,
    getUserClubs,
    addMembersByInterests,
    addDefaultCartToUser,
    getCartByUserId,
    addProductToCart,
    getUserCartProducts
  };
  
