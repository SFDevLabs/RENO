/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/


const React = require('react');
import { Router, Route, Link, IndexRoute } from 'react-router';

const Header = require('./Header.react');
const Articles = require('./Articles.react');
const Article = require('./Article.react');
const About = require('./About.react');
const New = require('./New.react');
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
    return (
    <div>
      <Router>
        <Route path="/" component={Main} >
          <IndexRoute component={Articles} />
          <Route path="articles/new" component={New} />
          <Route path="articles/:id" component={Article}/>
          <Route path="articles/:id/edit" component={New}/>
          <Route path="users/:id" component={User}/>
          <Route path="about" component={About} />
        </Route>
      </Router>
    </div>
    );
  }

});

module.exports = Root;