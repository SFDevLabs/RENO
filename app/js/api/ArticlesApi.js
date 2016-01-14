/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const API_URL = '/api/articles';
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
    } else if (err && res.status && res.status === 404) {
      dispatch(Constants.ERROR_NOT_FOUND, params);
    } else if (err) {
      dispatch(Constants.ERROR, res.body);
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

// a post request with an authtoken param
function post(url, data) {
  var r = request.post(url)
  for (var key in data) {
    r.field(key, data[key])
  };
  r.field('_csrf', csrfToken);//adding the csrf token

  return r.timeout(TIMEOUT);
}


// a put request with an authtoken param
function put(url, data) {
  var r = request.put(url)
  for (var key in data) {
    r.field(key, data[key])
  };
  r.field('_csrf', csrfToken);//adding the csrf token

  return r.timeout(TIMEOUT);
}

// a delete request with an authtoken param
function del(url) {
  var r = request.delete(url)
  r.field('_csrf', csrfToken);//adding the csrf token

  return r.timeout(TIMEOUT);
}
//API calls
var Api = {
  getEntityData: function(count, skip) {
    var url = makeUrl('');
    var key = Constants.GET_ALL_ARTICLES_DATA;
    var params = {count: count, skip:skip};
    abortPendingRequests(key);
    dispatch(Constants.PENDING, params);
    _pendingRequests[key] = get(url, params).end(
        makeDigestFun(key, params)
    );
  },
  getEntityDataById: function(id) {
    if (!id){ return false;}else{
      var url = makeUrl("/"+id);
      var key = Constants.GET_ARTICLE_DATA;
      var params = {};
      abortPendingRequests(key);
      dispatch(Constants.PENDING, params);
      _pendingRequests[key] = get(url).end(
        makeDigestFun(key, params)
      );            
    }
  },
  postEntityData: function(data) {
    var url = makeUrl('');
    var key = Constants.POST_ARTICLE_DATA;
    var params = data;
    abortPendingRequests(key);
    dispatch(Constants.PENDING, params);
    _pendingRequests[key] = post(url, params).end(
      makeDigestFun(key, params)
    );
  },
  deleteEntityData: function(id) {
    var url = makeUrl("/"+id);
    var key = Constants.DELETE_ARTICLE;
    var params = {};
    abortPendingRequests(key);
    dispatch(Constants.PENDING, params);
    _pendingRequests[key] = del(url, params).end(
      makeDigestFun(key, params)
    );
  },
  putEntityData: function(id, data) {
    var url = makeUrl('/'+id);
    var key = Constants.POST_ARTICLE_DATA;
    var params = data;
    abortPendingRequests(key);
    dispatch(Constants.PENDING, params);
    _pendingRequests[key] = put(url, params).end(
      makeDigestFun(key, params)
    );
  },
  postEntityCommentData: function(id, data) {
    var url = makeUrl('/'+id+'/comments');
    var key = Constants.POST_ARTICLE_COMMENT_DATA;
    var params = data;
    abortPendingRequests(key);
    dispatch(Constants.PENDING, params);
    _pendingRequests[key] = post(url, params).end(
      makeDigestFun(key, params)
    ); 
  },
  deleteEntityCommentData: function(id, commentId) {
    var url = makeUrl('/'+ id +'/comments/'+ commentId);
    var key = Constants.DELETE_ARTICLE_COMMENT_DATA;
    var params = {};
    abortPendingRequests(key);
    dispatch(Constants.PENDING, params);
    _pendingRequests[key] = del(url).end(
      makeDigestFun(key, params)
    );
  }
};

module.exports = Api;