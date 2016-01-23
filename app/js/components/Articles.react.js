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
const take = 20

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
    const tag = this.props.params.tag
    const initalSkip = 0;

    if (this.state.initalGet && tag === this.state.tag){ //This flag tells of if we have hit the list API for this query.
      this.setState(getState());
    } else {
      this._fetch(tag, initalSkip);
    }
    ArticleStore.addChangeListener(this._onChange);
  },



  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    const tag = nextProps.params.tag
    if (tag!==this.state.tag) { //If we recive props from the router we need to refetch!
      this.setState({
        initalGet: false,
        tag:tag
      });
      const clearStore = true //We will clear the store so we are sure we load the most recent articles.
      const skip = 0;
      this._fetch(tag, skip, clearStore)
    } 
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

    const tagTitle = this.props.params.tag? ( <span> - {this.props.params.tag}</span>):null;
    
    return <section className="container">
      <div className="page-header">
      <button onClick={this._onRefresh} className="pull-right btn btn-default">
        <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
      </button>
        <h1>Articles{tagTitle}</h1>
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
  _fetch:function(tag, skip, clearStore){
    if (tag) {
        this.setState({tag: tag})
        Actions.getListByTag(tag, take, skip, clearStore);
      } else {
        Actions.getList(take, skip, clearStore);
    }
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
    const tag = this.state.tag 
    this._fetch(tag, skip);
    this.setState({
      loading:true
    });
  },
  /**
   * Event handler for 'refresh' button coming from the DOM
   */
  _onRefresh:function(){
    const clearStore = true //We will clear the store so we are sure we load the most recent articles.
    const tag = this.state.tag
    const skip = 0;
    this._fetch(tag, skip, clearStore)
    this.setState({
      loading:true,
      initalGet: false
    });
  }
});

module.exports = ArticleSection;
