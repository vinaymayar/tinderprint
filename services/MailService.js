/**
 * MailService.js
 */

var express = require('express')
var mongoose = require('mongoose-q')();
var utils = require('../utils/utils');

var nodemailer = require("nodemailer");

var MailService = {
  sendMatchEmail: function(res, user1, user2) {
    var subject = "New match on Tinderprint";
    var body = user1.name + ", meet " + user2.name + ".\n";
    body += user2.name + ", meet " + user1.name + ".\n\n";
    body += "It's a match!  Having compatible fingerprints isn't enough to find your soulmate. ";
    body += "You have to start a conversation!  Reply to this thread to start talking to each other ";
    body += "and discover if you're really compatible <3.\n\n";
    body += "- Tinderprint team";
    return MailService.sendMail(res, user1.email + ", " + user2.email, subject, body);
  },

  /**
   * Sends an email.
   */
  sendMail: function(res, receiver, subject, body) { 
    var smtpTransport = nodemailer.createTransport('smtps://tinderprint75%40gmail.com:tinderprint76@smtp.gmail.com');
    return smtpTransport.sendMail({
      from: "Tinderprint <tinderprint75@gmail.com>", // sender address
      to: receiver, // comma separated list of receivers
      subject: subject, // Subject line
      text: body // plaintext body
    }, function(error, response){
      smtpTransport.close();
      console.log(error);

      if (error) {
        return false;
      } else {
        return true;
      }
    });
  }
};

module.exports = MailService;
