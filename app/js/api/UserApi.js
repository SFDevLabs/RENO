/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/


const Constants = require('../constants/Constants');
const RequestAPI = require('./Api');

var _pendingRequests = {};

const API_URL = '/api/users';

function makeUrl(part) {
  return API_URL + part;
}

//API calls
var UserApi = {
  getEntityDataById: function(id) {
    if (!id) { 
      return false 
    } else {
      const url = makeUrl("/"+id);
      const key = Constants.GET_USER_DATA;
      const params = {};
      const data = {_id:id}
      RequestAPI.abortPendingRequests(key, _pendingRequests);
      RequestAPI.dispatch(Constants.PENDING, params);
      _pendingRequests[key] = RequestAPI.get(url, params).end(
        RequestAPI.makeResponseCallback(key, params, data)
      );            
    }
  },
  getProfileData: function() {
    const url = makeUrl("/profile");
    const key = Constants.GET_PROFILE_DATA;
    const params = {};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.get(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );            
  }
};

module.exports = UserApi;