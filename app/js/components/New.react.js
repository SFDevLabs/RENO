/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const ArticleActions = require('../actions/ArticleActions');
const TagsInput = require('react-tagsinput');
const Actions = require('../actions/ArticleActions');
import { Link, History } from 'react-router';
const ArticleStore = require('../stores/ArticleStore');
const Loader = require('react-loader');


/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState(id) {
  var data = ArticleStore.getById(id)
  if (data){
    data.loading=false; //we are not loading since we have the data;
  } else if(id){
    data =  {
      loading : true
    }
  } else {
    data = {
      title: '',
      body: '',
      tags: [],
      isNew : true
    }
  }
  delete data.comments
  delete data.image
  delete data.createdAt
  delete data.user

  return data
}


const NewArticle = React.createClass({
  mixins: [ History ],
  getInitialState: function() {
    var id = this.props.params.id;
    return getState(id);
  },
  componentDidMount: function() {
    if(this.state.loading){
      var id = this.props.params.id;
      Actions.getById(id);
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
    if (this.state.loading){return <Loader />}

    return (
      <section className="container">
        <div className="page-header">
          <h1>title</h1>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="form-horizontal">
              <div className="form-group">
                <label  className="col-sm-2 control-label">Title</label>
                <div className="col-sm-10">
                  <input onChange={this._onChangeTitle} value={this.state.title} type="text" name="title" placeholder="Enter the title" className="form-control" id="title" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Image</label>
                <div className="col-sm-10">
                  <input onChange={this._onChange} type="file" name="image" className="form-control" id="file" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Body</label>
                <div className="col-sm-10">
                  <textarea onChange={this._onChangeBody} value={this.state.body} rows="5" name="body" placeholder="Enter the article description" id="desc" cols="30" rows="10" className="form-control"/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Tags</label>
                <div className="col-sm-10">
                  <TagsInput value={this.state.tags} onChange={this._onChangeTags} />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button onClick={this._save} className="btn btn-primary" type="submit">Save</button>
                  &nbsp;
                  <Link to="/" className="btn btn-link">Cancel</ Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <img src="/img/twitter.png" alt="" />
          </div>
        </div>
      </section>
    );
  },
  /**
   * Event handler for 'change' events coming from store
   */
  _onChange: function() {
    var newArticleId = ArticleStore.getNewArticleId();
    if (newArticleId){
      this.history.pushState(null, '/articles/'+newArticleId);
    }else{
      var id = this.props.params.id;
      this.setState(getState(id));
    }
  },
  /**
   * Event handler for 'change' events coming from the DOM
   */
  _onChangeTitle: function(event) {
    this.setState({
        title: event.target.value
    });
  },
  /**
   * Event handler for 'change' events coming from the DOM
   */
  _onChangeBody: function(event) {
    this.setState({
        body: event.target.value
    });
  },
  /**
   * Event handler for 'change' events coming from the DOM
   */
  _onChangeTags: function(value) {
    this.setState({
        tags: value
    });
  },
  /**
   * Event handler called within.
   * in different ways.
   * @param  {string} text
   */
  _save: function() {
    if (this.state.isNew){
      Actions.create(this.state);
    } else{
      Actions.update(this.state);
    }
    
  }

});

module.exports = NewArticle;
