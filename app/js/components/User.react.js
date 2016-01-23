/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const UserStore = require('../stores/UserStore');
const Actions = require('../actions/UserActions');
const Loader = require('react-loader');
const NotFound = require('./NotFound.react');

/**
 * Retrieve the current USER data from the UserStore
 */
function getState(id) {
  return {
    user: UserStore.getById(id)
  };
}

const User = React.createClass({

  getInitialState: function() {
    return getState(this.props.params.id);
  },

  componentDidMount: function() {
    if (!this.state.user){
      Actions.getById(this.props.params.id);
    }
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  render :function() {
    if (this.state.user===null){return <NotFound />} 
    else if (!this.state.user){return <Loader />}

    return <section className="container">
      <div className="page-header">
        <h1>User</h1>
      </div>
      <div className="content">
        <div className="row">
          <div className="col-md-8">
            <div className="meta">
                Username: &nbsp;
                <span>
                  {this.state.user.username}
                </span>
            </div>
            <div className="meta">
                Full Name: &nbsp;
                <span>
                  {this.state.user.name}
                </span>
            </div>
          </div>
        </div>
      </div>
    </section>;
  },

  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onChange: function() {
    this.setState(getState(this.props.params.id));
  },

})

module.exports = User;
