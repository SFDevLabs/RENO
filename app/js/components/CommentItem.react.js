
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const Loader = require('react-loader');

const CommentItem = React.createClass({
  
  props:{
    comment: React.PropTypes.object.isRequired,
    articleId: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
      saving: false
    }
  },

  componentWillReceiveProps: function(nextProps) {
    //When we recieve props the react commponent has reloaded.  This means the API post is done. 
    this.setState({
      saving : false
    })
  },
  render :function() {
    const comment = this.props.comment
    const opacity = this.state.saving?.2:1;
    const loader = this.state.saving?<Loader options={{top:'40%'}} />:null;
    const dateString = new Date(comment.createdAt).toLocaleString();

    return <div style={{position:'relative'}} className="comment">
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
    </div>;
  },

  /**
   * Event handler called within.
   * @param  {string} text
   */
  _destroy: function() {
    var commentId = this.props.comment._id
    var id = this.props.articleId;
    if (id){
      Actions.destroyComment(id, commentId); //Look at the _onChange on the Article.react file for the resulting flux event that re-renders the article.
      this.setState({
          saving: true
      });
    }
  }

})

module.exports = CommentItem;
