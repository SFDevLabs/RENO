/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const Constants = require('../constants/Constants');
const assign = require('object-assign');

const CHANGE_EVENT = 'change';

var _users = {};

/**
 * Set one USER item.
 * @param  {string} text The content of the ARTICLES
 */
function set(user) {
  _users[user._id] = user;
}

var UserStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the article by id
   * @return {object}
   */
  getById: function(id) {
    return _users[id];
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

    case Constants.GET_USER_DATA:
      const user = action.response.body
      if (user) {
        set(user);
        UserStore.emitChange();
      }
      break;
    case Constants.ERROR_NOT_FOUND:
      UserStore.emitChange();
      break;
      
    default:
      // no operation
  }
});

module.exports = UserStore;
