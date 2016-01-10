/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const Actions = require('../actions/ArticleActions');
const CommentItem = require('./CommentItem.react');
const Loader = require('react-loader');

const Comments = React.createClass({

  props:{
  	comments: React.PropTypes.func.isRequired,
  	id: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
    	comment: ''
    }
  },
  componentWillReceiveProps: function(nextProps) {
    //When we recieve props the react commponent has reloaded.  This means the save is done. 
    this.setState({
      saving:false
    });
  },

  render :function() {
    const commentsData = this.props.comments;

    const comments= [];

    for (var i = 0; i < commentsData.length; i++) {
      var comment = commentsData[i];
      comments.push(<CommentItem  key={i} comment={comment} articleId={this.props.id} />);
    }
    const opacity = this.state.saving?.2:1;
    const loader = this.state.saving?<Loader options={{top:'40%'}} />:null;
    return <div>
      <h3>Comments</h3>
      {comments}
      <div style={{position:'relative'}}>
        {loader}
        <div style={{opacity: opacity}} className="form-group">
          <textarea onChange={this._onChangeNewComment} value={this.state.comment} rows="6" name="body" placeholder="Add your comment" cols="30" rows="6" className="form-control" />
          <br />
          <button onClick={this._save}  className="btn btn-primary" type="submit">Add comment</button>
        </div>
      </div>
    </div>;
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
        comment: '',
        saving:true
      });
    }
  }

  
})

module.exports = Comments;
