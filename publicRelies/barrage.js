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
      officialData: self.initData.map(singleBarrage => new SingleBarrage(singleBarrage, self)),
      cancelCanvas: true,
      animationHander: requestAnimationFrame(() => {})
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
    self.fetchOfficialData()
    self.clearLastAnimation()

    const cancelAniamtion = self.officialData.map(singleBarrage => {
      const { color, fontSize, speed, value, startX, startY } = singleBarrage
      self.ctx.fillStyle = color
      self.ctx.font = fontSize
      self.ctx.fillText(value, startX, startY)
      singleBarrage.startX = startX - speed
      singleBarrage.scrollOver = (singleBarrage.startX < -singleBarrage.contentWidth) ? true : false
      return singleBarrage.scrollOver
    });

    // requestAnimationFrame按一定的时间，周期完整执行回调函数
    if(!self.cancelCanvas && cancelAniamtion.some(item => !item)) {
       self.animationHander = requestAnimationFrame(self.drawCanvas.bind(self))
    }

  }

  // 清理弹幕内容
  clearCanvas() {
    const self = this
    self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight)
  }

  // 刷新弹幕数量
  fetchOfficialData() {
    const self = this
    if(self.officialData.length !== self.initData.length) {
      const addDatas = self.initData.slice(self.officialData.length)
      const addofficialDatas = []

      addDatas.forEach(singleBarrage => {
        if (singleBarrage.value !== '') {
          addofficialDatas.push(new SingleBarrage(singleBarrage, self))
        }
      })
      self.officialData.splice(self.officialData.length, addofficialDatas.length, ...addofficialDatas)
    }
  }

  // 清除上次动画话柄
  clearLastAnimation() {
    const self = this
    cancelAnimationFrame(self.animationHander)
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
    temporaryNode.style.fontSize = `${self.size}px`
    temporaryNode.innerText = self.value
    document.body.appendChild(temporaryNode)

    const singleBbarrageMessage = {
      startX: parentClass.video.width,
      startY: Math.floor(Math.random() * parentClass.video.height),
      contentWidth: temporaryNode.clientWidth,
      contentHeight: temporaryNode.clientHeight,
      scrollOver: false,
      fontSize: `${self.size}px ${self.font}`,
    }
    Object.assign(self, singleBbarrageMessage)

    document.body.removeChild(temporaryNode)
  }
}

/**
 * 主要思想
 * 通过不断清理绘制canvas实现
 * 
 */