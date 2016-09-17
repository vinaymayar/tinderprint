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
      return utils.sendSuccessResponse(res);
    }).catch(function(err) {
      if (err.code && (err.code === 11000 || err.code === 11001)) {
        return utils.sendErrResponse(res, 400, {'message': 'Username or email is already taken.'});
      } else {
        return utils.sendErrResponse(res, 500, err);
      }
    });
  }

}

module.exports = UsersController;
