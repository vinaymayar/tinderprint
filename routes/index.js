var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

// utils functions
var utils = require('../utils/utils');

router.get('/', function(req, res) {
  return res.render('index', {
    loggedIn: req.user ? true : false
  });
});

router.get('/candidates', function(req, res) {
  return res.render('candidates', {
    loggedIn: req.user ? true : false
  });
});

router.get('/signup', function(req, res) {
  return res.render('signup', {
    loggedIn: req.user ? true : false
  });
});

module.exports = router;
