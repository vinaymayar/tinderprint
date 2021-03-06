/**
 * SessionsController.js
 *
 * Contains methods for user login/logout.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils');
var passport = require('passport');
var uuid = require('node-uuid');
var CandidatesController = require('./CandidatesController');

var User = mongoose.model('User');

var SessionsController = {

  /* Login as an existing user */
  login: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      };
      if (!user) {
        return res.render('index', {
          loggedIn: false,
          error: { message: 'The username or password you entered is not correct.' }
        });
      };
      req.login(user, function(err) {
        if (err) {
          return next(err);
        } else {
          return CandidatesController.newCandidate(req, res);
        }
      });
    })(req, res, next);
  },

  /* Logout of account */
  logout: function(req, res) {
    req.logout();
    return utils.sendSuccessResponse(res);
  }
}

module.exports = SessionsController;
