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
var _profileId = null;


/**
 * Set one USER item.
 * @param  {string} text The content of the ARTICLES
 */
function set(user) {
  _users[user._id] = user;
}


/**
 * Set profile
 * @param  {string} text The content of the ARTICLES
 */
function setProfileId(id) {
  _profileId = id;
}

/**
 * Set one USER itemas null if we get a 404.
 * @param  {string} text The content of the ARTICLES
 */
function setNotFound(id) {
  _users[id] = null;
}

var UserStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the article by id
   * @return {object}
   */
  getProfile: function() {
    return _users[_profileId];
  },

  /**
   * Get the article by id
   * @return {object}
   */
  getById: function(id) {
    return _users[id];
  },

  /**
   * Call the flux emitter
   * @return {object}
   */
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

    case Constants.GET_USER_DATA:
      var user = action.response.body;
      if (user) {
        set(user);
        UserStore.emitChange();
      }
      break;

    case Constants.GET_PROFILE_DATA:
      var user = action.response.body.user;
      if (user) {
        set(user);
        setProfileId(user._id);
      }
      UserStore.emitChange();
      break;

    case Constants.ERROR_NOT_FOUND:
      var id = action.data?action.data._id:null;
      if (id) {
        setNotFound(id);
        UserStore.emitChange();
      }
      break;
      
    default:
      // no operation
  }
});

module.exports = UserStore;
