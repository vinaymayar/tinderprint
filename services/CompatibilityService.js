/**
 * CompatibilityService.js
 */

var express = require('express')
var mongoose = require('mongoose-q')();
var utils = require('../utils/utils');

var CompatibilityService = {
  /**
   * Calculates fingerprint compatibility between two people.
   */
  getCompatibility(user1, user2) {
    var data1 = user1.fingerprintData;
    var data2 = user2.fingerprintData;
    return data1.reduce(function(acc, x, idx) {
      var y = data2[idx];
      acc = acc + x * y;
    }, 0);
  }
}

module.exports = CompatibilityService;
