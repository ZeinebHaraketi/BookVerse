var express = require('express');
const { ajouterCludLecture, afficherClubs, afficherOneClub, modifierClub, supprimerClub, ajouterMembreClub, ajouterLivreClub, supprimerMembreClub, findAndSortClub, afficherLivresLus, ajouterReponseDiscussion, ajouterDiscussionClub, ajouterLikeDiscussion, ajouterDislikeDiscussion } = require('../controllers/clubController');
var router = express.Router();


router.post('/add', ajouterCludLecture);
router.post('/add/:id/membres', ajouterMembreClub);
router.post('/add/:id/livres', ajouterLivreClub);


router.get('/', afficherClubs);
router.get('/:id', afficherOneClub);
router.get('/findClub', findAndSortClub);

router.put('/mod/:id', modifierClub);
router.delete('/del/:id', supprimerClub);
router.delete('/del/:id/membres/:memberId', supprimerMembreClub);

router.get('/aff/:clubDeLectureId/livres-lus', afficherLivresLus);

//Discussion
//CA MARCHE PAS
router.post('/:clubDeLectureId/discussions/:discussionId/membres/:membreId/reponses', ajouterReponseDiscussion);
router.post('/:clubId/discussions/:userId', ajouterDiscussionClub);
router.post('/:clubId/discussions/:discussionId/like', ajouterLikeDiscussion);
router.post('/:clubId/discussions/:discussionId/dislike', ajouterDislikeDiscussion);







module.exports = router;
