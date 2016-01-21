'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const should = require('should');
const request = require('supertest');
const app = require('../server');
const context = describe;
const User = mongoose.model('User');
const Article = mongoose.model('Article');
const agent = request.agent(app);

let count;

/**
 * Articles tests
 */

describe('Articles', function () {
  before(function (done) {
    // create a user
    var user = new User({
      email: 'foobar@example.com',
      name: 'Foo bar',
      username: 'foobar',
      password: 'foobar'
    });
    user.save(done);
  });

  describe('GET /articles', function () {
    it('should respond with Content-Type application/json', function (done) {
      agent
      .get('/api/articles')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect(/articles/)
      .end(done);
    });
  });


  describe('POST /api/articles/', function () {

    context('When not logged in', function () {
      it('should send 401 asking for login.', function (done) {
        agent
        .post('/api/articles')
        .expect(401)
        .expect(/Requires you to login/)
        .end(done);
      });
    });

    context('When logged in', function () {
      before(function (done) {
        // login the user
        agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect(302)
        .end(done);
      });

      describe('Invalid parameters', function () {
        before(function (done) {
          Article.count(function (err, cnt) {
            count = cnt;
            done(err);
          });
        });

        it('should respond with error', function (done) {
          agent
          .post('/api/articles')
          .field('title', '')
          .field('body', 'bar')
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect(/Article title cannot be blank/)
          .end(done);
        });

        it('should respond with error', function (done) {
          agent
          .post('/api/articles')
          .field('title', 'foo')
          .field('body', '')
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect(/Article body cannot be blank/)
          .end(done);
        });

        it('should not save to the database', function (done) {
          Article.count(function (err, cnt) {
            count.should.equal(cnt);
            done(err);
          });
        });

      });

      describe('Valid parameters', function () {
        before(function (done) {
          Article.count(function (err, cnt) {
            count = cnt;
            done();
          });
        });

        it('should respond with new posted article', function (done) {
          agent
          .post('/api/articles')
          .field('title', 'foo')
          .field('body', 'bar')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .expect(/foo/)
          .expect(/bar/)
          .end(done);
        });

        it('should insert a record to the database', function (done) {
          Article.count(function (err, cnt) {
            cnt.should.equal(count + 1);
            done(err);
          });
        });

        var _id = null;
        it('should save the article to the database', function (done) {
          Article
          .findOne({ title: 'foo'})
          .populate('user')
          .exec(function (err, article) {
            should.not.exist(err);
            article.should.be.an.instanceOf(Article);
            article.title.should.equal('foo');
            article.body.should.equal('bar');
            article.user.email.should.equal('foobar@example.com');
            article.user.name.should.equal('Foo bar');
            _id = article._id; //set th id of the new comment
            done();
          });
        });
        //Use the _id to response to comments
        it('should respond with new posted comment', function (done) {
          agent
          .post('/api/articles/'+_id+'/comments')
          .field('body', 'bar')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .expect(/bar/)
          .end(done);
        });

        it('should respond with error for posted comment', function (done) {
          agent
          .post('/api/articles/'+_id+'/comments')
          .field('body', '')
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect(/Requires a comment body/)
          .end(done);
        });
      });
    });
  });


  after(function (done) {
    require('./helper').clearDb(done);
  });
});
