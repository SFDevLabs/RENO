
![React Express Node mOngoDB](logo.png)
# RENO - React Express Node mOngoDB 

RENO is an example app that demonstrates how to set up a full stack [React.js](https://facebook.github.io/react/) app. See it live at [reno-demo.herokuapp.com](https://reno-demo.herokuapp.com).


## Install

```sh
$ git clone git://github.com/SFDevLabs/reno.git
$ npm install
$ npm start
```

Then visit [http://localhost:3000/](http://localhost:3000/). This starts the Express powered API and starts the Webpack-dev-server which bundles the frontend JSX/JS every time you make a file change in the app/js folder.

## What's in the box?

1. [React.js](https://facebook.github.io/react/) / [Flux](https://facebook.github.io/flux/) frontent
2. [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API  built in [Express.js](http://expressjs.com/) and [MongoDB](https://www.mongodb.org/)
3. [Webpack](https://webpack.github.io/) configuration
3. [Passport.js](http://passportjs.org/) authentication
5. [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) image upload via [Imager](https://github.com/madhums/imager)
6. Application emails via [Notifier](https://github.com/madhums/node-notifier)
7. Lots of [tests](https://en.wikipedia.org/wiki/Software_testing)

##Why RENO?
Because we need a good simple example of an end-to-end React app. Motivated by the [javascript fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4#.3fcefof62) some new developers face.

## Heroku

To run the app on Heroku you must set the [environment variables](https://nodejs.org/api/process.html#process_process_env) for the app.


1. Set NODE_ENV to 'production'
2. Set all the required variables in /config/env/production.js to empty string or live keys.
3. [Deploy](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).


	
*You can set config variables on Heroku with [this tool](https://devcenter.heroku.com/articles/config-vars#setting-up-config-vars-for-a-deployed-application).


## Tests

```sh
$ npm test
```
[ ![Codeship Status for SFDevLabs/RENO](https://codeship.com/projects/b68dad30-a46c-0133-a156-726ab495672b/status?branch=master)](https://codeship.com/projects/129430)

## Building
In production the static assets are served from the /build folder (In devlopment they are served by Webpack-dev-server).  To use Webpack to build the JS and JSX assets into /build/js/bundle.js run the following:

```sh
$ npm run build
```
*Running build is required for changes to be seen on production.

## CREDIT

The server and mongoose models are based on those found in  [node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo). (Thanks to [madhums](https://github.com/madhums))


## License

MIT
