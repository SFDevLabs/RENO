/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const Constants = require('../constants/Constants');
const assign = require('object-assign');

const CHANGE_EVENT = 'change';

var _articles = {};
var _total = null;
var _didInitalGet = false;
var _newArticleId = null;
var _errors = [];

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
 * Set one ARTICLE item as null if we get a 404.
 * @param  {string} text The content of the ARTICLES
 */
function setNotFound(id) {
  _articles[id] = null;
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
 * Delete a ARTICLES item.
 * @param  {string} id
 */
function destroy(id) {
  delete _articles[id];
}

/**
 * Delete all ARTICLES items.
 * @param  {string} id
 */
function destroyAll(id) {
  _articles={};
}


/**
 * Set total count
 * @param  {number} the total number of articles
 */
function setTotal(num) {
  _total = num;
}

/**
 * decrementTotal
 * @param  {number} the total number of articles
 */
function decrementTotal() {
  _total = --_total;
}

/**
 * incrementTotal
 * @param  {number} the total number of articles
 */
function incrementTotal() {
  _total = ++_total;
}


/**
 * Set error message
 * @param  {error} the errors from the server
 */
function setError(error) {
  _errors = error;
}

/**
 * Set error message
 * @param  {error} the errors from the server
 */
function setNewArticleId(id) {
  _newArticleId = id;
}



var ArticleStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of ARTICLEs.
   * @return {object}
   */
  getAll: function() {
    return _articles;
  },

  /**
   * Get total number of ARTICLEs.
   * @return {number}
   */
  getTotal: function() {
    return _total;
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
    const id = _newArticleId;
    _newArticleId = null;
    return id;
  },

  /**
   * Get the entire collection of ARTICLEs.
   * @return {object}
   */
  getErrors: function() {
    var err = _errors;
    _errors = [];
    return err;
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

  switch(action.actionType) {

    case Constants.GET_ALL_ARTICLES_DATA:
      const articles = action.response.body.articles
      const total = action.response.body.total
      if (articles) {
        _didInitalGet = true;
        setAll(articles);
        setTotal(total);
        ArticleStore.emitChange();
      }
      break;

    case Constants.CLEAR_ALL_ARTICLES_DATA:
      destroyAll(articles);
      break;

    case Constants.GET_ARTICLE_DATA:
      var article = action.response.body
      if (article) {
        set(article);
        ArticleStore.emitChange();
      }
      break;

    case Constants.DELETE_ARTICLE:
      var article = action.response.body;
      if (article) {
        destroy(article._id);
        decrementTotal();
        ArticleStore.emitChange();
      }
      break;

    case Constants.POST_ARTICLE_DATA:
      var article = action.response.body
      if (article) {
        setNewArticleId(article._id)
        set(article);
        incrementTotal();
        ArticleStore.emitChange();
      }
      break;

    case Constants.POST_ARTICLE_COMMENT_DATA:
      var article = action.response.body
      if (article) {
        set(article);
        ArticleStore.emitChange();
      }
      break;

    case Constants.ERROR:
      var errors = action.response.errors
      if (errors) {
        setError(errors);
        ArticleStore.emitChange();
      }
      break;
      
    case Constants.DELETE_ARTICLE_COMMENT_DATA:
      var article = action.response.body
      if (article) {
        update(article);
        ArticleStore.emitChange();
      }
      break;

    case Constants.ERROR_NOT_FOUND:
      var id = action.data?action.data._id:null;
      if (id) {
        setNotFound(id);
        ArticleStore.emitChange();
      }
      break;

    case Constants.TIMEOUT:
      setError(['The Request Timed Out']);
      ArticleStore.emitChange();
      break;

    default:
      // no operation
  }
});

module.exports = ArticleStore;
