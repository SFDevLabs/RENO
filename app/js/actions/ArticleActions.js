/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const ArticleConstants = require('../constants/ArticleConstants');
const ArticleApi = require('../api/ArticlesApi');


const Actions = {

  /**
   * @param  {number} start
   * @param  {number} skip
   */
  getList: function(start, skip, clearStore) {
    ArticleApi.getEntityData(start, skip);
    if (clearStore){
      AppDispatcher.dispatch({actionType: ArticleConstants.CLEAR_ALL_ARTICLES_DATA})
    }
  },

  /**
   *
   */
  clearList: function() {
  },

  /**
   * @param  {string} id
   */
  getById: function(id) {
    ArticleApi.getEntityDataById(id);
  },

  /**
   * @param  {obj} article data
   */
  create: function(obj) {
    ArticleApi.postEntityData(obj);
  },

  /**
   * @param  {string} id
   * @param  {obj} article data
   */
  update: function(id, obj) {
    ArticleApi.putEntityData(id, obj);
  },

  /**
   * @param  {object} update
   */
  destroy: function(id) {
    ArticleApi.deleteEntityData(id);
  },

  /**
   * @param  {string} articleId
   * @param  {obj} comment data
   */
  createComment: function(articleId, obj) {
    ArticleApi.postEntityCommentData(articleId, obj);
  },

  /**
   * @param  {string} articleId
   * @param  {obj} commentId
   */
  destroyComment: function(articleId, commentId) {
    ArticleApi.deleteEntityCommentData(articleId, commentId);
  }

};

module.exports = Actions;
