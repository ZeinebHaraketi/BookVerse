var express = require('express');
const { register,login, logout, forgetPassword, reset_password } = require('../controllers/userController');
var router = express.Router();

/* GET users listing. */
router.post('/register',register);
router.post('/login',login);
router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword/:token', reset_password);
router.get('/logout', logout);


module.exports = router;
