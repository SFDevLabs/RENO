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
  skip =  !isNaN(skip) ? skip : 0;
  count =  !isNaN(count) ? count : 30;
  const options = {
    count: count,
    skip: skip
  };
  Article.list(options, function (err, result) {
    Article.count().exec(function (errCount, count) {
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
  m.user = req.user;
  m.uploadAndSave([],function (err) {
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
    if (!err) {
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
    result.uploadAndSave([], function (err) {
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
          res.send(utils.errsForApi(err.errors || err));
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
    if (err || !result) return res.status(500).send(errMsg('There was an error in your request.'));

    const article = result;
    const user = req.user;
    if (!req.body.body) return res.status(500).send(errMsg('Requires a comment body.'));

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
  Article.load(req.params.id, function (err, result) {
    if (err) {
      res.send(utils.errsForApi(err.errors || err));
    } else if (!result){
      res.send(utils.errsForApi('There was an error in your request.'));
    }else {
      var article = result;
      var commentId = req.params.commentId;
      article.removeComment(commentId, function (err) {
        if (err) {
          res.send(utils.errsForApi('Oops! The comment was not found'));
        }
        setTimeout(function(){
          res.send(article);
        },500)
        
      });
    }
  });
};