/** @jsxRuntime classic */
/** @jsx Didact.createElement */
import Didact from './lib/Didact';

function Counter() {
  const [state, setState] = Didact.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}
const element = <Counter />
const container = document.getElementById("root")
Didact.render(element, container)
// const element = (
//   <div id='foo'>
//     <a>bar</a>
//     <b />
//   </div>
// )
// const containor = document.getElementById("root")
// Didact.render(element, containor)

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


