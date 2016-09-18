var mongoose = require('mongoose');

var utils = {};

/*
  Send a 200 OK with success:true in the request body to the
  response argument provided.
  The caller of this function should return after calling
*/
utils.sendSuccessResponse = function(res, content) {
  res.status(200).json({
    success: true,
    content: content
  }).end();
};

/*
  Send an error code with success:false and error message
  as provided in the arguments to the response argument provided.
  The caller of this function should return after calling
*/
utils.sendErrResponse = function(res, errcode, err) {
  res.status(errcode).json({
    success: false,
    err: err
  }).end();
};


/*
  Middleware that checks whether user is logged in.
*/
utils.auth = function(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return utils.sendNotLoggedInResponse(res);
    //return utils.sendErrResponse(res, 401);
  }
};

utils.sendNotLoggedInResponse = function(res) {
  return res.render('index', {
    loggedIn: false,
    error: { message: 'You must be logged in to view that page.' }
  });
};

/**
 * Creates an error-handling callback.
 * Usage:
 * ...
 * .catch(handleErr(res));
 */
utils.handleErr = function(res) {
  return function(err) {
    var errorCode = err.status || 500;
    utils.sendErrResponse(res, errorCode, err);
  };
}

/**
 * Returns the minimum of two objects.
 */
utils.min = function(x, y) {
  return (x > y) ? y : x;
}

/**
 * Validate that object ID is valid.
 */
utils.validateId = function(req, res, next) {
  if(mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  } else {
    return utils.sendErrResponse(res, 404, {
      status: 404,
      message: "The resource you requested cannot be found."
    });
  }
}

module.exports = utils;
