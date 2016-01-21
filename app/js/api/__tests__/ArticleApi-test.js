/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

jest.dontMock('../../constants/Constants');
jest.dontMock('../ArticlesApi');
jest.dontMock('object-assign');

describe('ArticleApi', function() {

  var Constants = require('../../constants/Constants');
  var base = '/api/articles';
  var apiMock = jest.genMockFromModule('../Api');

  beforeEach(function() {
    callback = jest.genMockFunction();
    ArticleApi = require('../ArticlesApi');
    Api = require('../Api');
    //Mocking the api functions to return a fake end promise
    var reqesterMock = function(url, params){
      return {
        end: function(cb){
          cb(url, params)
        }
      }
    }
    Api.get = reqesterMock;
    Api.del = reqesterMock;
    Api.put = reqesterMock;
    Api.post = reqesterMock;

    //Returning the jest mock function with our formed api requests.
    Api.makeResponseCallback = function(){
      return callback
    }
  });

  it('should form a get list api request', function() {
    var count =5
    var skip = 0
    var tag = 'foo'
    ArticleApi.getEntityListData(count, skip, tag)
    expect(callback).toBeCalledWith(
    base,
    {
      count: count,
      skip: skip,
      tag: tag
    });
  });

  it('should form a get by id api request', function() {
    var id = 'abc123'
    ArticleApi.getEntityDataById(id)
    expect(callback).toBeCalledWith(
      '/api/articles/'+id,
      {});
  });

  it('should form a post api request', function() {
    var body = {
          title: 'foo',
          body: 'bar',
          _id: 'abc123'
        }
    ArticleApi.postEntityData(body)
    expect(callback).toBeCalledWith(
      base,
      body);
  });

  it('should form a del api request', function() {
    var id = 'abc123'
    ArticleApi.deleteEntityData(id)
    expect(callback).toBeCalledWith(
      base+'/'+id,
      {});
  });

  it('should form a put api request', function() {
    var id = 'abc123'
    var body = {
          title: 'foo',
          body: 'bar',
          _id: 'abc123'
        }
    ArticleApi.putEntityData(id, body)
    expect(callback).toBeCalledWith(
      base+'/'+id,
      body);
  });

  it('should form a post comment api request', function() {
    var id = 'abc123'
    var body = {
          body: 'bar',
        }
    ArticleApi.postEntityCommentData(id, body)
    expect(callback).toBeCalledWith(
      base+'/'+id+'/comments',
      body);
  });

  it('should form a delete comment api request', function() {
    var id = 'abc123';
    var commentId = 'def456';
    ArticleApi.deleteEntityCommentData(id, commentId)
    expect(callback).toBeCalledWith(
      base+'/'+id+'/comments/'+commentId,
      {});
  });
});