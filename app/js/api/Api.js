/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const TIMEOUT = 12000;

const request = require('superagent');
const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/Constants');

const csrf = document.getElementById('csrf');
const csrfToken = csrf?csrf.content:'';


function dispatch(key, response, params, data) {
  var payload = {actionType: key, response: response};
  if (params) {
    payload.params = params;
  }
  if (data) {
    payload.data = data;
  }
  AppDispatcher.dispatch(payload);
}

var Api = {
  abortPendingRequests: function (key, pendingRequests) {
    if (pendingRequests[key]) {
      pendingRequests[key]._callback = function(){};
      pendingRequests[key].abort();
      pendingRequests[key] = null;
    }
  },
  dispatch : dispatch,
  makeResponseCallback: function (key, params, data) {
    return function (err, res) {
      if (err && err.timeout === TIMEOUT) {
        dispatch(Constants.TIMEOUT, params, data);
      } else if (err && res && res.status === 404) {
        dispatch(Constants.ERROR_NOT_FOUND, res.body, params, data);
      } else if (err) {
        dispatch(Constants.ERROR, res.body?res.body:null);
      } else {//All is good we dispatch the event with our data.
        dispatch(key, res, params);
      }
    };
  },
  // a get request with an csrfToken param
  get: function (url, params) { 
    return request
      .get(url)
      .query(params)
      .timeout(TIMEOUT)
  },
  // a post request with an csrfToken param
  post: function (url, data) {
    var r = request.post(url)
    for (var key in data) {
      r.field(key, data[key])
    };
    r.field('_csrf', csrfToken);

    return r.timeout(TIMEOUT);
  },
  // a put request with an csrfToken param
  put: function (url, data) {
    var r = request.put(url)
    for (var key in data) {
      r.field(key, data[key])
    };
    r.field('_csrf', csrfToken);

    return r.timeout(TIMEOUT);
  },
  // a delete request with an csrfToken param
  del: function (url) {
    var r = request.delete(url)
    r.field('_csrf', csrfToken);
    return r.timeout(TIMEOUT);
  }
}

module.exports = Api;