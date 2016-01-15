/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

jest.dontMock('../../constants/Constants');
jest.dontMock('../UserApi');
jest.dontMock('object-assign');

describe('UserApi', function() {

  var Constants = require('../../constants/Constants');
  var base = '/api/users';
  var apiMock = jest.genMockFromModule('../Api');

  beforeEach(function() {
    callback = jest.genMockFunction();
    UserApi = require('../UserApi');
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

  it('should form a get by user by id api request', function() {
    var id = 'abc123'
    UserApi.getEntityDataById(id)
    expect(callback).toBeCalledWith(
      base+'/'+id,
      {});
  });

  it('should form a get profile api request', function() {
    UserApi.getProfileData()
    expect(callback).toBeCalledWith(
      base+'/profile',
      {});
  });

});
