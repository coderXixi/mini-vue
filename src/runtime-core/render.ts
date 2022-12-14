
import { createComponentInstance, setupComponent } from "./component"
import {Fragment,Text} from "./vnode"
// import { isObject } from "../shared/index"
import { ShapeFlages } from "../shared/ShapeFlages"
export function render(vnode, rootContainer) {
  console.log('===render执行挂载逻辑===');
  //执行挂载逻辑
  path(vnode, rootContainer,null)
}
//挂载逻辑
function path(vnode, rootContainer,parentComponent) {
  let { type, ShapeFlage } = vnode
  //判断是不是DOM元素是DOM元素就处理DOM是组件就处理组件
  console.log('===path根据type类型的不同来处理不同类型的vnode===');
  // Fragment 类型 只渲染里面的children
  console.log("tuioasoiaofasfdadfadfasdfasd",type);
  
  switch (type) {
    case Fragment:
      processFragment(vnode, rootContainer,parentComponent)
      break;
      case Text:
       processText(vnode, rootContainer)
      break
    default:
      if (ShapeFlage & ShapeFlages.element) {
        //todo 处理 element 类型
        processElement(vnode, rootContainer,parentComponent)
      } else if (ShapeFlage & ShapeFlages.statefule_component) {
        //todo 处理 component 类型
        processComponent(vnode, rootContainer,parentComponent)
      }
      break;
  }


}
//处理文本类型
function processText(vnode, rootContainer) {
  const {children}=vnode;
  console.log("processText",children);
  
  const textNode=vnode.el=document.createTextNode(children);
  rootContainer.append(textNode)
}

//处理 Fragment类型

function processFragment(vnode:any,rootContainer:any,parentComponent) {
  let {children}=vnode
  return mountChildren(children,rootContainer,parentComponent)
}

//处理DOM类型函数
function processElement(vnode: any, rootContainer: any,parentComponent) {
  // todo分为初始化过程和更新逻辑
  console.log("=== processElement  处理element 类型===");
  //初始化逻辑
  mountElement(vnode, rootContainer,parentComponent)

}
//挂载DOM
function mountElement(vnode: any, rootContainer: any,parentComponent) {
  let { type, props, children, ShapeFlage } = vnode;
  //todo children分两种情况 一种是string类型 一种是数组类型
  let el = vnode.el = document.createElement(type);
  if (ShapeFlage & ShapeFlages.array_children) {
    //因为children里面每一个都是虚拟节点还需要调用path函数
    mountChildren(children, el,parentComponent)
  } else if (ShapeFlage & ShapeFlages.text_chilren) {
    el.textContent = children;
  }
  //处理props
  for (const key in props) {
    //拿到props中的属性值
    const val = props[key]
    //注册事件相关
    //判断是不是事件
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    //获取事件名称

    if (isOn(key)) {
      const eventName = key.slice(2).toLowerCase()
      el.addEventListener(eventName, val)
    } else {
      //设置DOM元素的属性
      el.setAttribute(key, val)
    }

  }
  rootContainer.appendChild(el)
  console.log("divType", el, vnode, rootContainer);

}

//处理children
function mountChildren(children, el,parentComponent) {
  children.forEach(v => {
    path(v, el,parentComponent)
  })
}
//处理组件函数
function processComponent(vnode: any, rootContainer: any,parentComponent) {
  console.log("===processComponent  处理组件类型函数我是组件对象====", vnode);
  mountComponent(vnode, rootContainer,parentComponent)
}
//挂载组件
function mountComponent(vnode: any, rootContainer: any,parentComponent) {
  //拿到组件实例
  const instance = createComponentInstance(vnode,parentComponent);
  console.log("===拿到组件实例对象===", instance);

  //传入件实例 初始化组件
  setupComponent(instance);
  setupRenderEffect(instance, rootContainer, vnode)
}
//调用render函数
function setupRenderEffect(instance: any, rootContainer: any, vnode: any) {

  const { proxy } = instance
  //拿到虚拟节点树
  const subTree = instance.render.call(proxy);
  //将虚拟节点转成真实的DOM元素
  path(subTree, rootContainer,instance);
  vnode.el = subTree.el
}
//ce







