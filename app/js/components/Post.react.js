/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const TagsInput = require('react-tagsinput');
import { Link, History } from 'react-router';
const ArticleStore = require('../stores/ArticleStore');
const Loader = require('react-loader');


const Post = React.createClass({
  mixins: [ History ],
  
  props:{
    article: React.PropTypes.object.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired,
    saving: React.PropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    const opacity = this.props.saving?.2:1;//The opacity for the items behind the loader.
    const loader = this.props.saving?<Loader options={{top:'40%'}} />:null;//The loader itself.
    const article = this.props.article

    return <div className="row">
      {loader}
      <div style={{opacity: opacity}} className="col-md-8">
        <div  className="form-horizontal">
          <div className="form-group">
            <label  className="col-sm-2 control-label">Title</label>
            <div className="col-sm-10">
              <input onChange={this._handleChange.bind(this, 'title')} value={article.title} type="text" name="title" placeholder="Enter the title" className="form-control" id="title" />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Image</label>
            <div className="col-sm-10">
              <input onChange={this._handleChange.bind(this, 'image')} type="file" name="image" className="form-control" id="file" />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Body</label>
            <div className="col-sm-10">
              <textarea onChange={this._handleChange.bind(this, 'body')} value={article.body} rows="5" name="body" placeholder="Enter the article description" id="desc" cols="30" rows="10" className="form-control"/>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Tags</label>
            <div className="col-sm-10">
              <TagsInput onChange={this._handleChangeTags} name="tags" value={article.tags} />
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
      <div style={{opacity: opacity}} className="col-md-4">
        <img src="/img/twitter.png" alt="" />
      </div>
    </div>;
  },
  /**
   * Event handler for 'change' events coming the form
   */
  _handleChange: function(field, e){
    this.props.handleChange(field, e.target.value);
  },
  /**
   * Event handler for 'change' events coming from tag input plugin
   */
  _handleChangeTags: function(value) {
    this.props.handleChange('tags', value);
  },
  /**
   * Event handler from dom for forms
   * @param  {string} text
   */
  _save: function() {
    this.props.save()  
  }

});

module.exports = Post;
