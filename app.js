var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('./utils/utils');
var router = express.Router();
var csrf = require('csurf');

var app = express();

//connects and opens the db
var mongoose = require('mongoose');
var connection_string = process.env.MONGOLAB_URI || 'localhost/tinderprint';
if(app.get('env') === 'test') {
  connection_string = 'localhost/tinderprint_test';
} else if(app.get('env') === 'development') {
  connection_string = 'localhost/tinderprint';
}
mongoose.connect(connection_string);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once('open', function callback () {
    //yay!
});

// models
var UserModel = require('./models/UserModel');
var User = mongoose.model('User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'randomsecret8888',
  cookie: { maxAge: 3600000, httpOnly: true }
}));
app.use(passport.initialize());
app.use(passport.session());

/* Middleware to prevent CSRF attacks. */
if(app.get('env') !== 'test') {
  app.use(csrf());

  app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });

  app.use(function(err, req, res, next) {
    if(err.code === 'EBADCSRFTOKEN') {
      err.message = 'Invalid CSRF token. Your session has probably expired.';
      return utils.sendErrResponse(res, 403, err);
    }
    next(err);
  });
}
/* Middleware to sanitize inputs to protect against SQL injection. */
app.use(function(req, res, next) {
  for(var key in req.body) {
    var value = req.body[key];
    if(typeof value === "object") {
      req.body[key] = JSON.stringify(value);
    }
  }
  next();
});

/* Set up passport strategy */
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { 
        return done(err); 
      }
      if (!user) {
        return done(null, false, {message: "Invalid username."});
      }
      if (!user.validPassword(password)) {
        return done(null, false, {message: "Invalid password."});
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// loading routes
var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', users);

if (app.get('env') === 'development') {
  app.set('URL', 'http://localhost:3000');
} else {
  app.set('URL', 'http://tinderprint.herokuapp.com');
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  utils.sendErrResponse(res, err.status || 500, err);
});

module.exports = app;
