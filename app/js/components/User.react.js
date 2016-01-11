/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Link = require('react-router').Link
const UserStore = require('../stores/ArticleStore');

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

  render :function() {
    return <section className="container">
      <div className="page-header">
        <h1>title</h1>
      </div>
      {this.state.user}
      <Link to="/">Home</Link>
    </section>;
  }
})

module.exports = User;
