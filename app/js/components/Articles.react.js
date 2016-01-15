/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const _ = require('lodash');
const Actions = require('../actions/ArticleActions');
const ArticleStore = require('../stores/ArticleStore');
const Loader = require('react-loader');

const ArticleItem = require('./ArticleItem.react');
const take = 5
const initalSkip = 0;

/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState() {
  return {
    articles: ArticleStore.getAll(),
    total: ArticleStore.getTotal(),
    initalGet: ArticleStore.didInitalGet(),
    loading:false
  };
}


const ArticleSection = React.createClass({

  getInitialState: function() {
    return getState()
  },

  componentDidMount: function() {
    if (!this.state.initalGet){ //This flag tells of if we have loaded the most recent articles.
      const clearStore = true //We will clear the store so we are sure we load the most recent articles.
      Actions.getList(take, initalSkip, clearStore);
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

    const articlesData = this.state.articles;
    const count = Object.keys(articlesData).length //Number of articles we will render.
    
    const opacity = this.state.loading?.2:1; //The opacity for the items behind the loader.
    const loader = this.state.loading?<Loader />:null; //The loader itself.


    const moreButton = count < this.state.total ? (
          <a style={{opacity:opacity}} onClick={this._onClickMore} type="button" className="btn btn-primary active" >
            Load More    
          </a>
          ):null;

    const articles = _.chain(articlesData)//Lodash functions to sort and map our article items
      .sortBy(function(n){return -new Date(n.createdAt);}) //reverse cronological by creation
      .map(function(val, key){
        return <ArticleItem key={key} article={val} />
      })
      .value();

    return <section className="container">
      <div className="page-header">
      <button onClick={this._onRefresh} className="pull-right btn btn-default">
        <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
      </button>
        <h1>Articles</h1>
      </div>
      <div className="content" >{articles}</div>
      <div className="row" styl style={{position:'relative', margin:'15px 0px'}} >
        {loader}
        {moreButton}
        &nbsp;
        <div style={{opacity:opacity}} className="badge pull-right">Showing {count} of {this.state.total}</div>
      </div>
    </section>;
  },
  /**
   * Event handler for 'change' events coming from the ArticleStore
   */
  _onChange: function() {
    this.setState(getState());
  },
  /**
   * Event handler for 'more' button coming from the DOM
   */
  _onClickMore:function(){
    const skip = Object.keys(this.state.articles).length
    Actions.getList(take, skip);
    this.setState({
      loading:true
    });
  },
  /**
   * Event handler for 'refresh' button coming from the DOM
   */
  _onRefresh:function(){
    const clearStore = true //We will clear the store so we are sure we load the most recent articles.
    Actions.getList(take, initalSkip, clearStore);
    this.setState({
      loading:true,
      initalGet: false
    });
  }

});

module.exports = ArticleSection;
