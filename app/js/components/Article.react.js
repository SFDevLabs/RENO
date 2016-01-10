/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/Actions');
const ArticleStore = require('../stores/ArticleStore');
const Comments = require('./Comments.react');
const NotFound = require('./NotFound.react');

const Loader = require('react-loader');
const _ = require('lodash');

import { Link, History } from 'react-router';


/**
 * Retrieve the current ARTICLES data from the ArticleStore
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
    if (this.state.articleNotFound){return <NotFound />} 
    else if (!this.state.article){return <Loader />}

    const article = this.state.article;
    const dateString = new Date(article.createdAt).toLocaleString();
    const username = article.user? article.user.username:null;
    const comments =  article.comments?<Comments comments={article.comments} id={article._id} />:null;
             


    const tags = _.map(article.tags, function(val, key){
      return (
          <span key={key}>
            <i className="muted fa fa-tag"></i>&nbsp;
            <a className="tag"> {val} </a>
         </span>
         )
    });
    
    return <section className="container">
      <div className="page-header">
        <h1>{article.title}</h1>
      </div>
      <div className="content">
        <div className="row">
          <div className="col-md-8">
            <p>{ article.body }</p>
            <div className="meta">
                Author: &nbsp;
                <a href="#">
                  {username}
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
        {comments}
      </div>
    </section>;
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    var state = getState(this.props.params.id)
    if (!state.article){
      this.setState({
        articleNotFound: true
      });
    }else{
      this.setState(state);
    }
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _delete: function() {
    this.setState(getState(null));//Set page to loading
    Actions.destroy(this.state.article._id);
  },


});

module.exports = ArticleSection;
