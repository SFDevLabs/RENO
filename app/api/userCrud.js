'use strict';

/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const mongoose = require('mongoose')
const User = mongoose.model('User');
const _ = require('lodash');

/**
 * Read
 */
exports.getReadController = function (req, res) {
  const options = {
    criteria: { _id : req.params.idUser }
  };
  User.load(options, function (err, result) {
    if (!err) {
        setTimeout(function(){
          res.send(result);
        },500)
    } else {
      res.status(500).send(errMsg(err));
    }
  });
};