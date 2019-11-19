'use strict'

class EventUtil {
  constructor(target, type, handler, mode = false) {
    this.target = target
    this.type = type
    this.handler = handler
    this.mode = mode
  }

  addHandler() {
    const self = this
    if (self.target.addEventListener) {
      self.target.addEventListener(self.type, self.handler, self.mode)
      return ''
    }
    if (self.target.attachEvent) {
      self.target.attachEvent(`on${self.type}`, self.handler)
      return ''
    }
    self.target[`on${self.type}`] = self.handler
  }

  removeHandler() {
    const self = this
    if (self.target.removeEventListener) {
      self.target.removeEventListener(self.type, self.handler, self.mode)
      return ''
    }
    if (self.target.detachEvent) {
      self.target.detachEvent(`on${self.type}`, self.handler)
      return ''
    }
    self.target[`on${self.type}`] = null
  }
}