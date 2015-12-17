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
const Header = require('./components/Header.react');

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

const Article = React.createClass({
  render :function() {
    return (
      <div>
        <h2>Article + {this.props.params.id}</h2>
        <Link to="/">Home</Link>
      </div>
    )
  }
})

ReactDOM.render((
		<div>
		<Header />
		  <Router>
		  	<Route path="/" component={App} />
			<Route path="/articles" component={Article}>
				<Route path="/articles/:id" component={Article}/>
			</Route>
		    <Route path="/about" component={About} />
		  </Router>
		</div>

  ),
  document.getElementById('app')
);
