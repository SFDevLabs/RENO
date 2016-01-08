/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const ArticleConstants = require('../constants/ArticleConstants');
const ArticleApi = require('../api/ArticlesApi');


const Actions = {

  /**
   * @param  {string} text
   */
  getAll: function() {
    ArticleApi.getEntityData();
  },
  /**
   * @param  {string} text
   */
  getById: function(id) {
    ArticleApi.getEntityDataById(id);
  },

  /**
   * @param  {string} text
   */
  create: function(obj) {
    ArticleApi.postEntityData(obj);
  },

  /**
   * @param  {object} update
   */
  update: function(obj) {
    ArticleApi.putEntityData(obj);
  },

  /**
   * @param  {object} update
   */
  destroy: function(id) {
    ArticleApi.deleteEntityData(id);
  },

  /**
   * @param  {string} text
   */
  createComment: function(id, obj) {
    ArticleApi.postEntityCommentData(id, obj);
  },

  /**
   * @param  {string} id
   */
  destroyComment: function(id, commentId) {
    ArticleApi.deleteEntityCommentData(id, commentId);
  }

};

module.exports = Actions;
