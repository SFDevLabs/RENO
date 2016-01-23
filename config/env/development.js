'use strict';

/*!
 * Module dependencies.
 */

const fs = require('fs');
const envFile = require('path').join(__dirname, 'env.json');

let env = {};

// Read env.json file, if it exists, load the id's and secrets from that
// Note that this is only in the development env
// it is not safe to store id's in files

if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(key => process.env[key] = env[key]);
}

/**
 * Expose
 */
const url = 'http://localhost:3000'
module.exports = {
  url : url,
  db: 'mongodb://localhost/reno_dev',
  facebook: {
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: url+'/auth/facebook/callback/#/'
  },
  twitter: {
    clientID: process.env.TWITTER_CLIENTID,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL: url+'/auth/twitter/callback'
  },
  github: {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: url+'/auth/github/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENTID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: url+'/auth/linkedin/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: url+'/auth/google/callback'
  }
};
