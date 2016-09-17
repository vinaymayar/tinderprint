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

var User = mongoose.model('User');

var SessionsController = {

  /* Login as an existing user */
  login: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      };
      if (!user) {
        return utils.sendErrResponse(res, 401, info.message);
      };
      req.login(user, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.render('candidates');
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
