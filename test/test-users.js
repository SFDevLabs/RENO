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

      it('should redirect to /', function (done) {
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

    after(function(done){
      agent
        .get('/logout')
        .expect(302)
        .end(done);
    })

  });

  describe('Password Reset', function () {
    it('should respond with a reset page', function (done) {
      agent
      .get('/pwreset')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Password Reset/)
      .end(done);
    });

    it('should respond when we post request for a reset email', function (done) {
      agent
      .post('/pwreset')
      .field('email', 'foobar@example.com')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Check your email for a password reset link/)
      .end(done);
    });

    var token;
    it('should update the db with a token and expiration', function (done) {
      User.findOne({ email: 'foobar@example.com' }).exec(function (err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        should(user.resetPasswordExpires).not.equal(null)
        should(user.resetPasswordToken).not.equal(null)
        token = user.resetPasswordToken
        done();
      });
    });

    it('should get reset page with our token', function (done) {
      agent
      .get('/pwreset/'+token)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/Set New Password/)
      .end(done);
    });

    it('should save password with our reset token', function (done) {
      agent
      .post('/pwreset/'+token)
      .field('password', 'newfoobar')
      .expect('Content-Type', /plain/)
      .expect(302)
      .expect('Location', /\/login/)
      .end(done);
    });

    it('should update the db with null values for reset and expiration', function (done) {
      User.findOne({ email: 'foobar@example.com' }).exec(function (err, user) {
        should.not.exist(err);
        user.should.be.an.instanceOf(User);
        should(user.resetPasswordExpires).equal(null)
        should(user.resetPasswordToken).equal(null)
        done();
      });
    });

    it('should not get reset page with our reset token', function (done) {
      agent
      .get('/pwreset/'+token)
      .expect('Content-Type', /plain/)
      .expect(302)
      .expect('Location', /\/pwreset/)
      .end(done);
    });

    it('should not post a new password with our reset token', function (done) {
      agent
      .post('/pwreset/'+token)
      .field('password', 'newfoobar')
      .expect('Content-Type', /plain/)
      .expect(302)
      .expect('Location', /\/pwreset/)
      .end(done);
    });


  });

  describe('Check app with our new password', function () {

    before(function (done) {
      // login the user
      agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'newfoobar')
        .expect(302)
        .end(done);
    });

    it('Profile API should respond with user after we log in', function (done) {
      agent
      .get('/api/users/profile')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect(/foobar/)
      .end(done);
    });

  })

  after(function (done) {
    require('./helper').clearDb(done);
  });
});
