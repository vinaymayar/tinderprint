/**
 * CandidatesController.js
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
var CompatibilityService = require('../services/CompatibilityService');

var User = mongoose.model('User');

var CandidatesController = {
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
        // calculate age
        var today = new Date();
        var age = today.getFullYear() - candidate.birthday.getFullYear();
        var m = today.getMonth() - candidate.birthday.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < candidate.birthday.getDate())) {
            age--;
        }
        candidate.age = age;

        return res.render('candidates', {
          loggedIn: req.user ? true : false,
          candidate: candidate,
          compatibility: compatibility
        });
      } else {
        return res.render('noCandidates');
      }
    });
  }

}

module.exports = CandidatesController;
