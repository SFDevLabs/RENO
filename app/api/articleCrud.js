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
          setTimeout(function(){
            res.send({
              articles:result,
              total: count
            });
          },500)
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
      setTimeout(function(){
       res.send(m);
      },500)
    } else {
      res.status(422).send(utils.errsForApi(err.errors || err));
    }
  });
};

/**
 * Load
 */
exports.getReadController = function (req, res) {
  Article.load(req.params.id, function (err, result) {
    if (!result || err && err.name == 'CastError') {
      res.status(404).send(utils.errsForApi('User not found'));
    } else if (result) {
      setTimeout(function(){
        res.send(result);
      },500)
    } else {
      res.status(500).send(utils.errsForApi(err.errors || err));
    }
  });
};

/**
 * Update
 */
exports.getUpdateController = function (req, res) {
  Article.load(req.params.id, function (err, result) {
    var key;
    for (key in req.body) {
      result[key] = req.body[key];
    }
    const images = req.files[0]
      ? [req.files[0].path]
      : [];
    result.uploadAndSave(images, function (err) {
      if (!err) {
        setTimeout(function(){
         res.send(result);
        },500)
      } else {
        res.status(400).send(utils.errsForApi(err.errors || err));
      }
    });
  });
};

/**
 * Delete
 */
exports.getDeleteController = function (req, res) {
  Article.load(req.params.id, function (err, result) {
    if (err) {
      res.send(utils.errsForApi(err.errors || err));
    } else {
      result.remove();
      result.save(function (err) {
        if (!err) {
        setTimeout(function(){
          res.send(result);
        },500)
        } else {
          res.status(500).send(utils.errsForApi(err.errors || err));
        }
      });
    }
  });
};

/**
 * Create Comment
 */
exports.getCreateCommentController = function (req, res) {
  Article.load(req.params.id, function (err, result) {
    if (err || !result) return res.status(500).send( utils.errsForApi('There was an error in your request') );
    if (!req.body.body) return res.status(422).send( utils.errsForApi('Requires a comment body'));

    const article = result;
    const user = req.user;

    article.addComment(user, req.body, function (err) {
      if (err) return res.status(500).send(errMsg(err));
      
      var articleObj = article.toObject();//Adding the populated comments from a pure JS object.
      var comments = articleObj.comments;
      comments[comments.length-1].user=_.pick(user, ['username', '_id', 'name']); //For security we only send id and username.

      setTimeout(function(){
       res.send(articleObj);
      },500)
    });
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
    setTimeout(function(){
      res.send(article);
    },500)
  });
};