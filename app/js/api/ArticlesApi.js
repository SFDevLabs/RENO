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
    const url = makeUrl('');
    const key = Constants.GET_ALL_ARTICLES_DATA;
    const params = {count: count, skip:skip, tag:tag};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.get(url, params).end(
        RequestAPI.makeResponseCallback(key, params)
    );
  },
  getEntityDataById: function(id) {
    if (!id){ return false;}else{
      const url = makeUrl("/"+id);
      const key = Constants.GET_ARTICLE_DATA;
      const params = {};
      const data = {_id:id}
      RequestAPI.abortPendingRequests(key, _pendingRequests);
      RequestAPI.dispatch(Constants.PENDING, params);
      _pendingRequests[key] = RequestAPI.get(url, params).end(
        RequestAPI.makeResponseCallback(key, params, data)
      );            
    }
  },
  postEntityData: function(data) {
    const url = makeUrl('');
    const key = Constants.POST_ARTICLE_DATA;
    const params = data;
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.post(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  },
  deleteEntityData: function(id) {
    const url = makeUrl("/"+id);
    const key = Constants.DELETE_ARTICLE;
    const params = {};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.del(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  },
  putEntityData: function(id, data) {
    const url = makeUrl('/'+id);
    const key = Constants.POST_ARTICLE_DATA;
    const params = data;
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.put(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  },
  postEntityCommentData: function(id, data) {
    const url = makeUrl('/'+id+'/comments');
    const key = Constants.POST_ARTICLE_COMMENT_DATA;
    const params = data;
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.post(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    ); 
  },
  deleteEntityCommentData: function(id, commentId) {
    const url = makeUrl('/'+ id +'/comments/'+ commentId);
    const key = Constants.DELETE_ARTICLE_COMMENT_DATA;
    const params = {};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.del(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );
  }
};

module.exports = ArticleApi;