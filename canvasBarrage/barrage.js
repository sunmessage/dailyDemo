'use strict'

class VideoBarrage {
  constructor(canvas, video, initData) {
    if(!canvas || !video) {
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
      width: self.video.width,
      height: self.video.height,
      startX: self.video.width,
      startY: Math.floor(Math.random() * self.video.height),
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
    self.initData.forEach(singleBarrage => {
      const { color, fontSize, opacity, time, speed, value, startY } = singleBarrage
      self.getBarrageWidth(value)
      self.ctx.fillStyle = color
      self.ctx.font = fontSize
      self.ctx.fillText(value, self.startX, startY)

    })

    self.startX--
    (self.startX >= -600) && requestAnimationFrame(self.drawCanvas.bind(self))
  }

  // 清理弹幕内容
  clearCanvas() {
    const self = this
    self.ctx.clearRect(0, 0, self.width, self.height)
  }

  // 获取每条弹幕内容长度
  getBarrageWidth(value) {
    const temporaryNode = document.createElement('p')
    package.style.display = 'inline-block'
    temporaryNode.innerText = value
    console.log(temporaryNode.clientWidth)
  }


}