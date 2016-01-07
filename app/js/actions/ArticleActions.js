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
   * @param  {string} text
   */
  createComment: function(id, obj) {
    ArticleApi.postEntityCommentData(id, obj);
  },

  /**
   * @param  {string} id The ID of the ToDo item
   * @param  {string} text
   */
  updateText: function(id, text) {
    AppDispatcher.dispatch({
      actionType: ArticleConstants.TODO_UPDATE_TEXT,
      id: id,
      text: text
    });
  },

  /**
   * Toggle whether a single ToDo is complete
   * @param  {object} todo
   */
  toggleComplete: function(todo) {
    var id = todo.id;
    var actionType = todo.complete ?
        ArticleConstants.TODO_UNDO_COMPLETE :
        ArticleConstants.TODO_COMPLETE;

    AppDispatcher.dispatch({
      actionType: actionType,
      id: id
    });
  },

  /**
   * Mark all ToDos as complete
   */
  toggleCompleteAll: function() {
    AppDispatcher.dispatch({
      actionType: ArticleConstants.TODO_TOGGLE_COMPLETE_ALL
    });
  },

  /**
   * @param  {string} id
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: ArticleConstants.TODO_DESTROY,
      id: id
    });
  },

  /**
   * Delete all the completed ToDos
   */
  destroyCompleted: function() {
    AppDispatcher.dispatch({
      actionType: ArticleConstants.TODO_DESTROY_COMPLETED
    });
  }

};

module.exports = Actions;
