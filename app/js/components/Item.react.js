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
var TextInput = require('./TextInput.react');
import { Link } from 'react-router';

var classNames = require('classnames');

var TodoItem = React.createClass({

  propTypes: {
   article: ReactPropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var article = this.props.article;

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    var dateString = new Date(article.createdAt).toLocaleString();
    return (

      <div className="article">
        <h3>
          <Link to={"/articles/"+article._id} title={ article.title }>
            {article.title}
          </Link>
        </h3>
        <p>{article.body}</p>

        <span className="muted">{dateString}</span>
      </div>
    );
  },

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  _onClick: function(text) {

  }

});

module.exports = TodoItem;
