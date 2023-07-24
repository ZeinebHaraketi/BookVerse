const express = require('express');
const router = express.Router();

const GOOGLE_CLIENT_ID = '310562453662-8fn1de90t9m0uhn0hh4c04hoi5374gqs.apps.googleusercontent.com';

// Middleware pour démarrer le processus d'authentification avec Google
router.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=profile email&access_type=offline`;
  res.redirect(authUrl);
});


router.get('/welcome', (req, res) => {
      // L'utilisateur est authentifié avec succès, vous pouvez accéder à ses informations via "req.user"
      console.log(req.user);
      res.send('Bienvenue ! Vous êtes maintenant connecté.');
});

// Gestion de la réponse de Google après l'authentification
router.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await client.getToken(code);
    const { id_token } = tokenResponse.tokens;
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // Utilisez les informations du profil (payload) pour authentifier l'utilisateur ou le créer dans votre base de données si nécessaire
    // Exemple :
    // const user = findOrCreateUser(payload);
    // res.json(user);

    // Si l'utilisateur est authentifié avec succès, redirigez-le vers une page de bienvenue
    res.redirect('/welcome');
  } catch (error) {
    // Une erreur s'est produite lors de l'authentification, redirigez l'utilisateur vers une page d'échec de connexion
    res.redirect('/logout');
  }
});

module.exports = router;
