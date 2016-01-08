/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const Link = require('react-router').Link
const Actions = require('../actions/ArticleActions');
const Loader = require('react-loader');

const CommentItem = React.createClass({
  props:{
    comment: React.PropTypes.object.isRequired,
    articleId: React.PropTypes.string.isRequired,
  },
  getInitialState: function() {
    return {
      loading: false
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      loading:false
    })
  },
  render :function() {
    const comment = this.props.comment
    const opacity = this.state.loading?.2:1;
    const loader = this.state.loading?<Loader options={{top:'40%'}} />:null;
    const dateString = new Date(comment.createdAt).toLocaleString();

    return (
      <div style={{position:'relative'}} className="comment">
        {loader}
        <p style={{opacity: opacity}}>
          <a href="">{comment.user.username}</a>
          :&nbsp;
          {comment.body}
        </p>
        <div style={{opacity: opacity}} className="form-inline">
          <input type="hidden" name="_csrf" value="" />
          <span className="muted">{dateString}</span>
          <input type="hidden" name="_method" value="DELETE" />
          <button onClick={this._destroy} className="btn btn-danger btn-link error" type="submit">delete</button>
        </div>
      </div>
    )
  },

  /**
   * Event handler called within.
   * @param  {string} text
   */
  _destroy: function() {
    var commentId = this.props.comment._id
    var id = this.props.articleId;
    if (id){
      Actions.destroyComment(id, commentId);
      this.setState({
          loading: true
      });
    }
  }

})

module.exports = CommentItem;
