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

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps){
  // remove old or changed event listeners
  Object.keys(prevProps).filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })
  // remove old properties
  Object.keys(prevProps).filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ''
    })

  // set new or changed properties
  Object.keys(nextProps).filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
  // add event listeners
  Object.keys(nextProps).filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

function commitRoot(){
  // TODO add nodex to dom
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null;
}

function commitWork(fiber){
  if(!fiber.child){
    return;
  }
  const domParentFiber = fiber.parent;
  while(!domParentFiber.dom){
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom;
  if(fiber.effectTag === 'PLACEMENT' && fiber.dom != null){
    domParent.appendChild(fiber.dom);
  }else if(fiber.effectTag === 'DELETION'){
    commitDeletion(fiber, domParent)
  }else if(fiber.effectTag === 'UPDATE' && fiber.dom != null){
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitDeletion(fiber, domparent){
  if(fiber.dom){
    domparent.removeChild(fiber.dom)
  }else{
    commitDeletion(fiber.child, domparent)
  }
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    }
  }
  deletions = []
  nextUnitofWork = wipRoot
}

let nextUnitofWork = null;
let currentRoot = null;
let wipRoot = null;
let wipFiber = null;
let deletions = null;

function workLoop(deadline){
  let shoudYield = false
  while(nextUnitofWork && !shoudYield){
    nextUnitofWork = performUnitOfWork(
      nextUnitofWork
    )
    shoudYield = deadline.timeRemaining() < 1
  }
  if(!nextUnitofWork && wipRoot){
    commitRoot()
  }
  window.requesIdleCallback(workLoop)
}

window.requesIdleCallback(workLoop)

function performUnitOfWork(fiber){
  const isFunctionComponent = fiber.type instanceof Function
  if(isFunctionComponent){
    updateFunctionComponent(fiber)
  }else{
    updatedHostComponent(fiber)
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


function updateFunctionComponent(fiber){
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updatedHostComponent(fiber) {
  // add dom node
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  } 
  // create new fibers
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)
}
function reconcileChildren(fiber, elements){
  let index = 0;
  const oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  while(index < elements.length && oldFiber != null){
    const element = elements[index]
    let newFiber = null
    // TODO compare oldFiber to element
    const sameType = oldFiber && element && element.type === oldFiber.type;
    if(sameType){
      // TODO update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      }
    }
    if(element && !sameType){
      // TODO add this.type
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      }
    }
    if(oldFiber && !sameType){
      // TODO delete the oldFIber's node
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber)
      
    }
    // const newFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: fiber,
    //   dom: null
    // }
    if(index === 0){
      fiber.child = newFiber 
    }else{
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

export default { createElement, render };