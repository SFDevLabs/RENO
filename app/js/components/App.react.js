/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var ArticleStore = require('../stores/ArticleStore');

/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getTodoState() {
  return {
    allTodos: ArticleStore.getAll(),
    areAllComplete: ArticleStore.areAllComplete(),
    initalGet: ArticleStore.didInitalGet()
  };
}

var TodoApp = React.createClass({

  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>
        <Header />

        <MainSection
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
          initalGet= {this.state.initalGet}/>
        <Footer allTodos={this.state.allTodos} />
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    this.setState(getTodoState());
  }

});

module.exports = TodoApp;
