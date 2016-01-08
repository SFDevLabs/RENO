/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const ArticleActions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Messages = require('./Messages.react');
const Loader = require('react-loader');

const ArticleItem = require('./ArticleItem.react');

/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState() {
  return {
    articles: ArticleStore.getAll(),
    initalGet: ArticleStore.didInitalGet(),
    collapsed: false,
    collapsing: false
  };
}


const ArticleSection = React.createClass({

  getInitialState: function() {
    return {
      initalGet: ArticleStore.didInitalGet()
    }
  },

  componentDidMount: function() {
    if (!this.state.initalGet){
      ArticleActions.getAll();
    }else{
      this.setState(getState());
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
    if (!this.state.initalGet){return <Loader />}

    var alertBox = 'fade alert-info';
    if (this.state.collapsing){
      alertBox += '  alert';
    }else{
      alertBox += this.state.collapsed?' ':' in alert';
    }


    var articles = [];
    var articlesData = this.state.articles;
    for (var key in articlesData) {
      articles.unshift(<ArticleItem key={key} article={articlesData[key]} />);
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
