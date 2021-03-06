/**
 * UserModel.js
 *
 * Model for user.
 */
var mongoose = require('mongoose-q')(require('mongoose'));
var extend = require('mongoose-schema-extend');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
  email: {type: String, required: true, index: {unique: true}},
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  name: {type: String, required: true},
  birthday: {type: Date, required: true},
  bio: {type: String},
  gender: {type: String, enum: ['M', 'F', 'O'], required: true},
  preferences: [
    {type: String}
    ],
  swipeLeft: [
    {type: Schema.ObjectId, ref: "User"}
  ],
  swipeRight: [
    {type: Schema.ObjectId, ref: "User"}
  ],
  matches: [
    {type: Schema.ObjectId, ref: "User"}
  ],
  fingerprintData: [
    {type: Number}
  ],
  fingerprintImgPath: {type: String},
  profileImgPath: {type: String},
});

// Hashes a password
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Returns whether a given string pwd is a user's valid password.
UserSchema.methods.validPassword = function( pwd ) {
    return bcrypt.compareSync(pwd, this.password);
};


var User = mongoose.model('User', UserSchema);

// Matches a regex to a potential username and returns if it's valid
// Usernames are only valid if they're only composed of numbers and letters
var validateUsername = function (username) {
  var letterNumber = /^[0-9a-zA-Z]+$/;
  return letterNumber.test(username);
};

// Returns if an email is in valid email format.
var validateEmail = function (email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Returns if a bio is small enough
var validateBio = function (bio) {
  var maxLength = 140;
  return !bio || bio.length <= maxLength;
}

User.schema.path('username').validate(validateUsername, 'Username can only contain numbers and letters.');
User.schema.path('email').validate(validateEmail, 'Invalid email.');
User.schema.path('bio').validate(validateBio, 'Bio is too long.');

exports.User = User;
