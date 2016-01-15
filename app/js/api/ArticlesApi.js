/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/


const Constants = require('../constants/Constants');
const RequestAPI = require('./Api');

var _pendingRequests = {};

const API_URL = '/api/articles';

function makeUrl(part) {
  return API_URL + part;
}

//API calls
var ArticleApi = {
  getEntityListData: function(count, skip, tag) {
    var url = makeUrl('');
    var key = Constants.GET_ALL_ARTICLES_DATA;
    var params = {count: count, skip:skip, tag:tag};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.get(url, params).end(
        RequestAPI.makeResponseCallback(key, params)
    );
  },
  getEntityDataById: function(id) {
    if (!id){ return false;}else{
      var url = makeUrl("/"+id);
      var key = Constants.GET_ARTICLE_DATA;
      var params = {};
      RequestAPI.abortPendingRequests(key, _pendingRequests);
      RequestAPI.dispatch(Constants.PENDING, params);
      _pendingRequests[key] = RequestAPI.get(url, params).end(
        RequestAPI.makeResponseCallback(key, params)
      );            
    }
  },
  postEntityData: function(data) {
    var url = makeUrl('');
    var key = Constants.POST_ARTICLE_DATA;
    var params = data;
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.post(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  },
  deleteEntityData: function(id) {
    var url = makeUrl("/"+id);
    var key = Constants.DELETE_ARTICLE;
    var params = {};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.del(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  },
  putEntityData: function(id, data) {
    var url = makeUrl('/'+id);
    var key = Constants.POST_ARTICLE_DATA;
    var params = data;
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.put(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  },
  postEntityCommentData: function(id, data) {
    var url = makeUrl('/'+id+'/comments');
    var key = Constants.POST_ARTICLE_COMMENT_DATA;
    var params = data;
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.post(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    ); 
  },
  deleteEntityCommentData: function(id, commentId) {
    var url = makeUrl('/'+ id +'/comments/'+ commentId);
    var key = Constants.DELETE_ARTICLE_COMMENT_DATA;
    var params = {};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.del(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  }
};

module.exports = ArticleApi;