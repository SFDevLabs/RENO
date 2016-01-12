/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const API_URL = '/api/users';
const TIMEOUT = 10000;

const request = require('superagent');
const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/Constants');

const csrf = document.getElementById('csrf');
const csrfToken = csrf?csrf.content:'';

var _pendingRequests = {};


function abortPendingRequests(key) {
  if (_pendingRequests[key]) {
    _pendingRequests[key]._callback = function(){};
    _pendingRequests[key].abort();
    _pendingRequests[key] = null;
  }
}

function token() {
  return UserStore.getState().token;
}

function makeUrl(part) {
  return API_URL + part;
}

function dispatch(key, response, params) {
  var payload = {actionType: key, response: response};
  if (params) {
    payload.queryParams = params;
  }
  AppDispatcher.dispatch(payload);
}

// return successful response, else return request Constants
function makeDigestFun(key, params) {
  return function (err, res) {
    if (err && err.timeout === TIMEOUT) {
      dispatch(Constants.TIMEOUT, params);
    } else if (err && res.status === 404) {
      dispatch(Constants.ERROR_NOT_FOUND, params);
    } else if (err) {
      dispatch(Constants.ERROR, params);
    } else {
      dispatch(key, res, params);
    }
  };
}

// a get request with an authtoken param
function get(url, params) {
  return request
    .get(url)
    .query(params)
    .timeout(TIMEOUT)
}

//API calls
var Api = {
  getEntityDataById: function(id) {
    if (!id) { 
      return false 
    } else {
      var url = makeUrl("/"+id);
      var key = Constants.GET_USER_DATA;
      var params = {};
      abortPendingRequests(key);
      dispatch(Constants.PENDING, params);
      _pendingRequests[key] = get(url).end(
        makeDigestFun(key, params)
      );            
    }
  },
  getProfileData: function(id) {
    if (!id){ return false;}else{
      var url = makeUrl("/"+id);
      var key = Constants.GET_USER_DATA;
      var params = {};
      abortPendingRequests(key);
      dispatch(Constants.PENDING, params);
      _pendingRequests[key] = get(url).end(
        makeDigestFun(key, params)
      );            
    }
  }
};

module.exports = Api;