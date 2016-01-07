/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const ArticleActions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Messages = require('./Messages.react');
const Actions = require('../actions/ArticleActions');

import { Link } from 'react-router';


/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState(id) {
  return {
    article: ArticleStore.getById(id)
  };
}

const ArticleSection = React.createClass({

  getInitialState: function() {
    return getState(this.props.params.id);
  },

  componentDidMount: function() {
    if (!this.state.article){
      ArticleActions.getById(this.props.params.id);
    }
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },
  /**
   * @return {object}
   */
  render :function() {
    if (!this.state.article){return <div>loading</div>}
    const article = this.state.article;
    const dateString = new Date(article.createdAt).toLocaleString();
    const comments= [];
    for (var i = article.comments.length - 1; i >= 0; i--) {
      var comment = article.comments[i];
      comments.push((
          <div key={i} className="comment">
            <p>
              <a href="">{comment.user.username}</a>
              :&nbsp;
              {comment.body}
            </p>
            <div role="form" method="post" action="" onsubmit="return confirm('Are you sure?')" className="form-inline">
              <input type="hidden" name="_csrf" value="" />
              <span className="muted">Dec 17, 2015 02:45 am</span>
              <input type="hidden" name="_method" value="DELETE" />
              <button className="btn btn-danger btn-link error" type="submit">delete</button>
            </div>
          </div>
          ));
    }
    var tags = [];
    for (var i = article.tags.length - 1; i >= 0; i--) {
      tags.push(
        (<span key={i}>
            <i className="muted fa fa-tag"></i>&nbsp;
            <a className="tag"> {article.tags[i]} </a>
         </span>)
      )
    };

    return (
      <section className="container">
        <div className="page-header">
          <h1>{article.title}</h1>
        </div>
        <Messages messages={[{message:"Successfully created article!"}]} type="success" />
        
        <div className="content">
          <div className="row">
            <div className="col-md-8">
              <p>{ article.body }</p>
              <div className="meta">
                  Author: &nbsp;
                  <a href="#">
                    {article.user.username}
                  </a>
                  <p>
                    Tags: &nbsp;
                      {tags}
                      &nbsp;&nbsp;
                  </p>
                <span className="muted">{dateString}</span>
              </div>
            </div>
            <div className="col-md-4">
                <img src="/img/twitter.png" alt="" />
            </div>
          </div>
          <form action="" method="post" onsubmit="return confirm('Are you sure?')">
            <br />
            <input type="hidden" name="_csrf" value="" />
            <Link  to={'/articles/'+article._id+'/edit'} title="edit" className="btn btn-default">
              Edit
            </Link>
            &nbsp;&nbsp;
            <input type="hidden" name="_method" value="DELETE" />
            <button className="btn btn-danger" type="submit">Delete</button>
          </form>
          <br />
          <h3>Comments</h3>
          {comments}
          <div>
            <input type="hidden" name="_csrf" value="" />
            <div className="form-group">
              <textarea onChange={this._onChangeNewComment} value={this.state.comment} rows="6" name="body" placeholder="Add your comment" cols="30" rows="6" className="form-control" />
            </div>
            <button onClick={this._save}  className="btn btn-primary" type="submit">Add comment</button>
          </div>

        </div>
      </section>
    )
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    this.setState(getState(this.props.params.id));
  },
  /**
   * Event handler for 'change' events coming from the DOM
   */
  _onChangeNewComment: function(event) {
    this.setState({
        comment: event.target.value
    });
  },
  /**
   * Event handler called within.
   * @param  {string} text
   */
  _save: function() {
    var comment = this.state.comment;
    var article = this.state.article;
    if (comment && article){
      Actions.createComment(article._id, {body:comment});
    }
  }

});

module.exports = ArticleSection;
