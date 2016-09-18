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

    return 20.0 * data1.reduce(function(acc, x, idx) {
      var y = data2[idx];
      acc = acc + (0.5 - x) * (0.5 - y);
    }, 0);
  },

  /**
   * Calculates fingerprint data for a user.
   * Uses callback.
   * TODO: actually use fingerprint.
   */
  setFingerprintData: function(user, next) {
    //TODO: get user link
    var python = require('child_process').spawn(
      'python',
      ['bin/model.py',
        'fingers/']
    );
    var output = "";
    python.stdout.on('data', function(data) {
      output += data
    });
    python.on('close', function(code) {
      console.log("exited with status code " + code);
      console.log("output was " + output);
      user.fingerprintData = output.split("\n").map(parseFloat);
      console.log("fingerprint data is " + user.fingerprintData);
      return next(user);
    });
  }

}

module.exports = CompatibilityService;
