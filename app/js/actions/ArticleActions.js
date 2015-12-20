/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ArticleConstants = require('../constants/ArticleConstants');
var ArticleApi = require('../api/ArticlesApi');


var Actions = {

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
    ArticleApi.getEntityData(obj);
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
