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

  /**
   * @return {object}
   */
  render: function() {
    const article = this.props.article;
    const tags = _.map(article.tags, function(val, key){
      return (
          <span key={key}>
            <i className="muted fa fa-tag"></i>&nbsp;
            <span className="tag"> {val} </span>
         </span>
         )
    });
    const tagTitle = article.tags.length>0? (
        <span>
          &nbsp;
          -
          &nbsp;
          Tags:
        </span>
      ):null;
    const dateString = new Date(article.createdAt).toLocaleString();
    return (

      <div className="article">
        <h3>
          <Link to={"/articles/"+article._id} title={ article.title }>
            {article.title}
          </Link>
        </h3>
        <p>{article.body}</p>

        <span className="muted">{dateString}</span>
        &nbsp;
        -
        &nbsp;
        <span>Author:</span>
        <Link to={"/users/dd"}> {article.user.username} </Link>
        {tagTitle}
        {tags}
      </div>
    );
  }

});

module.exports = ArticleItem;
