/**
 * UsersController.js
 *
 * Contains methods for accessing and manipulating user status.
 */

var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
var mongoose = require('mongoose-q')(require('mongoose'));
var utils = require('../utils/utils');
var passport = require('passport');
var uuid = require('node-uuid');
var SessionsController = require('../controllers/SessionsController');
var CompatibilityService = require('../services/CompatibilityService');

var User = mongoose.model('User');

var UsersController = {

  /* Sign up a new user */
  signup: function(req, res) {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      bio: req.body.bio,
      gender: req.body.gender,
      preferences: req.body.preferences,
      birthday: req.body.birthday
    });
    return newUser
    .saveQ()
    .then(function(user) {
      return SessionsController.login(req, res, function(err) {
        return utils.sendNotLoggedInResponse(res);
      });
    }).catch(function(err) {
      var message = 'Unknown server error.';
      if (err.code && (err.code === 11000 || err.code === 11001)) {
        var message = 'Username or email is already taken.';
      }
      return res.render('signup', {
        username: req.query.username || "",
        error: { message: err.message }
      });
    });
  },

  /* Get a new candidate. */
  newCandidate: function(req, res) {
    console.log("HI");
    return User.find()
    .where('gender').in(req.user.preferences)
    .where('_id').ne(req.user._id)
    .where('_id').nin(req.user.swipeLeft)
    .where('_id').nin(req.user.swipeRight)
    .limit(1)
    .execQ()
    .then(function(users) {
      console.log(users.length);
      if(users.length > 0) {
        var candidate = users[0];
        // calculate compatibility
        var compatibility = CompatibilityService.getCompatibility(req.user, candidate);
        return res.render('candidates', {
          candidate: candidate,
          compatibility: compatibility
        });
      } else {
        return res.render('noCandidates');
      }
    });
  }

}

module.exports = UsersController;
