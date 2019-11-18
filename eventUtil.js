'use strict'

class EventUtil {
  constructor(target, eventType, handler, relevantTagle = false) {
    this.target = target
    this.eventType = eventType
    this.handler = handler
    this.relevantTagle = relevantTagle
  }

  addHandler() {
    const self = this
    if (self.target.addEventListener) {
      self.target.addEventListener(self.eventType, self.handler, self.relevantTagle)
      return ''
    }
    if (self.target.attachEvent) {
      self.target.attachEvent(`on${self.eventType}`, self.handler)
      return ''
    }
    self.target[`on${self.eventType}`] = self.handler
  }

  removeHandler() {
    const self = this
    if (self.target.removeEventListener) {
      self.target.removeEventListener(self.eventType, self.handler, self.relevantTagle)
      return ''
    }
    if (self.target.detachEvent) {
      self.target.detachEvent(`on${self.eventType}`, self.handler)
      return ''
    }
    self.target[`on${self.eventType}`] = null
  }
}