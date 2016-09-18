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
      birthday: req.body.birthday,
      fingerprintImgPath: 'uploads/' + req.body.username + '-' + 'fingerprint.jpg',
      profileImgPath: 'uploads/' + req.body.username + '-' + 'profile-pic.jpg'
    });

    for(var i = 0; i < req.body.preferences.length; i++) {
      newUser.preferences.push(req.body.preferences[i]);
    }

    //TODO: use fingerprint
    newUser.fingerprintData = CompatibilityService.getFingerprintData();

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
  }

}

module.exports = UsersController;
