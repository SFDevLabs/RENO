
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
        <div className="page-header">
          <h2>404 - Not Found</h2>
        </div>
        <div className="content" >
          <p>We could not find that page.</p>
          <Link to="/">Return Home</Link>
        </div>
    </section>;
  }
})

module.exports = About;