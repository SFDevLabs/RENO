const API_URL = '/api/articles';
const TIMEOUT = 10000;

const request = require('superagent');
const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/ArticleConstants');

const csrf = document.getElementById('csrf');
const csrfToken = csrf?csrf.content:'';

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
            dispatch(Constants.TIMEOUT, params);
        } else if (res.status === 400) {
            UserActions.logout();
        } else if (!res.ok) {
            dispatch(Constants.ERROR, params);
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
}

// a post request with an authtoken param
function post(url, data) {
    var r = request.post(url)
    for (var key in data) {
       r.field(key, data[key])
    };
    r.field('_csrf', csrfToken);//adding the csrf token

    return r.timeout(TIMEOUT);
}


// a put request with an authtoken param
function put(url, data) {
    var r = request.put(url)
    for (var key in data) {
       r.field(key, data[key])
    };
    r.field('_csrf', csrfToken);//adding the csrf token

    return r.timeout(TIMEOUT);
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
    },
    getEntityDataById: function(id) {
        if (!id){ return false;}else{
            var url = makeUrl("/"+id);
            var key = Constants.GET_ARTICLE_DATA;
            var params = {};
            abortPendingRequests(key);
            dispatch(Constants.PENDING, params);
            _pendingRequests[key] = get(url).end(
                makeDigestFun(key, params)
            );            
        }

    },
    postEntityData: function(data) {
        var url = makeUrl("");
        var key = Constants.POST_ARTICLE_DATA;
        var params = data;
        abortPendingRequests(key);
        dispatch(Constants.PENDING, params);
        _pendingRequests[key] = post(url, params).end(
            makeDigestFun(key, params)
        );
        
    },
    postEntityCommentData: function(id, data) {
        var url = makeUrl("/"+id+"/comments");
        var key = Constants.POST_ARTICLE_COMMENT_DATA;
        var params = data;
        abortPendingRequests(key);
        dispatch(Constants.PENDING, params);
        _pendingRequests[key] = post(url, params).end(
            makeDigestFun(key, params)
        );
        
    }
};

module.exports = Api;