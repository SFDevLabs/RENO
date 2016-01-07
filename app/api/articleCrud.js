/**
 * Very basic CRUD route creation utility for models.
 * For validation, simply override the model's save method.
 */

(function (exports) {

  "use strict";

  function errMsg(msg) {
    return {'error': {'message': msg.toString()}};
  }
  const _ = require('lodash');


  //------------------------------
  // List
  //
  function getListController(model) {
    return function (req, res) {
      const skip = req.query.skip ? req.query.skip : 0;
      const count = req.query.count ? req.query.page : 30;
      const options = {
        count: count,
        skip: skip
      };

      model.list(options, function (err, result) {
        if (!err) {
          res.send(result);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Create
  //
  function getCreateController(model) {
    return function (req, res) {
      var m = new model(req.body);
      m.user = req.user;
      m.uploadAndSave([],function (err) {
        if (!err) {
          res.send(m);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Create Comment
  //
  function getCreateCommentController(model) {
    return function (req, res) {
      const article = req.article;
      const user = req.user;
      if (!req.body.body) return res.status(500).send(errMsg("Requires a comment body."));

      article.addComment(user, req.body, function (err) {
        if (err) return res.status(500).send(errMsg(err));
        
        var articleObj = article.toObject();//Adding the populated comments from a pure JS object.
        var comments = articleObj.comments;
        comments[comments.length-1].user=_.pick(user, ['username', '_id']);

        res.send(articleObj);
      });
    };
  }

  //------------------------------
  // Read
  //
  function getReadController(model) {
    return function (req, res) {
      model.load(req.params.id, function (err, result) {
        if (!err) {
          res.send(result);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Update
  //
  function getUpdateController(model) {
    return function (req, res) {
      //console.log('update', req.body);
      model.findById(req.params.id, function (err, result) {
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
  }

  //------------------------------
  // Delete
  //
  function getDeleteController(model) {
    return function (req, res) {
      model.findById(req.params.id, function (err, result) {
        if (err) {
          res.send(errMsg(err));
        } else {
          result.remove();
          result.save(function (err) {
            if (!err) {
              res.send({});
            } else {
              res.send(errMsg(err));
            }
          });
        }
      });
    };
  }

  //------------------------------
  // Delete Comment
  //
  function getDeleteCommentController(model) {
    return function (req, res) {
      model.findById(req.params.id, function (err, result) {
        if (err) {
          res.send(errMsg(err));
        } else {
          result.remove();
          result.save(function (err) {
            if (!err) {
              res.send({});
            } else {
              res.send(errMsg(err));
            }
          });
        }
      });
    };
  }

  exports.initRoutesForModel = function (options) {
    const app = options.app;
    const model = options.model;
    const auth = options.auth;

    var path;
    var pathWithId;

    const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
    const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

    if (!app || !model) {
      return;
    }

    path = options.path || '/' + model.modelName.toLowerCase();
    pathWithId = path + '/:id';

    app.get(path, getListController(model));
    app.post(path, auth.requiresLogin, getCreateController(model));

    //Special comment controllers
    app.post(pathWithId+'/comments', auth.requiresLogin, getCreateCommentController(model));
    app.delete(pathWithId+'/comments', auth.requiresLogin, getDeleteCommentController(model));

    app.get(pathWithId, getReadController(model));
    app.put(pathWithId, articleAuth, getUpdateController(model));
    app.delete(pathWithId, articleAuth, getDeleteController(model));

  };

}(exports));