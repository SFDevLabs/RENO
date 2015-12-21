/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const ArticleActions = require('../actions/ArticleActions');
const TagsInput = require('react-tagsinput');
const Actions = require('../actions/ArticleActions');
import { Link, History } from 'react-router';
const ArticleStore = require('../stores/ArticleStore');

const csrf = document.getElementById('csrf');
const csrfToken = csrf?csrf.content:'';


/**
 * Retrieve the current ARTICLE data from the ArticleStore
 */
function getState(id) {
  return {
    article: ArticleStore.getById(id)
  };
}


const NewArticle = React.createClass({
 mixins: [ History ],
 getInitialState: function() {

    var id = this.props.params.id;
    var data;
    if (id){
      data =  ArticleStore.getById(id)
    } else {
      data = {
          title: '',
          body: '',
          tags: [],
          _csrf:csrfToken
      }
    }    
    return data;
  },
  componentDidMount: function() {
    var id = this.props.params.id;
    if(id){
      ArticleStore.getById(id)
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
    var pending = ArticleStore.getPendingState();
    var newArticleId = ArticleStore.getNewArticleId();
    if (!pending && newArticleId){
      this.history.pushState(null, '/articles/'+newArticleId);
    }else{
      this.setState({pending:pending});
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
    Actions.create(this.state);

    //Actions.update(this.state);
  },



});

module.exports = NewArticle;
