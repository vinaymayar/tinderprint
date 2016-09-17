var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

// utils functions
var utils = require('../utils/utils');

router.get('/', function(req, res) {
  return res.render('index');
});

module.exports = router;
