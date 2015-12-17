var API_URL = '/api/articles';
var TIMEOUT = 10000;

var request = require('superagent');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/ArticleConstants');

var _pendingRequests = {};


function abortPendingRequests(key) {
    if (_pendingRequests[key]) {
        _pendingRequests[key]._callback = function(){};
        _pendingRequests[key].abort();
        _pendingRequests[key] = null;
    }
}

function token() {
    return UserStore.getState().token;
}

function makeUrl(part) {
    return API_URL + part;
}

function dispatch(key, response, params) {
    var payload = {actionType: key, response: response};
    if (params) {
        payload.queryParams = params;
    }
    AppDispatcher.dispatch(payload);
}

// return successful response, else return request Constants
function makeDigestFun(key, params) {
    return function (err, res) {
        if (err && err.timeout === TIMEOUT) {
            dispatch(key, Constants.request.TIMEOUT, params);
        } else if (res.status === 400) {
            UserActions.logout();
        } else if (!res.ok) {
            dispatch(key, Constants.request.ERROR, params);
        } else {
            dispatch(key, res, params);
        }
    };
}

// a get request with an authtoken param
function get(url) {
    return request
        .get(url)
        .timeout(TIMEOUT)
        //.query({authtoken: token()});
}

var Api = {
    getEntityData: function() {
        var url = makeUrl("");
        var key = Constants.GET_ALL_ARTICLES_DATA;
        var params = {};
        abortPendingRequests(key);
        dispatch(Constants.PENDING, params);
        _pendingRequests[key] = get(url).end(
            makeDigestFun(key, params)
        );
    }
};

module.exports = Api;