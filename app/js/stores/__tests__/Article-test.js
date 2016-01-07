/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

jest.dontMock('../../constants/ArticleConstants');
jest.dontMock('../ArticleStore');
jest.dontMock('object-assign');

describe('Store', function() {

  var Constants = require('../../constants/ArticleConstants');
  var AppDispatcher;
  var ArticleStore;
  var callback;

  // mock actions
  var actionCreate = {
    actionType: Constants.GET_ALL_ARTICLES_DATA,
    response:{
      body: [{
        title: 'foo',
        body: 'bar'
      }]
    }
  };

  // mock actions
  var actionPending = {
    actionType: Constants.PENDING
  };

  var actionTodoDestroy = {
    actionType: Constants.TODO_DESTROY,
    id: 'replace me in test'
  };

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    ArticleStore = require('../ArticleStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with no article items', function() {
    var all = ArticleStore.getAll();
    expect(all).toEqual({});
  });

  it('creates a article item', function() {
    callback(actionCreate);
    var all = ArticleStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    expect(all[keys[0]].title).toEqual('foo');
    expect(all[keys[0]].body).toEqual('bar');
  });

  it('flips pending status a article item', function() {
    expect(ArticleStore.getPendingState()).toEqual(false); //Load with pending as false
    callback(actionPending); // We need to flip the app to pending a request
    expect(ArticleStore.getPendingState()).toEqual(true); //Flip to pending to true while the request is occuring.
    callback(actionCreate);
    expect(ArticleStore.getPendingState()).toEqual(false); //Request is complete pending should now be false
  });

  // it('destroys a to-do item', function() {
  //   callback(actionCreate);
  //   var all = ArticleStore.getAll();
  //   var keys = Object.keys(all);
  //   expect(keys.length).toBe(1);
  //   actionTodoDestroy.id = keys[0];
  //   callback(actionTodoDestroy);
  //   expect(all[keys[0]]).toBeUndefined();
  // });

});
