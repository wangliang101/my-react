/** @jsxRuntime classic */
import React from 'react';
import ReactDOM from 'react-dom';
import Didact from './lib';

// const element = <h1 title="foo">Hello</h1>
// const element = React.createElement(
  // "div",
  // {id: "foo"},
  // React.createElement('a', null, 'bar'),
  // React.createElement('b', null, 'dld')
// )
/** @jsx Didact.createElement */
// const element = (
  // <div id='foo'>
    {/* <a>bar</a> */}
    {/* <b /> */}
  {/* </div> */}
// )
const element = Didact.createElement(
  "div",
  {id: "foo"},
  Didact.createElement('a', null, 'bar'),
  Didact.createElement('b', null, 'dld')
)
const containor = document.getElementById("root")
ReactDOM.render(element, containor)



// const element = {
//   type: 'h1',
//   props: {
//     title: 'foo',ax
//     children: 'hello'
//   }
// }
// const containor = document.getElementById("root")

// 将element对象创建node
// const node = document.createElement(element.type)
// node.title = element.props.title
// const text = document.createTextNode("")
// text['nodeValue'] = element.props.children
// 添加元素
// node.appendChild(text);
// containor.appendChild(node)


