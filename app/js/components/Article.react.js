/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Comments = require('./Comments.react');
const NotFound = require('./NotFound.react');
const Messages = require('./Messages.react');

const Loader = require('react-loader');
const _ = require('lodash');

import { Link } from 'react-router';

/**
 * Retrieve the current ARTICLES data from the ArticleStore
 */
function getState(id) {
  return {
    article: ArticleStore.getById(id)
  };
}
const ArticleSection = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return getState(this.props.params.id); //Using the antipattern to pass the id from the URL
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
    if (this.state.article===null){return <NotFound />}//null means the api gave us a 404.
    else if (!this.state.article){return <Loader />}//undefined means that no request for the article has been made.


    const article = this.state.article;
    const dateString = new Date(article.createdAt).toLocaleString();             
    const deleting = this.state._deleting ? <Loader options={{top:'10%'}} />:null; //The loader itself.
    const overflow = {overflow: 'hidden', textOverflow: 'ellipsis'};

    const mainArticleRow = {
      opacity: this.state._deleting ? .2 : 1, //The opacity for the items behind the loader.
      minHeight:'210px' //Min height besed on image size for the articles.
    }

    const errorMessage = this.state._messages? (
      <Messages messages={this.state._messages} type="warning" />
      ) : null; //Rendering a warning message.

    const tags = _.map(article.tags, function(val, key){
      return (
          <span key={key}>
            <i className="muted fa fa-tag"></i>&nbsp;
            <Link to={"/tags/"+val} className="tag">{val}</Link>
         </span>
         )
    });

    //Logic create image
    var img 
    if (article.image && article.image.files && article.image.files.length){
      var parser = document.createElement('a');// Stripping the protocol from the link for proper link structure
      parser.href = article.image.cdnUri;
      const cdnUri = parser.host + parser.pathname
      img =
        <a href={article.image.cdnUri + '/detail_' + article.image.files[0]} target="_blank" >
          <img src = {'//' + cdnUri + 'mini_' + article.image.files[0]} alt="" />
        </a>
    }else{
      img = null;
    }

    return <section className="container">
      <div className="page-header">
        <button onClick={this._onRefresh} className="pull-right btn btn-default">
          <span className="glyphicon glyphicon-refresh"></span>
        </button>
        <h1 style={overflow} >{article.title}</h1>
      </div>
      {errorMessage}
      <div className="content" style={{position:'relative'}}>
        {deleting}
        <div className="row" style={mainArticleRow}>
          <div style={overflow} className="col-md-8">
            <p>{ article.body }</p>
            <div className="meta">
                Author: &nbsp;
                <Link to={"/users/"+article.user._id}>
                  {article.user.username}
                </Link>
                <p>
                  Tags: &nbsp;
                    {tags}
                    &nbsp;&nbsp;
                </p>
              <span className="muted">{dateString}</span>
            </div>
          </div>
          <div className="col-md-4">
            {img}
          </div>
        </div>
        <div>
          <br />
          <Link  to={"/articles/"+article._id+"/edit"} title="edit" className="btn btn-default">
            Edit
          </Link>
          &nbsp;&nbsp;
          <button onClick={this._delete} className="btn btn-danger" type="submit">Delete</button>
        </div>
        <Comments comments={article.comments} id={article._id} />
      </div>
    </section>;
  },

  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    const state = getState(this.props.params.id)
    const errors = ArticleStore.getErrors()
    if (errors.length>0) { //Errors from page action need to be displayed.
      this.setState({
        _messages: errors,
        _deleting: false
      });
    } else if (!state.article && this.state._deleting) { //A delete request was fired, we have no errors and we have no article in the store. Navigate to home.
      this.context.router.push('/');
    } else {
      this.setState(state);
    }
  },
  /**
   * Event handler for 'change' events coming from the DOM
   */
  _delete: function() {
    this.setState({
      _deleting: true
    });
    Actions.destroy(this.state.article._id); //Fire the destroy event
  },
  /**
   * Event handler for 'refresh' button coming from the DOM
   */
  _onRefresh:function(){
    Actions.getById(this.props.params.id);
    this.setState({
      article:undefined
    });
  }

});

module.exports = ArticleSection;
