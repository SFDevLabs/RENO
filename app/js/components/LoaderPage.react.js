/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
const UserStore = require('../stores/UserStore');
const ArticleStore = require('../stores/ArticleStore');
const Loader = require('react-loader');
const Modal = require('./Modal.react');


const LoaderPage = React.createClass({
  props:{
    options: React.PropTypes.object
  },

  getInitialState:function(){
    return {
      show:false
    }
  },

  componentDidMount: function() {
    ArticleStore.addTimeoutChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    //UserStore.removeTimeoutChangeListener(this._onChange);
    ArticleStore.addTimeoutChangeListener(this._onChange);
  },
  /**
   * @return {object}
   */
  render: function() {
    const options = this.props.options?this.props.options:{};
    const fadeClass = this.state.show?' in':' ';

    const loader = this.state.timeout?null:<Loader options={options} />;

    const JSX = this.state.timeout ? <Modal topCloseButton={true} title={'Timeout'} body={'Timeout occured!'} />:<div>
      {loader}
    </div>
    return JSX
  },
  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onChange: function() {
    this.setState({
      timeout:true,
      show:true,
      remove:false
    });
  },
  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onClose: function() {
    this.setState({
      show:false
    });
    var that = this;
    setTimeout(function(){ 
      that.setState({
        remove:true
      });
     }, 500);
  },
  /**
   * Event handler for 'change' events coming from the UserStore
   */
  _onAction: function() {
    this.setState({
      show:false
    });
  },


});

module.exports = LoaderPage;
