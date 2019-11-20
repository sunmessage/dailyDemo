'use strict'

class VideoBarrage {
  constructor(canvas, video, initData) {
    if (!canvas || !video) {
      return ''
    }

    this.canvas = canvas
    this.video = video
    this.initData = Array.isArray(initData) ? [...initData] : [initData]

    this.init()
    this.drawCanvas()
  }

  // 初始化数据和canvas画布大小
  init() {
    this.initBaseData()
    this.initCanvas()
  }

  initBaseData() {
    const self = this
    const baseData = {
      ctx: self.canvas.getContext('2d'),
      canvasWidth: self.video.width,
      canvasHeight: self.video.height,
      X: self.video.width,
      officialData: self.initData.map(singleBarrage => new SingleBarrage(singleBarrage, self))
    }

    // 以这种手法增添类基础变量，挺不错的，针对类内部产生的数据
    Object.assign(self, baseData)
  }

  initCanvas() {
    const self = this
    self.canvas.width = self.video.width
    self.canvas.height = self.video.height
  }

  // 填充弹幕内容
  drawCanvas() {
    const self = this
    self.clearCanvas()

    self.officialData.forEach(singleBarrage => {
      const { color, fontSize, opacity, time, speed, value, startX, startY } = singleBarrage
      self.ctx.fillStyle = color
      self.ctx.font = fontSize
      self.ctx.fillText(value, self.X, startY)
    })

    self.X--

    // requestAnimationFrame按一定的时间，周期完整执行回调函数
    (self.canvasWidth > -600) && requestAnimationFrame(self.drawCanvas.bind(self))
  }

  // 清理弹幕内容
  clearCanvas() {
    const self = this
    self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight)
  }

}

// 创建单条弹幕类
// 目的一、结构清晰，使得VideoBarrage类只存在初始化数据、渲染弹幕、清理弹幕三个动作
// 目的二、解决每条弹幕由于同步执行导致初始化startY值相同（原来class可以解决同步初始化造成的问题）
class SingleBarrage {
  constructor(barrage, parentClass) {
    for(const key in barrage) {
      this[key] = barrage[key]
    }

    this.initBarrage(parentClass)
  }

  initBarrage(parentClass) {
    const self = this
    const temporaryNode = document.createElement('p')
    temporaryNode.style.display = 'inline-block'
    temporaryNode.innerText = self.value
    document.body.appendChild(temporaryNode)

    const singleBbarrageMessage = {
      startX: parentClass.video.width,
      startY: Math.floor(Math.random() * parentClass.video.height),
      contentWidth: temporaryNode.clientWidth,
      contentHeight: temporaryNode.clientHeight,
    }

    Object.assign(self, singleBbarrageMessage)

    document.body.removeChild(temporaryNode)
  }
}