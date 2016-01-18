'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const utils = require('../../lib/utils');

/**
 * Load
 */

exports.load = function (req, res, next, id) {
  const options = {
    criteria: { _id : id }
  };
  User.load(options, function (err, user) {
    if (err && err.name == 'CastError' || !user){ 
      return res.status(404).send( utils.errsForApi('Not Found') )
    } else if (err) {
      return res.status(500).send( utils.errsForApi(err) )
    }
    if (user) req.profile = user;
    next();
  });
};

/**
 * Create user
 */

exports.create = function (req, res) {
  const user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      res.status(422)
      return res.render('users/signup', {
        errors: utils.errors(err.errors || err.message),
        user: user,
        title: 'Sign up'
      });
    }

    // manually login the user once successfully signed up
    req.logIn(user, function (err) {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      return res.redirect('/');
    });
  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  const user = req.profile;
  res.render('users/show', {
    title: user.name,
    user: user
  });
};

exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/';
  delete req.session.returnTo;
  res.redirect('/');
}
