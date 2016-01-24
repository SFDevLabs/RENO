jest.dontMock('../ArticleItem.react');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

const ArticleItem = require('../ArticleItem.react');

describe('ArticleItem', () => {

  it('renders', () => {

    // Render an ArticleItem
    const val = {tags:[],_id:123, user:{_id:456, username:'JohnSmith'}, title:'Foo', body: 'Bar'};
    var item = TestUtils.renderIntoDocument(
      <ArticleItem article={val} />
    );

    var title = TestUtils.findRenderedDOMComponentWithTag(item, 'h3')
    expect(title.textContent).toEqual('Foo');
    
    var body = TestUtils.findRenderedDOMComponentWithTag(item, 'p')
    expect(body.textContent).toEqual('Bar');
    
    var links = TestUtils.scryRenderedDOMComponentsWithTag(item, 'a')
    expect(links[0].textContent).toEqual('Foo');

    expect(links[1].textContent).toEqual('JohnSmith');

  });

});