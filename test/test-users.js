'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const should = require('should');
const request = require('supertest');
const app = require('../server');
const User = mongoose.model('User');
const agent = request.agent(app);
var _id = null;

let count;

/**
 * Users tests
 */

describe('Users', function () {
  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt;
          done(err);
        });
      });

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', '')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(422)
        // .expect(/Email cannot be blank/)
        .end(done);
      });

      it('no name - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', '')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(422)
        // .expect(/Name cannot be blank/)
        .end(done);
      });

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt);
          done(err);
        });
      });
    });

    describe('Valid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should redirect to /articles', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /plain/)
        .expect('Location', /\//)
        .expect(302)
        .end(done);
      });

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1);
          done(err);
        });
      });

      it('should save the user to the database', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          should.not.exist(err);
          user.should.be.an.instanceOf(User);
          user.email.should.equal('foobar@example.com');
          _id = user._id //set for user api query
          done();
        });
      });
    });
  });


  describe('GET', function () {
    before(function (done) {
      // login the user
      agent
      .post('/users/session')
      .field('email', 'foobar@example.com')
      .field('password', 'foobar')
      .expect(302)
      .end(done);
    });

    it('Profile API should respond with user', function (done) {
      agent
      .get('/api/users/profile')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect(/foobar/)
      .end(done);
    });

    it('User API should respond with user', function (done) {
      agent
      .get('/api/users/'+_id)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect(/foobar/)
      .end(done);
    });

  });

  after(function (done) {
    require('./helper').clearDb(done);
  });
});
