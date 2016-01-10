
/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/

const React = require('react');
import { Link } from 'react-router';

///Move Mee to another file
const About = React.createClass({
  render :function() {
    return <section className="container">
        <h2>About</h2>
        <Link to="/">Home</Link>
    </section>
    
  }
})

module.exports = About;