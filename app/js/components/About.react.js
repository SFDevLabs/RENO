
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');

///Move Mee to another file
const About = React.createClass({
  render :function() {
    return (
      <div>
        <h2>About</h2>
        <Link to="/">Home</Link>
      </div>
    )
  }
})

module.exports = About;
