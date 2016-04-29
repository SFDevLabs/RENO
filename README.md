
![React Express Node mOngoDB](logo.png)
# RENO - React Express Node mOngoDB 

RENO is an example app that demonstrates how to set up a full stack [React.js](https://facebook.github.io/react/) app. See it live at [reno-demo.herokuapp.com](https://reno-demo.herokuapp.com).


## Install
Create a new directory and run the follwing command in your shell.

```sh
$ git clone git://github.com/SFDevLabs/reno.git
$ npm install
$ npm start
```

Then visit [http://localhost:3000/](http://localhost:3000/). This starts the Express powered API and the Webpack-dev-server. Webpack will bundle the front end JSX/JS every time you make a file change in the "app/js" folder.

## What's in the box?

1. [React.js](https://facebook.github.io/react/) / [Flux](https://facebook.github.io/flux/) Front End (Look in the directory /app/js)
2. [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API  built in [Express.js](http://expressjs.com/) and [MongoDB](https://www.mongodb.org/)
3. [Webpack](https://webpack.github.io/) configuration
3. [Passport.js](http://passportjs.org/) authentication
5. [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) image upload via [Imager](https://github.com/madhums/imager)
6. Application emails via [Notifier](https://github.com/madhums/node-notifier)
7. Lots of [tests](https://en.wikipedia.org/wiki/Software_testing)

##Why RENO?
Because we need a good simple example of an end-to-end React app. Motivated by the [javascript fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4#.3fcefof62) some new developers face.


## Front end Application Event Flow
When a user interacts wth RENO (i.e. creates a post) data flows through a series of steps. These steps mirror the folders structure located at *app/js*.

1. Components: The React classes and JSX that declare our UI elements

	```js
	  React.createClass({
	    ...
	    _save: function() {
	      Actions.create(this.state);
	    }
	  })
	```  
2. Actions: The central module for actions we register on our UI elements

	```js
	  ...
	  create: function(obj) {
	    ArticleApi.postEntityData(obj);
	  }
	```

3. API: The [XHR](https://en.wikipedia.org/wiki/XMLHttpRequest) module where we make GET/POST/PUT/DELETE requests

	```js
	  ...
	  postEntityData: function(data) {
		...
		const key = Constants.POST_ARTICLE_DATA;
	    _pendingRequests[key] = RequestAPI.post(url, params).end(
	      RequestAPI.makeResponseCallback(key, params)
	    );
	  }
	```

4. Dispatch: The [Flux dipatcher](https://facebook.github.io/flux/docs/dispatcher.html#content) that fires the callback when we call the dispatcher's *dispatch* methode 
	
	```js
	  makeResponseCallback: function(){
	    ...
	    dispatch(key, res, params);
	  }
	  ...
	  function dispatch(key, response, params, data) {
		  var payload = {actionType: key, response: response};
		  if (params) {
		    payload.params = params;
		  }
		  if (data) {
		    payload.data = data;
		  }
		  AppDispatcher.dispatch(payload);
	  }
	```

5. Store: The data model where we set new data and then emit events to re-render our components with the new data

	```js
	  AppDispatcher.register(function(action) {
	    ...
	    case Constants.POST_ARTICLE_DATA:
	      var article = action.response.body
		   if (article) {
		     set(article);
		     ArticleStore.emitChange();
		   }
		  break;
	  })
	```

## CRUD API

The application Express.js has three components.

1. Our Express server is kicked of at the */server.js* file
2. A route config file can be found at */config/routes.js*

	```js
  	  app.post(path, auth.requiresLogin, articleCrud.getCreateController);

	```
3. These routes map to our CRUD api found at */app/api/*

	```js
	  exports.getCreateController = function (req, res) {
	    var m = new Article(req.body);
	    ...
	    m.save(function (err) {
	    ...
	     res.send(m);
	    }
	  };
	```

## Passport and Notifier Configuration

You can configure the application variables for Passport.js at */config/env/* and Notifier.js at */config/config.js*.


## Heroku

To run the app on Heroku you must set the [environment variables](https://nodejs.org/api/process.html#process_process_env) for the app.


1. Set NODE_ENV to 'production'
2. Set all the required variables in /config/env/production.js to empty string or live keys
3. [Deploy](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) your app

*You can set config variables on Heroku with [this tool](https://devcenter.heroku.com/articles/config-vars#setting-up-config-vars-for-a-deployed-application).


## Tests

You can find the application's tests in Two places:

1. Front End tests are in the \__tests__ folders located in same directory of the modules they cover
2. Back end tests are located in the *test* directory

Run the tests with the command:

```sh
$ npm test
```
[ ![Codeship Status for SFDevLabs/RENO](https://codeship.com/projects/b68dad30-a46c-0133-a156-726ab495672b/status?branch=master)](https://codeship.com/projects/129430)

## Building
In production the static assets are served from the "/build" folder (In development they are served by webpack-dev-server).  To use Webpack to build the JS and JSX assets into "/build/js/bundle.js" run the following:

```sh
$ npm run build
```
*Running build is required for changes to be seen on a production environment.

## CREDIT

The server and mongoose models are based on those found in [node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo). (Thanks to [madhums](https://github.com/madhums))


## License

MIT
