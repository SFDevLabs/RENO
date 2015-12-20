/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ArticleActions = require('../actions/ArticleActions');

var NewArticle = React.createClass({

  /**
   * @return {object}
   */
  render: function() {

    return (
      <section>
        <div className="page-header">
          <h1>title</h1>
        </div>
        <div className="row">
          <div className="col-md-8">
            <form method="post" action="" role="form" className="form-horizontal">
              <div className="form-group">
                <label  className="col-sm-2 control-label">Title</label>
                <div className="col-sm-10">
                  <input type="text" name="title" value="" placeholder="Enter the title" className="form-control" id="title" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Image</label>
                <div className="col-sm-10">
                  <input type="file" name="image" className="form-control" id="file" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Body</label>
                <div className="col-sm-10">
                  <textarea value="jeff" rows="5" name="body" placeholder="Enter the article description" id="desc" cols="30" rows="10" className="form-control"/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Tags</label>
                <div className="col-sm-10">
                  <input type="text" name="tags" value="" placeholder="Enter the tags" className="form-control" id="tags" />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button className="btn btn-primary" type="submit">Save</button>
                  &nbsp;
                  <a href="/articles" className="btn btn-link">Cancel</a>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <img src="/img/twitter.png" alt="" />
          </div>
        </div>
      </section>
    );
  }

});

module.exports = NewArticle;
