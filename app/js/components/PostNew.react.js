/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Loader = require('react-loader');
const Post = require('./Post.react');
const Messages = require('./Messages.react');
const _ = require('lodash');

/**
 * Blank new article
 */
function getState(id) {
  return {
      title: '',
      body: '',
      tags: []
    }
}


const Update = React.createClass({
  getInitialState: function() {
    var id = this.props.params.id;
    return getState(id);
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
    const article = this.state;
    const blankMessage = this.state._messages? (
      <Messages messages={this.state._messages} type="danger" />
      ) : null; //Rendering a warning message.

    return (
      <section className="container">
        <div className="page-header">
          <h1>New</h1>
        </div>
        {blankMessage}
        <Post article={this.state} handleChange={this._handleChange} save={this._save} saving={this.state._saving} />
      </section>
    );
  },
  /**
   * Event handler for 'change' events coming from store
   */
  _onChange: function() {
    var id = this.props.params.id;
    this.setState(getState(id));
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
    const article = this.state;
    if (article.title.length>0 && article.body.length>0){ //The title and body must be filled.
      Actions.create(article);
      this.setState({
        _saving:true
      });
    }else{//We need to set a message on the state to render a message telling the user to fill in more fields.
      this.setState({
        _messages: [{message:"Title and Body cannot be blank."}]
      })
    }
  }

});

module.exports = Update;
