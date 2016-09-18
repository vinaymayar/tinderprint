/**
 * users.js
 *
 * Routes for users. Use passport for login authentication.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils');
var passport = require('passport');
var uuid = require('node-uuid');
var MailService = require('../services/MailService');
var SessionsController = require('../controllers/SessionsController');
var UsersController = require('../controllers/UsersController');

var User = mongoose.model('User');

/**
 * Sign up a new user.
 * POST /users
 * Request body:
 *   - username: String, the user's name.
 *   - password: String, the user's password.
 *   - email: String, the user's email.
 * Response is a webpage.
 */
router.post('/', function(req, res) {
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
router.get('/newCandidate', utils.auth, function(req, res) {
  return UsersController.newCandidate(req, res);
});

module.exports = router;
