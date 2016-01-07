/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const TodoActions = require('../actions/ArticleActions');
const Link = require('react-router').Link;

const Header = React.createClass({
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
            <a onClick={this._onClick}>Home</a>
          </li>
        </ul>
      </div>
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
