/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
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