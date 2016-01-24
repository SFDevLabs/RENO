jest.dontMock('../CommentItem.react');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const CommentItem = require('../CommentItem.react');

describe('CommentItem', () => {

  it('renders', () => {
    
    // Render a comment item
    const val = {tags:[],_id:123, user:{_id:456, username:'Foo'}, body: 'Bar'};
    var comment = TestUtils.renderIntoDocument(
      <CommentItem comment={val} articleId={val._id} />
    );

    var p = TestUtils.findRenderedDOMComponentWithTag(comment, 'p')
    expect(p.textContent).toContain('Bar');
    expect(p.textContent).toContain('Foo');


    var button = TestUtils.findRenderedDOMComponentWithTag(comment, 'button')
    expect(button).toBeDefined()

  });
});