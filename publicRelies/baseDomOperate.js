'use strict'

// 添加类名
function addClass(target, targetClass) {
  if(!target || !targetClass) {
    return 'no params'
  }
  target.className = target.className + ` ${targetClass}`
}

// 删除类名
function removeClass(target, targetClass) {
  if(!target || !targetClass) {
    return 'no params'
  }
  target.className = target.className.replace(targetClass, '')
}

// 添加单条样式
function addCss(target, cssName, cssValue) {
  if(!target || !cssName || !cssValue) {
    return 'no params'
  }
  target.style[cssName] = cssValue
}

// 添加属性名
function addAttr(target, attrName, attrValue) {
  if(!target || !attrName || !attrValue) {
    return 'no params'
  }
  target[attrName] = attrValue
}