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
    // Find the user by their ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the read books using the readBooks field in the User model
    const readBooks = await Livre.find({ _id: { $in: user.readBooks } });

    res.status(200).json(readBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//----------------------------- Ajout de Livre à une Librairie -------------------------------//
const addBookToLibrary = async (req, res) => {
  const { userId } = req.params;
  const { livreId } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the bookId to the user's library
    user.librairie.push(livreId);
    await user.save();

    res.status(200).json({ message: 'Book added to library successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    addBookToLibrary
  };
  
