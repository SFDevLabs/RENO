'use strict';

/**
 * Module dependencies.
 */

const utils = require('../../lib/utils');

/**
 * Load comment
 */

exports.load = function (req, res, next, id) {
  const article = req.article;
  utils.findByParam(article.comments, { id: id }, function (err, comment) {
    if (err) return next(err);
    req.comment = comment;
    next();
  });
};

/**
 * Create comment
 */

exports.create = function (req, res) {
  const article = req.article;
  const user = req.user;
  if (!req.body.body) return res.redirect('/articles/'+ article.id);

  article.addComment(user, req.body, function (err) {
    if (err) return res.render('500');
    res.redirect('/articles/'+ article.id);
  });
};

/**
 * Delete comment
 */

exports.destroy = function (req, res) {
  const article = req.article;
  article.removeComment(req.params.commentId, function (err) {
    if (err) {
      req.flash('error', 'Oops! The comment was not found');
    } else {
      req.flash('info', 'Removed comment');
    }
    res.redirect('/articles/' + article.id);
  });
};
