const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');



require("dotenv").config();


const User = require('../models/users');


//------------------------------- Upload Avatar --------------------------------------------//
// Configuration de Multer pour l'upload d'avatar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'avatars'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, 'avatar_' + uniqueSuffix + fileExtension);
    }
  });
  
  // Middleware d'upload d'avatar
  const upload = multer({ storage: storage }).single('avatar');
  

//---------------------------------------- Login ----------------------------------------------//

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Vérification si l'utilisateur existe
      const user = await User.findOne({ email });
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
  
      // Réponse avec le jeton d'authentification
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
    }
  };
  
  
  //----------------------------------- Register ---------------------------------------------------//
  // Fonction d'enregistrement d'utilisateur
 // Fonction d'enregistrement d'utilisateur
// const register = async (req, res) => {
//     upload(req, res, async function (err) {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Une erreur est survenue lors de l\'upload de l\'avatar.' });
//       }
  
//       const { nom, prenom, email, password } = req.body;
  
//       try {
//         // Vérification si l'utilisateur existe déjà
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//           return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre utilisateur.' });
//         }
  
//         // Hachage du mot de passe
//         const hashedPassword = await bcrypt.hash(password, 10);
  
//         // Création du nouvel utilisateur
//         const newUser = new User({
//           nom,
//           prenom,
//           email,
//           password: hashedPassword,
//           avatar: req.file ? req.file.filename : undefined,
//           // Autres champs du schéma...
//         });
  
//         // Sauvegarde de l'utilisateur dans la base de données
//         await newUser.save();
  
//         res.json({ message: 'L\'utilisateur a été enregistré avec succès.' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur.' });
//       }
//     });
// };


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
    upload(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de l\'upload de l\'avatar.' });
      }
  
      const { nom, prenom, email, password } = req.body;
  
      try {
        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre utilisateur.' });
        }
  
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();

  
        // Création du nouvel utilisateur
        const newUser = new User({
          nom,
          prenom,
          email,
          password: hashedPassword,
          verificationCode,
          avatar: req.file ? req.file.filename : undefined,
          // Autres champs du schéma...
        });
  
        // Sauvegarde de l'utilisateur dans la base de données
        await newUser.save();
  
        // Envoi de l'e-mail de vérification
        const mailOptions = {
          from: process.env.USER_GMAIL_MAIL,
          to: email,
          subject: 'Vérification de votre adresse e-mail',
          html: `
            <h1>Vérification de votre adresse e-mail</h1>
            <p>Votre code de vérification est :</p>
            <h2>${verificationCode}</h2>
            <img src="cid:logo" alt="Logo de l'application"  style="max-width: 100px;">
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
    });
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
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; line-height: 1.5; text-align: center; background-image: url('https://wallpapercave.com/wp/wp8002975.jpg'); background-repeat: no-repeat; background-size: cover; background-position: center; padding: 50px;">
          <h2 style="margin-top: 50px; margin-bottom: 30px; color: navy; font-size: 28px;">Password Reset</h2>
          <p style="margin-bottom: 30px; color: navy; font-size: 20px;">To reset your password, please click the button below:</p>   
          <div style="text-align: center; width: 100%;">
            <a href="http://localhost:5000/reset-password/${token}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 20px; font-weight: bold; cursor: pointer; margin-bottom: 50px;">
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

 
const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const randomString = randomstring.generate();
      const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
      sendRestPasswordMail(user.email, randomString);
      res.status(200).send({ success: true, msg: "Please check your inbox of mail and reset your password." });
    } else {
      res.status(400).send({ success: true, msg: "this email does not exists" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message })
  }
}  
  
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

  

  
  
  
  module.exports = { login, register, forgetPassword,  reset_password, logout };
  
