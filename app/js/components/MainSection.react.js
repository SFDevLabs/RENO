/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var ArticleActions = require('../actions/ArticleActions');
var Item = require('./Item.react');
var TextInput = require('./TextInput.react');

var MainSection = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired,
    initalGet: ReactPropTypes.bool.isRequired,
  },
  componentDidMount: function() {
    if (!this.props.initalGet){
      ArticleActions.getAll();
    }
  },
  /**
   * @return {object}
   */
  render: function() {

    var allTodos = this.props.allTodos;
    var todos = [];

    for (var key in allTodos) {
      todos.push(<Item key={key} todo={allTodos[key]} />);
    }

    return (
      <section id="main">
        <TextInput
          id="list"
          placeholder="What needs to be done?"
          onSave={this._onSave}/>
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={this.props.areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    ArticleActions.toggleCompleteAll();
  },
  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param {string} text
   */
  _onSave: function(text) {
    if (text.trim()){
      ArticleActions.create(text);
    }
  }

});

module.exports = MainSection;
