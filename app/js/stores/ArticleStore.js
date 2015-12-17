/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * ArticleStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ArticleConstants = require('../constants/ArticleConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _articles = {};
var _didInitalGet = false;
/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _articles[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * Create a ARTICLE item.
 * @param  {string} text The content of the TODO
 */
function set(articles) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  // var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  // _articles[id] = {
  //   id: id,
  //   complete: false,
  //   text: text
  // };
  _didInitalGet = true
  for (var i = articles.length - 1; i >= 0; i--) {
    var article = articles[i]
    var id = article._id
    _articles[id] = article;
  };
}


/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _articles[id] = assign({}, _articles[id], updates);
}

/**
 * Update all of the TODO items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _articles) {
    update(id, updates);
  }
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  delete _articles[id];
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  for (var id in _articles) {
    if (_articles[id].complete) {
      destroy(id);
    }
  }
}

var ArticleStore = assign({}, EventEmitter.prototype, {

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    for (var id in _articles) {
      if (!_articles[id].complete) {
        return false;
      }
    }
    return true;
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _articles;
  },
  
  didInitalGet: function() {
    return _didInitalGet;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {

    case ArticleConstants.GET_ALL_ARTICLES_DATA:
      var articles = action.response.body
      if (articles) {
        set(articles);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (ArticleStore.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      ArticleStore.emitChange();
      break;

    case ArticleConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      ArticleStore.emitChange();
      break;

    case ArticleConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      ArticleStore.emitChange();
      break;

    case ArticleConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.TODO_DESTROY:
      destroy(action.id);
      ArticleStore.emitChange();
      break;

    case ArticleConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      ArticleStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ArticleStore;
