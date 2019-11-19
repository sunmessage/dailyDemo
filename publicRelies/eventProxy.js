'use strict'

// 方法私有函数
function delayProxyEvent(proxyEvent, operator) {
  const { type, handler, mode = false } = proxyEvent
  const eventUtil = new EventUtil(this.proxyTarget, type, handler, mode)
  eventUtil[operator]()
}

class EventProxy {
  constructor(proxyTarget, proxyEvents) {
    this.proxyTarget = proxyTarget
    this.proxyEvents = Array.isArray(proxyEvents) ? [...proxyEvents] : [proxyEvents]
  }

  addAllHandlers() {
    const self = this
    self.proxyEvents.forEach(item => delayProxyEvent.apply(self, [item, 'addHandler']))
  }

  removeAllHandlers() {
    const self = this
    self.proxyEvents.forEach(item => delayProxyEvent.apply(self, [item, 'removeHandler']))
  }

  addHandlers(addProxyEvents) {
    const self = this
    if (Array.isArray(addProxyEvents)) {
      addProxyEvents.forEach(item => delayProxyEvent.apply(self, [item, 'addHandler']))
    } else {
      delayProxyEvent.apply(self, [addProxyEvents, 'addHandler'])
    }

  }

  removeHandlers(removeProxyEvents) {
    const self = this
    if (Array.isArray(removeProxyEvents)) {
      removeProxyEvents.forEach(item => delayProxyEvent.apply(self, [item, 'removeHandler']))
    } else {
      delayProxyEvent.apply(self, [removeProxyEvents, 'removeHandler'])
    }
  }

}