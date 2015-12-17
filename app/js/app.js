/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const ReactDOM = require('react-dom');
import { Router, Route, Link } from 'react-router';


const App = require('./components/App.react');

const About = React.createClass({
  render :function() {
    return (
      <div>
        <h2>About</h2>
        <Link to="/">Home</Link>
      </div>
    )
  }
})


ReactDOM.render((
  <Router>
    <Route path="/" component={App} />
    <Route path="/about" component={About} />
  </Router>
  ),
  document.getElementById('app')
);
