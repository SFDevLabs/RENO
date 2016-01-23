/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
import { Link } from 'react-router';
const ArticleStore = require('../stores/ArticleStore');
const Loader = require('react-loader');
const Post = require('./Post.react');
const Messages = require('./Messages.react');
const _ = require('lodash');

/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState(id) {
  const state = ArticleStore.getById(id);
  return state?state:null;
}


const Update = React.createClass({
  contextTypes:{
    router: React.PropTypes.object.isRequired
  },  
  getInitialState: function() {
    return getState(this.props.params.id);
  },
  componentDidMount: function() {
    ArticleStore.addChangeListener(this._onChange);
    if(!this.state){
      var id = this.props.params.id;
      Actions.getById(id);
    }
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    if (!this.state){return <Loader />}
    const blankMessage = this.state._messages? (<Messages messages={this.state._messages} type="danger" />) : null;

    return <section className="container">
        <div className="page-header">
          <h1>Edit</h1>
        </div>
        {blankMessage}
        <Post article={this.state} handleChange={this._handleChange} save={this._save} saving={this.state._saving} />
    </section>;
  },
  /**
   * Event handler for 'change' events coming from store
   */
  _onChange: function() {
    const errors = ArticleStore.getErrors();
    const newArticleId = ArticleStore.getNewArticleId();
    if (newArticleId){
      this.context.router.push('/articles/'+newArticleId);
    } else if (errors.length>0) {
      this.setState({
        _messages: errors,
        _saving: false
      });
    } else {
      this.setState(getState(this.props.params.id));
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
    var selectedItems = ['title', 'body', 'tags'];
    if (this.state.image instanceof File){selectedItems.push('image')}
    Actions.update(
      this.state._id, 
      _.pick(this.state, selectedItems)
    );
    this.setState({
      _saving: true
    });
  }
});

module.exports = Update;
