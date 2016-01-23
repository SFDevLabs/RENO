/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
import { Alert } from 'react-bootstrap'; 
const _ = require('lodash');

const Messages = React.createClass({
  
  props:{
  	messages: React.PropTypes.func.isRequired,
  	type: React.PropTypes.string.isRequired//Possible values: warning, danger, info, success
  },

  getInitialState:function(){
    return {
      removed: false,
    };
  },

  componentDidMount:function(){
    this._visible();
  },

  componentWillReceiveProps:function(nextProps){
    this._visible();
  },

  /**
   * @return {object}
   */
  render: function() {
    const type = this.props.type;

    const messages = _.map(this.props.messages, function(message, i){
      return <ul key={i}>
        <li>{message}</li>
      </ul>
    });
    const removed = this.state.removed

    const JSX = !removed ?
      <Alert  bsStyle={type} onDismiss={this._notVisible}>
        {messages}
      </Alert>:
    null;
    return JSX
  },
  /**
   * _visible
   */
  _visible:function(){
    const that = this;
    that.setState({removed:false});
    setTimeout(function(){
      that.setState({
        alertVisible: true
      })      
    },10)
  },
  /**
    * _notVisible
   */
  _notVisible:function(){
    const that = this;
    this.setState({alertVisible: false});
    setTimeout(function(){
      that.setState({
        removed: true
      })      
    },500)
  }

});

module.exports = Messages;
