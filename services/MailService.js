/**
 * MailService.js
 */

var express = require('express')
var mongoose = require('mongoose-q')();
var utils = require('../utils/utils');

var nodemailer = require("nodemailer");

var MailService = {
  /**
   * Sends an email.
   */
  sendMail: function(res, receiver, subject, body) { 
    var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
        user: "tinderprint75@gmail.com",
        pass: "tinderprint75"
      }
    });

    return smtpTransport.sendMail({
      from: "Tinderprint <tinderprint75@gmail.com>", // sender address
      to: receiver, // comma separated list of receivers
      subject: subject, // Subject line
      text: body // plaintext body
    }, function(error, response){
      smtpTransport.close();

      if (error) {
        return false;
      } else {
        return true;
      }
    });
  }
}

module.exports = MailService;
