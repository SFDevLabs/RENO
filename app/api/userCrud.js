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
  const options = {
    criteria: { _id : req.params.idUser }
  };
  User.load(options, function (err, result) {
    if (!err) {
        setTimeout(function(){
          res.send(result);
        },500)
    } else {
      res.status(500).send(utils.errsForApi(err));
    }
  });
};

/**
 * Read Profile
 */
exports.getReadControllerProfile = function (req, res) {
  if (req.user){
    res.send({
      success:true,
      user:req.user
    });
  }else{
    res.send({
      success:true,
      user:null
    });
  }

};