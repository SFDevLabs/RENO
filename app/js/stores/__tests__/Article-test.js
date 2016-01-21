/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

jest.dontMock('../../constants/Constants');
jest.dontMock('../ArticleStore');
jest.dontMock('object-assign');

describe('Store', function() {

  var Constants = require('../../constants/Constants');
  var AppDispatcher;
  var ArticleStore;
  var callback;

  // mock actions
  var actionCreate = {
    actionType: Constants.GET_ALL_ARTICLES_DATA,
    response:{
      body: {
        total:2,
        articles:[{
          title: 'foo',
          body: 'bar',
          _id:1
        }]
      }
    }
  };

  var actionDestroy = {
    actionType: Constants.DELETE_ARTICLE,
    response:{
      body: {
          title: 'foo',
          body: 'bar',
          _id:1
      }
    }
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
    var total = ArticleStore.getTotal();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    expect(total).toBe(2);
    expect(all[keys[0]].title).toEqual('foo');
    expect(all[keys[0]].body).toEqual('bar');
  });


  it('destroys an article item', function() {
    //Make an Article
    callback(actionCreate);
    var all = ArticleStore.getAll();
    var keys = Object.keys(all);

    //Then Destroy It
    callback(actionDestroy);
    var totalAfter = ArticleStore.getTotal();
    expect(all[keys[0]]).toBeUndefined();
    expect(totalAfter).toBe(1);// This test that the toal was decimented from 2 to 1.

  });

});
