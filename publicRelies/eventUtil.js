'use strict'

class EventUtil {
  constructor(target, type, handler, mode = false) {
    this.target = target
    this.type = type
    this.handler = handler
    this.mode = mode

    this.addHandler()
  }

  // 这种即接受初始化类的数据，又接收方法单独的数据的手法记录下
  addHandler(type = this.type, handler = this.handler, mode = this.mode) {
    const self = this
    if (self.target.addEventListener) {
      self.target.addEventListener(type, handler, mode)
      return ''
    }
    if (self.target.attachEvent) {
      self.target.attachEvent(`on${type}`, handler)
      return ''
    }
    self.target[`on${type}`] = handler
  }

  removeHandler(type = this.type, handler = this.handler, mode = this.mode) {
    const self = this
    if (self.target.removeEventListener) {
      self.target.removeEventListener(type, handler, mode)
      return ''
    }
    if (self.target.detachEvent) {
      self.target.detachEvent(`on${type}`, handler)
      return ''
    }
    self.target[`on${type}`] = null
  }
}