var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('./utils/utils');
var passport = require('passport');
var uuid = require('node-uuid');
var MailService = require('./services/MailService');
var SessionsController = require('./controllers/SessionsController');
var UsersController = require('./controllers/UsersController');
var CandidatesController = require('./controllers/CandidatesController');

// use multer for file upload
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, './public/uploads');
  },
  filename: function (req, file, next) {
    var fileName = req.body.username + '-' + file.fieldname + ".jpg";
    next(null, fileName);
  }
})

var upload = multer({ storage: storage });

var User = mongoose.model('User');

router.get('/', function(req, res) {
  return res.render('index', {
    loggedIn: req.user ? true : false,
    error: false
  });
});

router.get('/signup', function(req, res) {
  return res.render('signup', {
    loggedIn: req.user ? true : false,
    username: req.query.username || "",
    error: false
  });
});

/**
 * Sign up a new user.
 * POST /users
 * Request body:
 *   - username: String, the user's name.
 *   - password: String, the user's password.
 *   - email: String, the user's email.
 * Response is a webpage.
 */
router.post('/users', upload.fields([
    { name: 'profile-pic', maxCount: 1 },
    { name: 'fingerprint', maxCount: 1 }
  ]), function(req, res) {
  return UsersController.signup(req, res);
});

/**
 * Login as an existing user. Fails of user doesn't exist or isn't verified.
 * POST /users/login
 * Request body:
 *   - username: String, the user's name.
 *   - password: String, the user's password.
 * Response:
 *   - success: true if the server succeeded in signing in.
 *   - content: on success, the logged-in user object.
 *   - err: if failure, an error message on database or authentication failure.
 */
router.post('/login', function(req, res, next) {
  return SessionsController.login(req, res, next);
});

/**
 * Logout.
 * GET /users/logout
 * Response:
 *   - success: true if the server succeeded in logging out.
 *   - content: null.
 *   - err: if failure, an error message on database or authentication failure.
 */
router.get('/logout', function(req, res) {
  return SessionsController.logout(req, res);
});

/**
 * Gets the next candidate for the logged in user.
 * Response is a webpage.
 */
router.get('/candidates', utils.auth, function(req, res) {
  return CandidatesController.newCandidate(req, res);
});

/**
 * Swipe left on someone.
 */
router.post('/swipe-left', utils.auth, function(req, res) {
  return CandidatesController.swipeLeft(req, res);
});

/**
 * Swipe right on someone.
 */
router.post('/swipe-right', utils.auth, function(req, res) {
  return CandidatesController.swipeRight(req, res);
});

module.exports = router;
