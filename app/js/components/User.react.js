/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const Link = require('react-router').Link

///Move Mee to another file
const User = React.createClass({
  render :function() {
    return (
      <section className="container">
        <div className="page-header">
          <h1>title</h1>
        </div>
        <h2>User</h2>
        <Link to="/">Home</Link>
      </ section >
    )
  }
})

module.exports = User;
