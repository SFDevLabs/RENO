/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

jest.dontMock('../../constants/Constants');
jest.dontMock('../UserStore');
jest.dontMock('object-assign');

describe('Store', function() {

  var Constants = require('../../constants/Constants');
  var AppDispatcher;
  var UserStore;
  var callback;
  const id = 'abc123';
  const profileId = 'def456';

  // mock actions
  var actionGetUser = {
    actionType: Constants.GET_USER_DATA,
    response:{
      body: {
          username:'foo',
          name:'bar',
          email:'foobar@example.com',
          _id: id
      }
    }
  };

  var actionProfile = {
    actionType: Constants.GET_PROFILE_DATA,
    response:{
      body: {
        success:2,
        user: {
          username:'foo',
          name:'bar',
          email:'foobar@example.com',
          _id:profileId
        }
      }
    }
  };

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    UserStore = require('../UserStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with no profile items', function() {
    var all = UserStore.getProfile();
    expect(all).toEqual(undefined);
  });

  it('to get a user', function() {
    callback(actionGetUser);
    var user = UserStore.getById(id);
    expect(user.name).toBe('bar');
    expect(user._id).toBe(id);
  });

  it('to get a profile', function() {
    callback(actionProfile);
    var profile = UserStore.getProfile();
    expect(profile.name).toBe('bar');
    expect(profile._id).toBe(profileId);
  });

});
