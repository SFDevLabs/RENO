'use strict';

/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

const users = require('../app/controllers/users');
const articles = require('../app/controllers/articles');
const comments = require('../app/controllers/comments');
const tags = require('../app/controllers/tags');

const mongoose = require('mongoose')
const Article = mongoose.model('Article');
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
  app.get('/users/:userId', users.show);
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

  app.param('userId', users.load);

  // article routes
  app.param('id', articles.load);
  app.get('/articles', articles.indexOld);
  app.get('/articles/new', auth.requiresLogin, articles.new);
  app.post('/articles', auth.requiresLogin , articles.create);
  app.get('/articles/:id', articles.show);
  app.get('/articles/:id/edit', articleAuth, articles.edit);
  app.put('/articles/:id', articleAuth, articles.update);
  app.delete('/articles/:id', articleAuth, articles.destroy);

  // home route
  app.get('/', articles.index);

  // API Routes
  const path = '/api/articles'
  const pathWithId = path + '/:id';

  app.get(path, articleCrud.getListController);
  app.post(path, auth.requiresLogin, articleCrud.getCreateController);

  app.post(pathWithId+'/comments', auth.requiresLogin, articleCrud.getCreateCommentController);
  app.delete(pathWithId+'/comments/:commentId', auth.requiresLogin, articleCrud.getDeleteCommentController);

  app.get(pathWithId, articleCrud.getReadController);
  app.put(pathWithId, articleAuth, articleCrud.getUpdateController);
  app.delete(pathWithId, articleAuth, articleCrud.getDeleteController); 


  // comment routes
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);

  // app.get('/test', function(req, res){

  //   var article = new Article({
  //     title:1,
  //     body:2
  //   });

  //   article.uploadAndSave(['/Users/jeffjenkins/repos/reno/img/Ok-icon.png'], function (err) {
  //     // if (!err) {
  //     //   req.flash('success', 'Successfully created article!');
  //     //   return res.redirect('/articles/'+article._id);
  //     // }
  //     // res.status(422)
  //     // res.render('articles/new', {
  //     //   title: 'New Article',
  //     //   article: article,
  //     //   errors: utils.errors(err.errors || err)
  //     // });
  //     res.send()
  //   });
  // });




  // API User
  const userPath = '/api/users'
  const userPathWithId = userPath + '/:userId';
  const profilePath = userPath + '/profile';

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
    res.status(500).send({ error: err });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
