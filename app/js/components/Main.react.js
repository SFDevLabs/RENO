/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/


const React = require('react');
import { Router, Route, Link, IndexRoute } from 'react-router';

const Header = require('./Header.react');
const Articles = require('./Articles.react');
const Article = require('./Article.react');
const PostNew = require('./PostNew.react');
const PostUpdate = require('./PostUpdate.react');
const NotFound = require('./NotFound.react');

const User = require('./User.react');

const Main = React.createClass({
  render() {
    return (
        <div>
          <Header />
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
    return <div>
      <Router>
        <Route path="/" component={Main} >
          <IndexRoute component={Articles} />
          <Route path="articles/new" component={PostNew} />
          <Route path="articles/:id" component={Article}/>
          <Route path="articles/:id/edit" component={PostUpdate}/>
          <Route path="users/:id" component={User}/>
          <Route path="*" component={NotFound}  />
        </Route>
      </Router>
    </div>;
  }

});

module.exports = Root;