/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
import { Link } from 'react-router';

const ArticleItem = React.createClass({

  propTypes: {
   article: React.PropTypes.object.isRequired,
  },

  /**
   * @return {object}
   */
  render: function() {
    const article = this.props.article;
    const overflow = {overflow: 'hidden', textOverflow: 'ellipsis'};

    const tags = _.map(article.tags, function(val, key){
      return <span key={key}>
            <i className="muted fa fa-tag"></i>&nbsp;
            <Link to={"/tags/"+encodeURIComponent(val)} className="tag">{val}</Link>
            &nbsp; 
        </span>;
    });

    const imageBadge = (article.image && article.image.files && article.image.files.length)?
      <span>
        <span>
          &nbsp;
          -
          &nbsp;
        </span>
        <span title="Post has a picture!"className="glyphicon glyphicon-picture" aria-hidden="true"></span>
      </span>:
      null;

    const tagTitle = article.tags.length > 0 ?//Spacer and tag title if we have 1 or more tags
      <span>
        &nbsp;
        -
        &nbsp;
        Tags:
      </span>
    :null;
    const dateString = new Date(article.createdAt).toLocaleString();
    return <div className="article" >
      <h3 style={overflow} >
        <Link to={"/articles/"+article._id}>
          {article.title}
        </Link>
      </h3>
      <p style={overflow}>{article.body}</p>

      <span className="muted">{dateString}</span>
      &nbsp;
      -
      &nbsp;
      <span>Author: </span>
      <Link to={"/users/"+article.user._id}> 
        {article.user.username} 
      </Link>
      {tagTitle}
      {tags}
      {imageBadge}
    </div>;
  }

});

module.exports = ArticleItem;
