/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var TodoActions = require('../actions/ArticleActions');
import { Link } from 'react-router';

var Header = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <nav role="navigation" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target=".navbar-collapse" className="navbar-toggle">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a href="/" className="navbar-brand">Node Express Mongoose Demo</a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li className="{% if (isActive('/articles/new')) %}active{% endif %}">
                <a href="/articles/new" title="new article">New</a>
              </li>

                <li className="{% if (isActive('/users/' + req.user.id )) %}active{% endif %}">
                  <a href="{{ '/users/' + req.user.id }}" title="Profile">Profile</a>
                </li>
                <li>
                  <a href="/logout" title="logout">Logout</a>
                </li>

                <li className="{% if (isActive('/login')) %}active{% endif %}">
                  <a href="/login" title="Login">Login</a>
                </li>

            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/about">Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

});

module.exports = Header;
