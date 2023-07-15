var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
const queteRouter = require('./routes/quete');
const clubRouter = require('./routes/club');
const chapitreRouter = require('./routes/chapitre');
const adaptationRouter = require('./routes/adaptation');
const produitsRouter = require('./routes/produits');
const panierRouter = require('./routes/panier');




var app = express();
app.use(express.static('public'))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
  app.use('/quete', queteRouter);
  app.use('/club', clubRouter);
  app.use('/chapitre', chapitreRouter);
  app.use('/adaptation', adaptationRouter);
  app.use('/produit', produitsRouter);
  app.use('/cart', panierRouter);




})
.catch((err) => {
  console.error('Error connecting to database', err);
});


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


