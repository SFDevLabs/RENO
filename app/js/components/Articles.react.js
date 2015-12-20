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


var ArticleItem = require('./ArticleItem.react');

/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState() {
  return {
    allArticles: ArticleStore.getAll(),
    initalGet: ArticleStore.didInitalGet(),
    collapsed: false,
    collapsing: false
  };
}


var ArticleSection = React.createClass({

  getInitialState: function() {
    return getState();
  },

  componentDidMount: function() {
    if (!this.state.initalGet){
      ArticleActions.getAll();
    }
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },
  /**
   * @return {object}
   */
  render: function() {

    var alertBox = 'fade alert-info';
    if (this.state.collapsing){
      alertBox += '  alert';
    }else{
      alertBox += this.state.collapsed?' ':' in alert';
    }

    var allArticles = this.state.allArticles;
    var articles = [];

    for (var key in allArticles) {
      articles.push(<ArticleItem key={key} article={allArticles[key]} />);
    }

    return (
      <section className="container">
        <div className="page-header">
          <h1>Articles</h1>
        </div>
        <Messages messages={[{message:"Some Info"}]} type="success" />
        <div className="content" id="todo-list">{articles}</div>
        <div className="content pagination">
          <a type="button" className="btn btn-primary active" >
            More        
          </a>
        </div>
      </section>
    );
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    this.setState(getState());
  },
  _onClick:function(){
    var that = this;
    this.setState({
      collapsing: true,
    });

    setTimeout(function(){ 
      that.setState({
        collapsed: !that.state.collapsed
      });
     }, 10);
    setTimeout(function(){ 
      that.setState({
        collapsing: false
      });
     }, 500);
  }

});

module.exports = ArticleSection;
