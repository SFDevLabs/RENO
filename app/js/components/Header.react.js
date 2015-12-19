/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const TodoActions = require('../actions/ArticleActions');
const Link = require('react-router').Link


var Header = React.createClass({
  getInitialState:function(){
    return {
      collapsed: true,
      collapsing: false
    };
  },
  /**
   * @return {object}
   */
  render: function() {

    var navBar = 'navbar-collapse';
    var styleStuff = {};
    if (this.state.collapsing){
      navBar += ' collapsing';
      styleStuff.height = this.state.collapsed?'0px':' 184px';
    }else{
      navBar += this.state.collapsed?' collapse':' in';
      styleStuff.height = 'auto';
    }    

    return (
      <nav role="navigation" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button onClick={this._onClick} type="button" data-toggle="collapse" data-target=".navbar-collapse" className="navbar-toggle">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">Node Express Mongoose Demo</ Link>
          </div>
          <div className={navBar} style={styleStuff}>
            <ul className="nav navbar-nav">
              <li className="{% if (isActive('/articles/new')) %}active{% endif %}">
                  <Link to="/articles/new" className="navbar-brand">New</ Link>
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
                <a href="#">Home</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  },
  _onClick:function(){
    var that = this;
    this.setState({
      collapsing: true,
    });
    setTimeout(function(){ 
      that.setState({
        collapsed: !that.state.collapsed
      });
     }, 10);
    setTimeout(function(){ 
      that.setState({
        collapsing: false
      });
     }, 500);
  }

});

module.exports = Header;
