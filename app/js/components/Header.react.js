/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/UserActions');
const UserStore = require('../stores/UserStore');
import { Link, History } from 'react-router';

/**
 * Retrieve the current USER data from the UserStore
 */
function getState() {
  return {
    profile: UserStore.getProfile(),
    loading: false
  };
}

const Header = React.createClass({

  mixins: [ History ],

  getInitialState:function(){
    return {
      collapsed: true,
      collapsing: false,
      loading: true
    };
  },

  componentDidMount: function() {
    Actions.getProfile();
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },
  /**
   * @return {object}
   */
  render: function() {
    const profile = this.state.profile? this.state.profile:{};
    const isLoggedIn = !!profile._id

    var navBar = 'navbar-collapse';
    var styleCollapse = {};
    if (this.state.collapsing){
      navBar += ' collapsing';
      styleCollapse.height = this.state.collapsed?'0px':' 223px';
    }else{
      navBar += this.state.collapsed?' collapse':' in';
      styleCollapse.height = 'auto';
    } 

    const navItems= isLoggedIn?[
    <li key={0} className={this._activeClass('/articles/new')}>
        <Link to="/articles/new">New</ Link>
    </li>,

    <li key={1}>
      <a href="/logout" title="logout">Logout</a>
    </li>
    ]:
    [<li key={0} >
      <a href="/login" title="Login">Login</a>
    </li>,
    <li key={1} >
      <a href="/signup" title="Login">Signup</a>
    </li>] 

    const profileLink = isLoggedIn?
            <li>
              <Link to={ "/users/"+profile._id}>{profile.username}</Link>
            </li>:null;
    const navBarJSX = !this.state.loading?
        <div className={navBar} style={styleCollapse}>
          <ul className="nav navbar-nav">
            {navItems}
          </ul>

          <ul className="nav navbar-nav navbar-right">
            {profileLink}
          </ul>
        </div>:
        null

    return <nav role="navigation" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button onClick={this._onClick} type="button" data-toggle="collapse" data-target=".navbar-collapse" className="navbar-toggle">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link to="/" className="navbar-brand">RENO</ Link>
        </div>
        {navBarJSX}
      </div>
    </nav>;
  },
  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onChange: function() {
    this.setState(getState());
  },
  /**
   * _onClick - Boostrap functions for collapsing the nav bar.
   * @return {[type]} [description]
   */
  _onClick:function(){
    // Simple logic to flip classes for the bootrap animation on the collapse navbar.
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
  },
  _activeClass: function(path){
    return this.context.history.isActive(path)?'active':null;
  }

});

module.exports = Header;
