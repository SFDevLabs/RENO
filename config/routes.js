'use strict';

/*!
 * Module dependencies.
 */

const users = require('../app/controllers/users');

const mongoose = require('mongoose')
const articleCrud = require('../app/api/articleCrud');
const userCrud = require('../app/api/userCrud');


const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin);
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      scope: [
        'r_emailaddress'
      ]
    }), users.signin);
  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login'
    }), users.authCallback);


  // home route
  app.get('/', function (req, res) {
    res.render('index',{
      title: 'Home'
    })
  });

  // reset
  app.get('/pwreset', users.pwReset);
  app.post('/pwreset', users.pwResetSubmit);
  app.get('/pwreset/:token', users.pwResetLink);
  app.post('/pwreset/:token', users.pwResetLinkSumbmit);


  // API Routes
  const path = '/api/articles'
  const pathWithId = path + '/:id';

  app.param('id', articleCrud.load);
  app.get(path, articleCrud.getListController);
  app.post(path, auth.requiresLogin, articleCrud.getCreateController);

  app.get(pathWithId, articleCrud.getReadController);
  app.put(pathWithId, articleAuth, articleCrud.getUpdateController);
  app.delete(pathWithId, articleAuth, articleCrud.getDeleteController); 
  
  //API comments
  app.param('commentId', articleCrud.loadComment);  
  app.post(pathWithId+'/comments', auth.requiresLogin, articleCrud.getCreateCommentController);
  app.delete(pathWithId+'/comments/:commentId', commentAuth, articleCrud.getDeleteCommentController);

  // API User
  const userPath = '/api/users'
  const userPathWithId = userPath + '/:userId';
  const profilePath = userPath + '/profile';

  app.param('userId', userCrud.load);
  app.get(profilePath, userCrud.getReadControllerProfile);
  app.get(userPathWithId, userCrud.getReadController);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500',{ 
      error: err.message
    });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });

};
