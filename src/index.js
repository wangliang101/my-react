// import React from 'react';
// import ReactDOM from 'react-dom';

// const element = <h1 title="foo">Hello</h1>
// const containor = document.getElementById("root")
// ReactDOM.render(element, containor)

const element = {
  type: 'h1',
  props: {
    title: 'foo',
    children: 'hello'
  }
}
const containor = document.getElementById("root")

// 将element对象创建node
const node = document.createElement(element.type)
node.title = element.props.title
const text = document.createTextNode("")
text['nodeValue'] = element.props.children
// 添加元素
node.appendChild(text);
containor.appendChild(node)


