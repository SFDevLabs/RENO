/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/


const Constants = require('../constants/Constants');
const RequestAPI = require('./Api');

var _pendingRequests = {};

const API_URL = '/api/users';

function makeUrl(part) {
  return API_URL + part;
}

//API calls
var UserApi = {
  getEntityDataById: function(id) {
    if (!id) { 
      return false 
    } else {
      var url = makeUrl("/"+id);
      var key = Constants.GET_USER_DATA;
      var params = {};
      RequestAPI.abortPendingRequests(key, _pendingRequests);
      RequestAPI.dispatch(Constants.PENDING, params);
      _pendingRequests[key] = RequestAPI.get(url, params).end(
        RequestAPI.makeResponseCallback(key, params)
      );            
    }
  },
  getProfileData: function() {
    var url = makeUrl("/profile");
    var key = Constants.GET_PROFILE_DATA;
    var params = {};
    RequestAPI.abortPendingRequests(key, _pendingRequests);
    RequestAPI.dispatch(Constants.PENDING, params);
    _pendingRequests[key] = RequestAPI.get(url, params).end(
      RequestAPI.makeResponseCallback(key, params)
    );            
  }
};

module.exports = UserApi;

// /**
//  * The MIT License (MIT)
//  * Copyright (c) 2016, Jeff Jenkins.
// */

// const API_URL = '/api/users';
// const TIMEOUT = 10000;

// const request = require('superagent');
// const AppDispatcher = require('../dispatcher/AppDispatcher');
// const Constants = require('../constants/Constants');

// const csrf = document.getElementById('csrf');
// const csrfToken = csrf?csrf.content:'';

// var _pendingRequests = {};


// function abortPendingRequests(key) {
//   if (_pendingRequests[key]) {
//     _pendingRequests[key]._callback = function(){};
//     _pendingRequests[key].abort();
//     _pendingRequests[key] = null;
//   }
// }

// function token() {
//   return UserStore.getState().token;
// }

// function makeUrl(part) {
//   return API_URL + part;
// }

// function dispatch(key, response, params) {
//   var payload = {actionType: key, response: response};
//   if (params) {
//     payload.queryParams = params;
//   }
//   AppDispatcher.dispatch(payload);
// }

// // return successful response, else return request Constants
// function makeResponseCallback(key, params) {
//   return function (err, res) {
//     if (err && err.timeout === TIMEOUT) {
//       dispatch(Constants.TIMEOUT, params);
//     } else if (err && res.status && res.status === 404) {
//       dispatch(Constants.ERROR_NOT_FOUND, params);
//     } else if (err) {
//       dispatch(Constants.ERROR, params);
//     } else {
//       dispatch(key, res, params);
//     }
//   };
// }

// // a get request with an authtoken param
// function get(url, params) {
//   return request
//     .get(url)
//     .query(params)
//     .timeout(TIMEOUT)
// }

// //API calls
// var Api = {
//   getEntityDataById: function(id) {
//     if (!id) { 
//       return false 
//     } else {
//       var url = makeUrl("/"+id);
//       var key = Constants.GET_USER_DATA;
//       var params = {};
//       abortPendingRequests(key);
//       dispatch(Constants.PENDING, params);
//       _pendingRequests[key] = get(url).end(
//         makeResponseCallback(key, params)
//       );            
//     }
//   },
//   getProfileData: function() {
//     var url = makeUrl("/profile");
//     var key = Constants.GET_PROFILE_DATA;
//     var params = {};
//     abortPendingRequests(key);
//     dispatch(Constants.PENDING, params);
//     _pendingRequests[key] = get(url).end(
//       makeResponseCallback(key, params)
//     );            
//   }
// };

// module.exports = Api;