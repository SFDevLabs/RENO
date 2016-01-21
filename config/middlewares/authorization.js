'use strict';

const utils = require('../../lib/utils');

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  //if (req.method == 'GET') req.session.returnTo = req.originalUrl;  /maybe we will bring this back.
  res.status(401).send( utils.errsForApi('Requires you to login'))
};

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.status(401).send( utils.errsForApi('You are not authorized'))
    }
    next();
  }
};

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      return res.status(401).send( utils.errsForApi('You are not authorized'))
    }
    next();
  }
};

/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: function (req, res, next) {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next();
    } else {
      res.status(401).send( utils.errsForApi('You are not authorized'))
    }
  }
};
