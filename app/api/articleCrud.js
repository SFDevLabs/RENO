'use strict';

/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/
const mongoose = require('mongoose')
const Article = mongoose.model('Article');
const _ = require('lodash');

function errMsg(msg) {
  return {'error': {'message': msg.toString()}};
}

/**
 * List
 */
exports.getListController = function (req, res) {
  const skip = req.query.skip ? req.query.skip : 0;
  const count = req.query.count ? req.query.page : 30;
  const options = {
    count: count,
    skip: skip
  };

  Article.list(options, function (err, result) {
    if (!err) {
        setTimeout(function(){
          res.send(result);
        },500)
    } else {
      res.send(errMsg(err));
    }
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
        res.send(m);
      } else {
        res.send(errMsg(err));
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
      res.send(errMsg(err));
    }
  });
};

/**
 * Update
 */
exports.getUpdateController = function (req, res) {
  Article
    .findById(req.params.id, function (err, result) {
    var key;
    for (key in req.body) {
      result[key] = req.body[key];
    }
    result.save(function (err) {
      if (!err) {
        res.send(result);
      } else {
        res.send(errMsg(err));
      }
    });
  });
};

/**
 * Delete
 */
exports.getDeleteController = function (req, res) {
  Article
    .load(req.params.id, function (err, result) {
      if (err) {
        res.send(errMsg(err));
      } else {
        result.remove();
        result.save(function (err) {
          if (!err) {
            
          setTimeout(function(){
           res.send(result);
          },500)
            
          } else {
            res.send(errMsg(err));
          }
        });
      }
    });
};

/**
 * Create Comment
 */
exports.getCreateCommentController = function (req, res) {
  Article
    .load(req.params.id, function (err, result) {
    if (err || !result) return res.status(500).send(errMsg('There was an error in your request.'));

    const article = result;
    const user = req.user;
    if (!req.body.body) return res.status(500).send(errMsg('Requires a comment body.'));

    article.addComment(user, req.body, function (err) {
      if (err) return res.status(500).send(errMsg(err));
      
      var articleObj = article.toObject();//Adding the populated comments from a pure JS object.
      var comments = articleObj.comments;
      comments[comments.length-1].user=_.pick(user, ['username', '_id']);

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
      res.send(errMsg(err));
    } else if (!result){
      res.send(errMsg('There was an error in your request.'));
    }else {
      var article = result;
      var commentId = req.params.commentId;
      article.removeComment(commentId, function (err) {
        if (err) {
          res.send(errMsg('Oops! The comment was not found'));
        }
        setTimeout(function(){
          res.send(article);
        },500)
        
      });
    }
  });
};