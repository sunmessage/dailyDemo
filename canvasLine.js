'use strict'

// 根据一元一次直线函数画线
function stroke(k, minX, MaxX, minB, maxB) {
  const x = Math.floor((Math.random() * 1000) / (1000 / (MaxX - minX))) + minX
  const y = -k * x + Math.floor((Math.random() * 1000) / (1000 / (maxB - minB))) + minB

  return {
    x,
    y,
  }
}