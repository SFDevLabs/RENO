/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const Link = require('react-router').Link


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
      styleStuff.height = this.state.collapsed?'0px':' 223px';
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
            <Link to="/" className="navbar-brand">RENO</ Link>
          </div>
          <div className={navBar} style={styleStuff}>
            <ul className="nav navbar-nav">
                <li className="{% if (isActive('/articles/new')) %}active{% endif %}">
                    <Link to="/articles/new">New</ Link>
                </li>

                <li className="{% if (isActive('/users/' + req.user.id )) %}active{% endif %}">
                  <Link to="/users/5671cfb78705fe7e4d9e954a">Profile</ Link>
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
                <a href="#">USERNAME GOES HERE</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
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
  }

});

module.exports = Header;
