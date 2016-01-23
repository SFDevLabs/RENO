
# RENO - React Express Node mOngoDB 

RENO is an example of a how to set up a full stack [React.js](https://facebook.github.io/react/) app. See it live
example ar [reno-demo.herokuapp.com](https://reno-demo.herokuapp.com).

## Install

```sh
$ git clone git://github.com/SFDevLabs/reno.git
$ npm install
$ npm start
```

Then visit [http://localhost:3000/](http://localhost:3000/)


## Heroku

To run the app on Heroku you must set the [environment variables](https://nodejs.org/api/process.html#process_process_env) for the app.


1. Set NODE_ENV to 'production'
2. Set all the required variables in /config/env/production.js to empty string or live keys.
3. [Deploy](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).


	
You can set config variables on Heroku with [this tool](https://devcenter.heroku.com/articles/config-vars#setting-up-config-vars-for-a-deployed-application).


## Tests

```sh
$ npm test
```

## CREDIT

Thanks to Madhums for Express Server, Model and [node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo)


## License

MIT