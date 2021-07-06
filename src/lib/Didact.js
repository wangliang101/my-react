function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object'
          ? child
          : createTextElement(child)
      )
    }
  }
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(element, container) {
  // 如果是text elements,创建text node,否则创建一个regular node
  const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
  // assign the element props to the node
  Object.keys(element.props).filter(key => key !== "children").forEach(name => {
    dom[name] = element.props[name]
  })
  // 递归创建子元素
  element.props.children.forEach(child => {
    render(child, dom)
  });
  container.appendChild(dom)
}

export default { createElement, render };