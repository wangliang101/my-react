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

function createDom(fiber){
    // 如果是text elements,创建text node,否则创建一个regular node
    const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
    // assign the element props to the node
    Object.keys(fiber.props).filter(key => key !== "children").forEach(name => {
      dom[name] = fiber.props[name]
    })
    return dom;
    // // 递归创建子元素
    // element.props.children.forEach(child => {
    //   render(child, dom)
    // });
    // container.appendChild(dom)
}

function render(element, container) {
  nextUnitofWork = {
    dom: container,
    props: {
      children: [element],
    }
  }

}

let nextUnitofWork = null

function workLoop(deadline){
  let shoudYield = false
  while(nextUnitofWork && !shoudYield){
    nextUnitofWork = performUnitOfWork(
      nextUnitofWork
    )
    shoudYield = deadline.timeRemaining() < 1
  }
  window.requesIdleCallback(workLoop)
}

window.requesIdleCallback(workLoop)
function performUnitOfWork(fiber){
  // add dom node
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  }
  if(fiber.parent){
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // create new fibers
  const elements = fiber.props.children
  let index = 0;
  let prevSibling = null;
  while(index < elements.length){
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }
    if(index === 0){
      fiber.child = newFiber 
    }else{
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
  // return next unit of work
  if(fiber.child){
    return fiber.child
  }
  let nextFiber = fiber
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

export default { createElement, render };