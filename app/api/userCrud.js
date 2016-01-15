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
 * Read
 */
exports.getReadController = function (req, res) {
  const user = req.profile;
  res.send(user);
  // const options = {
  //   criteria: { _id : req.params.userId }
  // };
  // User.load(options, function (err, result) {
  //   if (err) {
  //     res.status(500).send(utils.errsForApi(err));
  //   } else {
  //     setTimeout(function(){
  //       res.send(result);
  //     },500)
  //   }
  // });
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