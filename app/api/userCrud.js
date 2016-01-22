'use strict';

/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const mongoose = require('mongoose')
const User = mongoose.model('User');
const _ = require('lodash');
const utils = require('../../lib/utils');

/**
 * Load
 */

exports.load = function (req, res, next, id) {
  const options = {
    criteria: { _id : id }
  };
  User.load(options, function (err, user) {
    if (err && err.name == 'CastError' || !user){ 
      return res.status(404).send( utils.errsForApi('Not Found') )
    } else if (err) {
      return res.status(500).send( utils.errsForApi(err) )
    }
    if (user) req.profile = user;
    next();
  });
};

/**
 * Read
 */
exports.getReadController = function (req, res) {
  const user = req.profile;
  res.send(user);
};

/**
 * Read Profile
 */
exports.getReadControllerProfile = function (req, res) {
  res.send({
    user:req.user,
    success: !!req.user
  });
};