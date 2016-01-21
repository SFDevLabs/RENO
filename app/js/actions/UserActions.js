/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/
const UserApi = require('../api/UserApi');


const Actions = {

  /**
   * @param  {string} id
   */
  getById: function(id) {
    UserApi.getEntityDataById(id);
  },

  /**
   * @param  {string} id
   */
  getProfile: function() {
    UserApi.getProfileData();
  }

};

module.exports = Actions;
