/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Post = require('./Post.react');
const Messages = require('./Messages.react');
import { RouteContext } from 'react-router';

const Update = React.createClass({
  
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
    return {
      title: '',
      body: '',
      tags: []
    }
  },
  componentDidMount: function() {
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    const blankMessage = this.state._messages? (
      <Messages messages={this.state._messages} type="danger" />
      ) : null; //Rendering a warning message.

    return <section className="container">
      <div className="page-header">
        <h1>New</h1>
      </div>
      {blankMessage}
      <Post
        article={this.state}
        handleChange={this._handleChange}
        save={this._save}
        saving={this.state._saving} />
    </section>;
  },
  /**
   * Event handler for 'change' events coming from store
   */
  _onChange: function() {
    const newArticleId = ArticleStore.getNewArticleId();
    const errors = ArticleStore.getErrors()
    if (newArticleId){
      this.context.router.push('/articles/'+newArticleId);
    } else {
      this.setState({
        _messages: errors.length>0?errors:['Something went wrong'],
        _saving: false
      });
    }
  },
  /**
   * Event handler for 'change' events coming from the DOM
   */
  _handleChange: function(field, value) {
    var nextState = {};
    nextState[field]=value;
    this.setState(nextState)
  },
  /**
   * Event handler called within.
   * in different ways.
   * @param  {string} text
   */
  _save: function() {
    Actions.create(this.state);
    this.setState({
      _saving: true
    });
  }

});

module.exports = Update;
