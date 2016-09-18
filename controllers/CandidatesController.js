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
var MailService = require('../services/MailService');

var User = mongoose.model('User');

var CandidatesController = {
  /* Get a new candidate. */
  newCandidate: function(req, res) {
    return User.findByIdQ(req.user._id)
    .then(function(user) {
      return User.find({'_id': {'$ne': user._id, '$nin': user.swipeLeft.concat(user.swipeRight)}})
      .where('gender').in(user.preferences)
      .limit(1)
      .execQ()
    }).then(function(users) {
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
          compatibility: compatibility,
          fingerprint: candidate.fingerprintImgPath,
          profile: candidate.profileImgPath,
        });
      } else {
        return res.render('noCandidates', {
          loggedIn: req.user ? true : false
        });
      }
    });
  },

  /* Swipe left on a candidate. */
  swipeLeft: function(req, res) {
    console.log(req.user._id + " is swiping left on " + req.body.candidate);
    return User.findByIdQ(req.user._id)
    .then(function(user) {
      user.swipeLeft.push(req.body.candidate)
      return user.saveQ();
    }).then(function(user) {
      return utils.sendSuccessResponse(res, null);
    }).catch(function(err) {
      return utils.sendErrResponse(res, 500, err);
    });
  },

  swipeRight: function(req, res) {
    console.log(req.user._id + " is swiping right on " + req.body.candidate);
    return User.findByIdQ(req.user._id)
    .then(function(user) {
      user.swipeRight.push(req.body.candidate)
      return [user.saveQ(), User.findByIdQ(req.body.candidate)];
    }).spread(function(user, candidate) {
      if(candidate.swipeRight.indexOf(req.user._id) > -1) {
        user.matches.push(candidate._id);
        candidate.matches.push(user._id);
        MailService.sendMatchEmail(res, user, candidate);
        return [user.saveQ(), candidate.saveQ(), true];
      } else {
        return [false, false, false];
      }
    }).spread(function(user, candidate, match) {
      return utils.sendSuccessResponse(res, {
        match: match
      });
    }).catch(function(err) {
      console.log(err);
      return utils.sendErrResponse(res, 500, err);
    });
  }
}

module.exports = CandidatesController;
