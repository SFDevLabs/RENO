/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const ArticleConstants = require('../constants/Constants');
const UserApi = require('../api/UserApi');


const Actions = {

  /**
   * @param  {string} id
   */
  getById: function(id) {
    UserApi.getEntityDataById(id);
  }

};

module.exports = Actions;
