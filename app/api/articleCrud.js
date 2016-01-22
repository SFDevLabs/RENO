'use strict';

/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const mongoose = require('mongoose')
const Article = mongoose.model('Article');
const _ = require('lodash');
const utils = require('../../lib/utils');

/**
 * Load
 */

exports.load = function (req, res, next, id){
  Article.load(id, function (err, article) {
    if (!article || (err && err.message==='Cast to ObjectId failed')) return  res.status(404).send(utils.errsForApi('Article not found'));
    if (err) return  res.status(500).send( utils.errsForApi(err.errors || err) );
    req.article = article;
    next();
  });
};

/**
 * Load comment
 */

exports.loadComment = function (req, res, next, id) {
  const article = req.article;
  utils.findByParam(article.comments, { id: id }, function (err, comment) {
    if (err) return next(err);
    req.comment = comment;
    next();
  });
};

/**
 * List
 */
exports.getListController = function (req, res) {
  var skip = Number(req.query.skip)
  var count = Number(req.query.count)
  const criteria = req.query.tag?{tags:req.query.tag}:null;
  
  skip =  !isNaN(skip) ? skip : 0;
  count =  !isNaN(count) ? count : 30;
  
  var options = {
    count: count,
    skip: skip,
  };

  if (criteria){
    options.criteria = criteria
  }

  Article.list(options, function (err, result) {
    Article.count(criteria).exec(function (errCount, count) {
      if (!err) {
        res.send({
          articles:result,
          total: count
        });
      } else {
        res.status(500).send(utils.errsForApi(err.errors || err));
      }
    });
  });
};

/**
 * Create
 */
exports.getCreateController = function (req, res) {
  var m = new Article(req.body);
  const images = req.files[0]
    ? [req.files[0].path]
    : [];

  m.user = req.user;
  m.uploadAndSave(images, function (err) {
    if (!err) {
      res.send(m);
    } else {
      res.status(422).send(utils.errsForApi(err.errors || err));
    }
  });
};

/**
 * Load
 */
exports.getReadController = function (req, res) {
  var article = req.article
  if (!article) {
    res.status(404).send(utils.errsForApi('Article not found!!'));
  } else if (article) {
    res.send(article);
  }
};

/**
 * Update
 */
exports.getUpdateController = function (req, res) {
  var article = req.article
  var key;
  for (key in req.body) {
    article[key] = req.body[key];
  }
  const images = req.files[0]
    ? [req.files[0].path]
    : [];
  article.uploadAndSave(images, function (err) {
    if (!err) {
      res.send(article);
    } else {
      res.status(400).send(utils.errsForApi(err.errors || err));
    }
  });
};

/**
 * Delete
 */
exports.getDeleteController = function (req, res) {
  var article = req.article
  if (!article) {
    res.status(500).send(utils.errsForApi('Error loading article.'));
  } else {
    article.remove();
    article.save(function (err) {
      if (!err) {
        res.send(article);
      } else {
        res.status(500).send(utils.errsForApi(err.errors || err));
      }
    });
  }
};

/**
 * Create Comment
 */
exports.getCreateCommentController = function (req, res) {
  const article = req.article
  const user = req.user;

  if (!article) return res.status(500).send( utils.errsForApi('There was an error in your request') );
  if (!req.body.body) return res.status(422).send( utils.errsForApi('Requires a comment body'));

  article.addComment(user, req.body, function (err) {
    if (err) return res.status(500).send(errMsg(err));
    
    var articleObj = article.toObject();//Adding the populated comments from a pure JS object.
    var comments = articleObj.comments;
    comments[comments.length-1].user=_.pick(user, ['username', '_id', 'name']); //For security we only send id and username.
    res.send(articleObj);
  });
}
  

/**
 * Delete Comment
 */
exports.getDeleteCommentController = function (req, res) {
  var article = req.article;
  var commentId = req.params.commentId;
  article.removeComment(commentId, function (err) {
    if (err) {
      res.send(utils.errsForApi('There was an error in your request'));
    }
    res.send(article);
  });
};