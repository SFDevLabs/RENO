/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');

const Comments = React.createClass({

  props:{
  	comments: React.PropTypes.func.isRequired,
  	id: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
    	comment: ''
    }
  },

  render :function() {
    const commentsData = this.props.comments;

    const comments= [];
    for (var i = commentsData.length - 1; i >= 0; i--) {
      var comment = commentsData[i];
      comments.push((
          <div key={i} className="comment">
            <p>
              <a href="">{comment.user.username}</a>
              :&nbsp;
              {comment.body}
            </p>
            <div role="form" method="post" action="" onsubmit="return confirm('Are you sure?')" className="form-inline">
              <input type="hidden" name="_csrf" value="" />
              <span className="muted">Dec 17, 2015 02:45 am</span>
              <input type="hidden" name="_method" value="DELETE" />
              <button onClick={this._destroy} className="btn btn-danger btn-link error" type="submit">delete</button>
            </div>
          </div>
          ));
    }
    return (
      <div>
          <h3>Comments</h3>
          {comments}
          <div>
            <input type="hidden" name="_csrf" value="" />
            <div className="form-group">
              <textarea onChange={this._onChangeNewComment} value={this.state.comment} rows="6" name="body" placeholder="Add your comment" cols="30" rows="6" className="form-control" />
            </div>
            <button onClick={this._save}  className="btn btn-primary" type="submit">Add comment</button>
          </div>
      </div>
    )
  },

  /**
   * Event handler for 'change' events coming from the DOM
   */
  _onChangeNewComment: function(event) {
    this.setState({
        comment: event.target.value
    });
  },

  /**
   * Event handler called within.
   * @param  {string} text
   */
  _save: function() {
    var comment = this.state.comment;
    var id = this.props.id;
    if (comment && id){
      Actions.createComment(id, {body:comment});
      //Reset the comments to an empty string
      this.setState({
        comment: ''
      });
    }
  },

  /**
   * Event handler called within.
   * @param  {string} text
   */
  _destroy: function() {
    var commentId = this.props.comments[0]._id
    var id = this.props.id;
    if (id){
      Actions.destroyComment(id, commentId);
    }
  }

  
})

module.exports = Comments;
