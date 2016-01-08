/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Messages = require('./Messages.react');
const Comments = require('./Comments.react');
const Loader = require('react-loader');

import { Link, History } from 'react-router';


/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState(id) {
  return {
    article: ArticleStore.getById(id)
  };
}
const ArticleSection = React.createClass({
  mixins: [ History ],

  getInitialState: function() {
    return getState(this.props.params.id);
  },

  componentDidMount: function() {
    if (!this.state.article){
      Actions.getById(this.props.params.id);
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
    if (!this.state.article){return <Loader />}
    const article = this.state.article;
    const dateString = new Date(article.createdAt).toLocaleString();
    const messages = false? (<Messages messages={[{message:"Some Info"}]} type="success" />) : null;

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
        {messages}        
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
          <div>
            <br />
            <input type="hidden" name="_csrf" value="" />
            <Link  to={'/articles/'+article._id+'/edit'} title="edit" className="btn btn-default">
              Edit
            </Link>
            &nbsp;&nbsp;
            <input type="hidden" name="_method" value="DELETE" />
            <button onClick={this._delete} className="btn btn-danger" type="submit">Delete</button>
          </div>
          <Comments comments={article.comments} id={article._id} />
        </div>
      </section>
    )
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    var state = getState(this.props.params.id)
    if (!state.article){
      this.history.pushState(null, '/');
    }else{
      this.setState(state);
    }
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _delete: function() {
    Actions.destroy(this.state.article._id);
  },


});

module.exports = ArticleSection;
