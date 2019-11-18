'use strict'

Array.prototype.square = function (data) {
  const copyArr = this.map(item => item * item)
  this.splice(this.length, 0, ...copyArr)
}