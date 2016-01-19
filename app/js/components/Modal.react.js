/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const _ = require('lodash');

const Modal = React.createClass({
  props:{
    title: React.PropTypes.string,
    body: React.PropTypes.string,
    topCloseButton: React.PropTypes.boolean,
    actions: React.PropTypes.array
  },

  getInitialState:function(){
    return {
      show:false,
      remove:false
    }
  },
  componentDidMount: function() {
    var that = this;
    setTimeout(function(){ 
      that.setState({
        show:true
      });
     }, 50);
  },

  /**
   * @return {object}
   */
  render: function() {
    var that = this;
    const fadeClass = this.state.show?' in':' ';
    const buttons = _.map([ {type:'default', text: 'Close', func:function(){alert()} } ], function(val, key){
      const text = val.text ? val.text:' ';
      const func = val.func ? val.func:function(){};
      const type = val.type ? val.type:'default';
      return <button key={key} onClick={that._onClose.bind(that, func)} className={"btn btn-"+val.type}>{text}</button>
    })
    const topCloseButton = this.props.topCloseButton?<button onClick={this._onClose} type="button" className="close"><span aria-hidden="true">&times;</span></button>:null;

    const JSX = this.state.remove ? null:<div>
      <div className={"modal fade"+fadeClass} style={{display:'block'}} id="myModal" tabIndex="-1" role="dialog" ariaLabelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {topCloseButton}
              <h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.body}
            </div>
            <div className="modal-footer"> 
             {buttons}             
            </div>
          </div>
        </div>
      </div>
      <div className={"modal-backdrop fade"+fadeClass}></div>
    </div>
    return JSX
  },
  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onClose: function(action) {
    this.setState({
      show:false
    });
    var that = this;
    setTimeout(function(){ 
      that.setState({
        remove:true
      });
     }, 500);
    action('stuff');
  }

});

module.exports = Modal;
