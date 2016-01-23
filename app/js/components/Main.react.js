/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/


const React = require('react');
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

const Header = require('./Header.react');
const Articles = require('./Articles.react');
const Article = require('./Article.react');
const PostNew = require('./PostNew.react');
const PostUpdate = require('./PostUpdate.react');
const NotFound = require('./NotFound.react');
const User = require('./User.react');
const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/Constants');

const Main = React.createClass({
  render() {
    //route={'/'}
    return (
        <div>
          <Header route={{}} />
          {this.props.children}
        </div>
      )
  }
})

const Root = React.createClass({
  /**
   * @return {object}
   */
  render: function() {
    //Our React Router table
    return <div className="top" style={{height:'100%'}} onClick={this._onClick}>
      <Router history={hashHistory}>
        <Route path="/" component={Main} >
          <IndexRoute component={Articles} />
          <Route path="tags/:tag" component={Articles} />
          <Route path="articles/new" component={PostNew} />
          <Route path="articles/:id" component={Article}/>
          <Route path="articles/:id/edit" component={PostUpdate}/>
          <Route path="users/:id" component={User}/>
          <Route path="*" component={NotFound}  />
        </Route>
      </Router>
    </div>;
  },
  _onClick: function(){
      AppDispatcher.dispatch({actionType: Constants.APP_CLICK});
  }

});

module.exports = Root;