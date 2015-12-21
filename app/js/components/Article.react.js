/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ArticleActions = require('../actions/ArticleActions');
var ArticleStore = require('../stores/ArticleStore');
var Messages = require('./Messages.react');

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
            <form role="form" method="post" action="" onsubmit="return confirm('Are you sure?')" className="form-inline">
              <input type="hidden" name="_csrf" value="" />
              <span className="muted">Dec 17, 2015 02:45 am</span>
              <input type="hidden" name="_method" value="DELETE" />
              <button className="btn btn-danger btn-link error" type="submit">delete</button>
            </form>
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
            <a href="" title="edit" className="btn btn-default">
              Edit
            </a>
            &nbsp;&nbsp;
            <input type="hidden" name="_method" value="DELETE" />
            <button className="btn btn-danger" type="submit">Delete</button>
          </form>
          <br />
          <h3>Comments</h3>
          {comments}
          <form method="post" action="" role="form">
            <input type="hidden" name="_csrf" value="" />
            <div className="form-group">
              <textarea rows="6" name="body" placeholder="Add your comment" id="" cols="30" rows="6" className="form-control"></textarea>
            </div>
            <button className="btn btn-primary" type="submit">Add comment</button>
          </form>

        </div>
      </section>
    )
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    this.setState(getState(this.props.params.id));
  }

});

module.exports = ArticleSection;
