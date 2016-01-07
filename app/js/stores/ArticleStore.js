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

const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const ArticleConstants = require('../constants/ArticleConstants');
const assign = require('object-assign');

const CHANGE_EVENT = 'change';

var _articles = {};
var _didInitalGet = false;
var _pending = false;
var _newArticleId;

/**
 * Set all ARTICLE item.
 * @param  {string} text The content of the ARTICLES
 */
function setAll(articles) {
  _didInitalGet = true
  for (var i = articles.length - 1; i >= 0; i--) {
    var article = articles[i]
    var id = article._id
    _articles[id] = article;
  };
}

/**
 * Set one ARTICLE item.
 * @param  {string} text The content of the ARTICLES
 */
function set(article) {
  _articles[article._id] = article;
}


/**
 * Update a ARTICLES item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _articles[id] = assign({}, _articles[id], updates);
}

/**
 * Update all of the ARTICLES items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _articles) {
    update(id, updates);
  }
}

/**
 * Delete a ARTICLES item.
 * @param  {string} id
 */
function destroy(id) {
  delete _articles[id];
}

/**
 * Delete all the completed ARTICLES items.
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
   * Tests whether all the remaining ARTICLES items are marked as completed.
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
   * Get the entire collection of ARTICLEs.
   * @return {object}
   */
  getAll: function() {
    return _articles;
  },

  /**
   * Get the article by id
   * @return {object}
   */
  getById: function(id) {
    return _articles[id];
  },
  
  didInitalGet: function() {
    return _didInitalGet;
  },

  getPendingState: function() {
    return _pending;
  },

  getNewArticleId: function() {
    return _newArticleId;
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
      _pending = false;
      var articles = action.response.body
      if (articles) {
        setAll(articles);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.GET_ARTICLE_DATA:
      _pending = false;
      var article = action.response.body
      if (article) {
        set(article);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.POST_ARTICLE_DATA:
      _pending = false;
      var article = action.response.body
      if (article) {
        set(article);
        _newArticleId = article._id;
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.POST_ARTICLE_COMMENT_DATA:
      _pending = false;
      var article = action.response.body
      if (article) {
        set(article);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.PENDING:
      _pending = true;
      ArticleStore.emitChange();
      break;

    // case ArticleConstants.ARTICLE_CREATE:
    //   text = action.text.trim();
    //   if (text !== '') {
    //     create(text);
    //     ArticleStore.emitChange();
    //   }
    //   break;

    // case ArticleConstants.TODO_TOGGLE_COMPLETE_ALL:
    //   if (ArticleStore.areAllComplete()) {
    //     updateAll({complete: false});
    //   } else {
    //     updateAll({complete: true});
    //   }
    //   ArticleStore.emitChange();
    //   break;




    // case ArticleConstants.TODO_DESTROY:
    //   destroy(action.id);
    //   ArticleStore.emitChange();
    //   break;

    default:
      // no op
  }
});

module.exports = ArticleStore;
