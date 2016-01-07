/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const ReactPropTypes = React.PropTypes;
const ArticleActions = require('../actions/ArticleActions');
import { Link } from 'react-router';

const classNames = require('classnames');

const ArticleItem = React.createClass({

  propTypes: {
   article: React.PropTypes.object.isRequired,
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

module.exports = ArticleItem;
