/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const ArticleConstants = require('../constants/ArticleConstants');
const assign = require('object-assign');

const CHANGE_EVENT = 'change';

var _articles = {};
var _didInitalGet = false;
var _newArticleId;

/**
 * Set all ARTICLE item.
 * @param  {string} text The content of the ARTICLES
 */
function setAll(articles) {
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
function update(article) {
  var id = article._id;
  _articles[id] = assign({}, _articles[id], article);
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
 * Delete a ARTICLES item.
 * @param  {string} id
 */
function destroyComment(id) {
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
      var articles = action.response.body
      _didInitalGet = true;
      if (articles) {
        setAll(articles);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.GET_ARTICLE_DATA:
      var article = action.response.body
      if (article) {
        set(article);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.POST_ARTICLE_DATA:
      var article = action.response.body
      if (article) {
        set(article);
        _newArticleId = article._id;
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.POST_ARTICLE_COMMENT_DATA:
      var article = action.response.body
      if (article) {
        set(article);
        ArticleStore.emitChange();
      }
      break;
      
    case ArticleConstants.DELETE_ARTICLE_COMMENT_DATA:
      var article = action.response.body
      if (article) {
        update(article);
        ArticleStore.emitChange();
      }
      break;

    case ArticleConstants.PENDING:
      //ArticleStore.emitChange();
      break;

    default:
      // no operation
  }
});

module.exports = ArticleStore;
