/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const React = require('react');

const Messages = React.createClass({
  
  props:{
  	messages: React.PropTypes.func.isRequired,
  	type: React.PropTypes.string.isRequired//Possible values: warning, danger, info, success
  },

  getInitialState:function(){
    return {
      collapsed: false,
      collapsing: false
    };
  },
  /**
   * @return {object}
   */
  render: function() {
    var alertBox = 'fade alert-'+this.props.type;
    var main = "alert"
    if (this.state.collapsing){
      alertBox += '  alert';
    }else{
      alertBox += this.state.collapsed?' ':' in alert';
      main += this.state.collapsed?' hidden':' ';
    }

    var messages = []
    for (var i = this.props.messages.length - 1; i >= 0; i--) {
    	messages.push((
		        <ul key={i}>
		          <li>{this.props.messages[i].message}</li>
		        </ul>
    		));
    };

    return (
	    <div className={main}>
	      <div className={alertBox}>
	        <button onClick={this._onClick} className="close" type="button" data-dismiss="alert">×</button>
	        {messages}
	      </div>
	    </div>
    );
  },
  _onClick:function(){
    //Simple logic for fade out of message.
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

module.exports = Messages;
