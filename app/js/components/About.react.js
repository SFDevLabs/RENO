/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');

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
