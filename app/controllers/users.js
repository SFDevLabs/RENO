'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const utils = require('../../lib/utils');

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

/**
 * Reset
 */

exports.pwReset = function (req, res) {
  res.render('users/reset', {
    title: 'Password Reset',
  });
};


/**
 * Post Reset
 */

exports.pwResetSubmit = function (req, res) {
  const email = req.body.email;
  const options = {select:'name username email'};
  if (email){
    options.criteria ={email:email}
    User.load(options, function(err, user){
      if(!user){
        res.render('users/reset', {
          title: 'Password Reset',
          errors: utils.errors('Sorry! We cannot find that email.')
        });
      } else {
        user.resetPassword(function(err){
          console.log(err, 'pwResetSubmit')
          if (err){ 
           res.render('users/reset', {
              title: 'Password Reset',
              errors: utils.errors(err.errors || err.message)
            });
          } else {
            res.render('users/reset', {
              title: 'Password Reset',
              success: utils.errors('Check your email for a password reset link')
            });
          }
        })
      }
    })
  }else{
    res.render('users/reset', {
      errors: utils.errors('Please enter an email.'),
      title: 'Password Reset'
    });
  }
};

/**
 * Reset Link
 */

exports.pwResetLink = function (req, res) {
  const token = req.params.token;
  const options = {select:'name username email resetPasswordExpires'};

  options.criteria ={resetPasswordToken:token}
  
  User.load(options, function(err, user){
    if (!user || user.resetPasswordExpires < new Date() ){
      req.flash('error', 'Link is not valid or expired')
      res.redirect('/pwreset')
    } else{
      res.render('users/resetlink', {
        title: 'Set New Password',
        token: token
      });      
    }

  });

};

/**
 * Post Reset Link
 */

exports.pwResetLinkSumbmit = function (req, res) {
  const password = req.body.password
  const token = req.params.token;

  if (password) {
    const options = {select:'name username email resetPasswordExpires'};
    options.criteria ={resetPasswordToken:token}
    User.load(options, function(err, user){
      if (!user){
        req.flash('error', 'We found an error, please try agian');
        return res.redirect('/pwreset')
      } 
      user.setPassword(password, function(err){
        if (err) {
          req.flash('error', err.message);
          res.redirect('/pwreset')
        }else{
          req.flash('success', 'Your password has been reset')
          res.redirect('/login')
        }
      })
    });
  } else {
    res.render('users/resetlink', {
        title: 'Set New Password',
        token: token,
        errors: utils.errors('Please enter a password')
    });
  }
};