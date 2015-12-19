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

var React = require('react');
import { Router, Route, Link, IndexRoute } from 'react-router';

var Header = require('./Header.react');
var Articles = require('./Articles.react');
var Article = require('./Article.react');
var About = require('./About.react');
var New = require('./New.react');

const Main = React.createClass({
  render() {
    return (
        <div className="container">
          <Header />
          {this.props.children}
        </div>
      )
  }
})

var Root = React.createClass({
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
          <Route path="about" component={About} />
        </Route>
      </Router>
    </div>
    );
  }

});

module.exports = Root;