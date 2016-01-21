'use strict';

/**
 * Module dependencies.
 */

const path = require('path');
const extend = require('util')._extend;

const development = require('./env/development');
const test = require('./env/test');
const production = require('./env/production');

const notifier = {
  service: 'postmark',
  APN: false,
  email: true, // true
  tplType: 'html',
  actions: ['comment', 'pwreset'],
  tplPath: path.join(__dirname, '..', 'app/mailer/templates'),
  key: '76c0cf16-8413-4c35-832a-15ceb33e944c'//process.env.POSTMARK_KEY || 'KEY'
};

const defaults = {
  root: path.join(__dirname, '..'),
  notifier: notifier
};

/**
 * Expose
 */
module.exports = {
  development: extend(development, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
