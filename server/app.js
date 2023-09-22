var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');



//Google
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
//Facebook
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./models/users');

const dotenv = require('dotenv');
dotenv.config();

//DB
const dbURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;


//Les Routes
var usersRouter = require('./routes/users');
const livreRouter = require('./routes/livres');
const eventRouter = require('./routes/event');
const queteRouter = require('./routes/quete');
const clubRouter = require('./routes/club');
const chapitreRouter = require('./routes/chapitre');
const adaptationRouter = require('./routes/adaptation');
const produitsRouter = require('./routes/produits');
const panierRouter = require('./routes/panier');
const googleRouter = require('./routes/google');




var app = express();
app.use(express.static('public'))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization', 'x-auth-token'],
  credentials: true

}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});


//----------------------- Connecting to DB -----------------------------------------------//
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
  console.log('Connected to database');
  app.use('/livre', livreRouter);
  app.use('/event', eventRouter);
  app.use('/quete', queteRouter);
  app.use('/club', clubRouter);
  app.use('/chapitre', chapitreRouter);
  app.use('/adaptation', adaptationRouter);
  app.use('/produit', produitsRouter);
  app.use('/cart', panierRouter);
  app.use('/google', googleRouter);




})
.catch((err) => {
  console.error('Error connecting to database', err);
});

//------------------------------- Google -------------------------------------------//
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: process.env.GOOGLE_CALLBACK_URL
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     // Vérifiez si l'utilisateur existe dans votre base de données en utilisant l'adresse e-mail Google
//     let user = await User.findOne({ email: profile.emails[0].value });

//     if (!user) {
//       // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec les informations du profil Google
//       user = new User({
//         nom: profile.name.familyName,
//         prenom: profile.name.givenName,
//         email: profile.emails[0].value,
//         avatar: profile.photos[0].value,
//         // Vous pouvez ajouter d'autres champs du modèle User si nécessaire
//       });

//       await user.save();
//     }

//     // L'utilisateur est maintenant authentifié et vous pouvez le passer à la fonction "done"
//     done(null, user);
//   } catch (err) {
//     // Gérez les erreurs s'il y en a lors de l'accès à la base de données
//     done(err);
//   }
// }));

// passport.serializeUser((user, done) => {
//   // Sérialiser l'utilisateur en enregistrant son ID dans la session
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     // Désérialiser l'utilisateur en recherchant l'utilisateur dans votre base de données à partir de l'ID
//     const user = await User.findById(id);

//     if (!user) {
//       // Si l'utilisateur n'est pas trouvé dans la base de données, appelez "done(null, null)" pour indiquer une erreur
//       return done(null, null);
//     }

//     // L'utilisateur est trouvé dans la base de données, vous pouvez le passer à la fonction "done"
//     done(null, user);
//   } catch (err) {
//     // Gérez les erreurs s'il y en a lors de l'accès à la base de données
//     done(err);
//   }
// });

// app.use(session({
//   secret: 'bookverse2023',
//   resave: true,
//   saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // Route pour l'authentification avec Google
// // Définir la route pour démarrer le processus d'authentification avec Google
// app.get('/auth/google', passport.authenticate('google', {
//   scope: ['profile', 'email'] // Spécifiez la portée pour accéder au profil et à l'adresse e-mail de l'utilisateur
// }));


// // Callback de l'authentification Google
// app.get('/auth/google/callback',
//   passport.authenticate('google', { 
//     successRedirect: '/welcome', // Rediriger l'utilisateur vers la page de réussite après l'authentification réussie
//     failureRedirect: '/logout' 
//   }),
//   (req, res) => {
//     // Redirection après l'authentification réussie
//     res.redirect('/welcome'); // Remplacez par l'URL de la page que vous souhaitez afficher après l'authentification réussie
//   }
// );

// console.log(passport.authenticate('google', { 
//   successRedirect: '/welcome', // Rediriger l'utilisateur vers la page de réussite après l'authentification réussie
//   failureRedirect: '/logout' 
// }),);

// // Route pour la déconnexion de l'utilisateur
// app.get('/logout', (req, res) => {
//   // Déconnectez l'utilisateur et redirigez-le vers la page d'accueil ou une autre page après la déconnexion
//   req.logout();
//   res.redirect('/');
// });

// // Route pour la page d'accueil
// app.get('/', (req, res) => {
//   res.send('Bienvenue sur la page d\'accueil !');
// });

// // Route pour la page de bienvenue après l'authentification réussie
// app.get('/welcome', (req, res) => {
//   // L'utilisateur est authentifié avec succès, vous pouvez accéder à ses informations via "req.user"
//   console.log(req.user);
//   res.send('Bienvenue ! Vous êtes maintenant connecté.');
// });

//------------------------- Facebook -------------------------------------------------//
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   callbackURL: process.env.FACEBBOK_CALLBACK_URL // URL de redirection après l'authentification Facebook
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     // Vérifiez si l'utilisateur existe dans votre base de données
//     let user = await User.findOne({ email: profile.emails[0].value });

//     if (!user) {
//       // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec les informations de profil Facebook
//       user = new User({
//         nom: profile.displayName.split(' ')[0],
//         prenom: profile.displayName.split(' ')[1],
//         email: profile.emails[0].value,
//         password: '', // Vous pouvez générer un mot de passe aléatoire pour l'utilisateur
//         avatar: '' // Vous pouvez récupérer l'URL de l'avatar Facebook à partir de `profile.photos` si disponible
        
//       });

//       await user.save();
//     }

//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));
// Configuration de la stratégie d'authentification Facebook
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL, // URL de redirection après l'authentification Facebook
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Vérifiez si l'utilisateur existe dans votre base de données
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // Si l'utilisateur n'existe pas, créez un nouvel utilisateur avec les informations de profil Facebook
      user = new User({
        nom: profile.displayName.split(' ')[0],
        prenom: profile.displayName.split(' ')[1],
        email: profile.emails[0].value,
        password: '', // Vous pouvez générer un mot de passe aléatoire pour l'utilisateur
        avatar: '', // Vous pouvez récupérer l'URL de l'avatar Facebook à partir de `profile.photos` si disponible
        
      });

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Configuration de la sérialisation et de la désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// Routes d'authentification
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/login',
  failureRedirect: '/logout'
}));

// Middleware de protection des routes nécessitant une authentification
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
};




//---------------- Server Listening -----------------------------//
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})


