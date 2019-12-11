const h = (type, props={}, ...children) => {
    return { type, props : { ...props, children }}
}

const isStrOrNum = l => typeof l === 'string' || typeof l === 'number'

function mount(el, parentDOMNode) {
    if (isStrOrNum(el)) {
        const textNode = document.createTextNode(el)
        parentDOMNode.appendChild(textNode);
        return textNode
    }
    else if (typeof el.type === 'function') {
      return mountVComponent(el, parentDOMNode);
    }
    else if (typeof el.type === 'string') {
      return mountVElement(el, parentDOMNode)
    }
  }

  function mountVComponent(vComponent, parentDOMNode) {
    const { type, props } = vComponent;
    const instance = new type(props);
  
    const nextRenderedElement = instance.render();
    instance._currentElement = nextRenderedElement;
    instance._parentNode = parentDOMNode;
    instance._parentNodeIndex = parentDOMNode.childNodes.length
  
    const dom = mount(nextRenderedElement, parentDOMNode);
    vComponent._instance = instance;
    parentDOMNode.appendChild(dom);
    return dom
  }

  function mountVElement(vElement, parentDOMNode) {
    const { type, props } = vElement;
    const domNode = document.createElement(type);

    props.children.forEach(child => mount(child, domNode));
  
    if (props.style !== undefined) {
      Object.keys(props.style).forEach(k => domNode.style[k] = props.style[k]);
    }

    Object.keys(props).forEach(p => {
        if(p.startsWith('on')){
            domNode.addEventListener(p.slice(2).toLowerCase(), props[p])
        }
    })
    
    parentDOMNode.appendChild(domNode);
    return domNode;
  }

  function patchVElement(prevElement, nextElement, domNode) {
    const prevChildren = prevElement.props.children, nextChildren = nextElement.props.children
    for (let i = 0; i < Math.max(prevChildren.length ,nextChildren.length); i++) {
        update(prevChildren[i], nextChildren[i], domNode, i);
    }

    if (prevElement.style !== nextElement.style) {
      Object.keys(nextElement.style).forEach((s) =>  {
          domNode.style[s] = nextElement.style[s]
        })
    }

    Object.keys(nextElement.props).forEach(p => {
        if(p.startsWith('on') && prevElement.props[p]!==nextElement.props[p]){
            domNode.removeEventListener(p.slice(2).toLowerCase(), prevElement.props[p])
            domNode.addEventListener(p.slice(2).toLowerCase(), nextElement.props[p])
        }
    })
  }

  function update(prevElement, nextElement, parentDOMNode, parentDOMNodeIndex) {
    if(typeof prevElement === 'undefined'){
        mount(nextElement, parentDOMNode)
    }
    if(typeof nextElement === 'undefined'){
        parentDOMNode.removeChild(parentDOMNode.childNodes[parentDOMNodeIndex])
    }
    if((isStrOrNum(nextElement) && nextElement!==prevElement) || prevElement.type !== nextElement.type){
        parentDOMNode.removeChild(parentDOMNode.childNodes[parentDOMNodeIndex])
        mount(nextElement, parentDOMNode)
    } else {
        if (typeof nextElement.type === 'string') {
            patchVElement(prevElement, nextElement, parentDOMNode.childNodes[parentDOMNodeIndex]);
        } else if (typeof nextElement.type === 'function') {
            patchVComponent(prevElement, nextElement, parentDOMNode, parentDOMNodeIndex);
        }
    }
  }

  function patchVComponent(prevComponent, nextComponent) {
    const { _instance } = prevComponent;
    nextComponent._instance = _instance;
    nextComponent._instance.props = nextComponent.props;
    const prevRenderedElement = _instance._currentElement;
    const nextRenderedElement = _instance.render();
    nextComponent._instance._currentElement = nextRenderedElement;

    update(prevRenderedElement, nextRenderedElement, _instance._parentNode, _instance._parentNodeIndex);
  }

  class Component {
    constructor(props) {
      this.props = props || {};
      this.state = {};
      this._currentElement = null;
      this._parentNode = null;
      this._parentNodeIndex = null;
    }
  
    setState(partialNewState) {
      this.state = { ...this.state, ...partialNewState }
      const prevElement = this._currentElement;
      const nextElement = this.render();
      this._currentElement = nextElement;
      update(prevElement, nextElement, this._parentNode, this._parentNodeIndex);
    }
  }

let currentVdom = null

window.mount = mount
window.h = h
window.Component = Component