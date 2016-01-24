jest.dontMock('../Comments.react');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const Comments = require('../Comments.react');

describe('Comments', () => {

  it('renders', () => {

    // Render a comment with the new text area
    var comments = TestUtils.renderIntoDocument(
      <Comments Comments={[]} id={123} />
    );

    var texarea = TestUtils.findRenderedDOMComponentWithTag(comments, 'textarea')
    expect(texarea).toBeDefined()

    var button = TestUtils.findRenderedDOMComponentWithTag(comments, 'button')
    expect(button).toBeDefined()

  });

});