/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');

const Header = React.createClass({
  
  props:{
  	messages: React.PropTypes.func.isRequired,
  	type: React.PropTypes.string.isRequired//warning, danger, info, success
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

module.exports = Header;
