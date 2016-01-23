/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/UserActions');
const UserStore = require('../stores/UserStore');
import { Link } from 'react-router';

import { Navbar, MenuItem, NavItem, Nav, NavDropdown} from 'react-bootstrap'; 
import { LinkContainer } from 'react-router-bootstrap'; 


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
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },

  getInitialState:function(){
    return {
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
    const isLoggedIn = !!profile._id;
    const loading = this.state.loading;
    // Create the right side based on logged in state. (Notice the react.js required unique keys placed in each item)
    var navItemsLeft = isLoggedIn?
      [<LinkContainer key={0} className={this._activeClass('/articles/new')} to='/articles/new'>
        <NavItem>New</NavItem>
      </LinkContainer>]
      :[];
    //Add Github link
    navItemsLeft.push(<NavItem key={1} href="https://github.com/sfdevlabs/reno">GitHub Repo</NavItem>);
    // Create the left side based on logged in state.
    var navItemsRight = isLoggedIn?
          <NavDropdown eventKey={2} className={this._activeClass('/users/'+profile._id)} title={profile.username} id="basic-nav-dropdown">
            <LinkContainer key={2.0} to={'/users/'+profile._id}>
              <MenuItem >Profile</MenuItem>
            </LinkContainer>
            <MenuItem eventKey={2.1} href="/logout" >Logout</MenuItem>
          </NavDropdown>:
          [<NavItem key={2} eventKey={3} href="/login">Login</NavItem>,
          <NavItem key={3} eventKey={3} href="/signup">Signup</NavItem>]
          
    const navBar = !loading?
    <Navbar.Collapse>
      <Nav>
        {navItemsLeft}
      </Nav>
      <Nav pullRight>
        {navItemsRight}
      </Nav>
    </Navbar.Collapse>:null;

    return <Navbar fluid fixedTop style={{padding: "0px 15px"}} >
      <div className="container">
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" className="navbar-brand">RENO</ Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {navBar}
      </div>
    </Navbar>
  },
  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onChange: function() {
    this.setState(getState());
  },
  /**
   * [_activeClass Is this link the active href]
   * @param  {string} path 
   * @return {[type]}      [description]
   */
  _activeClass: function(path){
    return this.context.router.isActive(path)?'active':null;
  }

});

module.exports = Header;
