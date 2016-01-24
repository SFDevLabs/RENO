jest.dontMock('../Post.react');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Post = require('../Post.react');

describe('Post', () => {

  it('renders', () => {
    // Render a article item
    const val = {tags:[],_id:123, user:{_id:456, username:'JohnSmith'}, title:'Foo', body: 'Bar'};
    var post = TestUtils.renderIntoDocument(
      <Post article={val} />
    );

    var input = TestUtils.scryRenderedDOMComponentsWithTag(post, 'input')
    expect(input[0].value).toEqual('Foo');
    
    var textarea = TestUtils.findRenderedDOMComponentWithTag(post, 'textarea')
    expect(textarea.textContent).toEqual('Bar');

  });
});