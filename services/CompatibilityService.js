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
  getCompatibility: function(user1, user2) {
    var data1 = user1.fingerprintData;
    var data2 = user2.fingerprintData;

    if(data1.length != data2.length) {
      return 0;
    }

    return data1.reduce(function(acc, x, idx) {
      var y = data2[idx];
      acc = acc + x * y;
    }, 0);
  },

  /**
   * Calculates fingerprint data for a user.
   * TODO: actually use fingerprint.
   */
  getFingerprintData: function() {
    var data = [0, 0, 0, 0, 0].map(function(elt) {
      return Math.random() * 100;
    });
  }

}

module.exports = CompatibilityService;
