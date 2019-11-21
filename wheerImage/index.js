'use strict'

class Wheer {
  constructor(imgNodes, targetIndex, time, mode, links) {
    this.imgNodes = imgNodes                         // 输入的img的url
    this.wrapNode = ''                               // 最外层的舞台盒子节点
    this.frameNodes = {}                             // 三大主内容盒子节点
    this.contentNode = []                            // 图片节点
    this.navArrowNode = []                           // 左右侧箭头节点
    this.pointNode = []                              // 底部当前图片游标节点
    this.targetIndex = Number(targetIndex)           // 初始展示图片索引
    this.time = Number(time)                         // 单张图片滚动时间
    this.isEnd = false                               // 判定所展示图片为最后一张
    this.isBegin = false                             // 判定所展示图片为开始一张
    this.leftTimeHandler = ''                        // 左侧箭头setTimout话柄
    this.rightTimeHandler = ''                       // 右侧箭头setTimout话柄

    this.initElements()
    this.checkTargetIndex()
  }

  // 初始化创建节点
  initElements() {
    const self = this
    let frameNodeKeys = [
      {
        key: 'contentNode',
        className: 'buringSnow-wheer-content buringSnow-wheer-content-beginLeft buringSnow-wheer-content-beginRight',
      },
      {
        key: 'navArrowNode',
        className: 'buringSnow-wheer-navArrow',
      },
      {
        key: 'pointNode',
        className: 'buringSnow-wheer-point',
      },
    ]

    // 创建舞台节点
    self.wrapNode = document.createElement('div')
    addClass(self.wrapNode, 'buringSnow-wheer-wrap')

    // 创建盒子节点
    frameNodeKeys.forEach(item => {
      self.frameNodes[item.key] = document.createElement('div')
      addClass(self.frameNodes[item.key], item.className)
    })
    frameNodeKeys = null

    // 创建img节点
    self.contentNode = self.imgNodes.map((img, index) => {
      const imgNode = document.createElement('img')
      addAttr(imgNode, 'src', img)
      addCss(imgNode, 'display', index === self.targetIndex ? 'block' : 'none')
      return imgNode
    })

    // 创建左右箭头节点
    for (let i = 0; i < 2; i++) {
      self.navArrowNode.push(document.createElement('span'))
    }

    // 根据imgNodes数量创建points节点
    self.pointNode = self.contentNode.map(item => document.createElement('span'))
  }

  // 生成DOM结构
  createDOM() {
    const self = this
    for (const key in self.frameNodes) {
      self.wrapNode.appendChild(self.frameNodes[key])
      self[key].forEach(node => {
        self.frameNodes[key].appendChild(node)
      })
    }
    self.addEvents()

    return self.wrapNode
  }

  // 验证当前展示图片是否为第一张或最后一张
  checkTargetIndex() {
    const self = this
    self.isBegin = self.targetIndex === 0 ? true : false
    self.isEnd = self.targetIndex === self.contentNode.length - 1 ? true : false
  }

  // isBegin/isEnd为true时，处理动作
  // 思想：isBegin和isEnd不可能同时为true
  // 在图片开始轮播之前
  isTrueAnimationBegin() {
    const self = this

    console.log(self.isEnd, self.isBegin)
    const targetNode = self.contentNode[self.isEnd ? 0 : self.contentNode.length - 1]
    addCss(targetNode, 'display', 'block')
    self.frameNodes['contentNode'][self.isEnd ? 'appendChild' : 'prepend'](targetNode)
  }

  // 在图片轮播结束之后
  isTrueAnimationAfter() {
    const self = this
    self.targetIndex = self.isEnd ? 0 : self.contentNode.length - 1
    self.frameNodes['contentNode'][self.isEnd ? 'prepend' : 'appendChild'](self.contentNode[self.targetIndex])

    // 条件重置，便于重新检验
    self.isEnd = false
    self.isBegin = false
  }

  // 添加事件绑定
  addEvents() {
    const self = this
    const events = new Events(self)
    new EventUtil(self.navArrowNode[0], 'click', events.getEvent('navArrowLeftClick'))
    new EventUtil(self.navArrowNode[1], 'click', events.getEvent('navArrowRightClick'))
  }
}

class Events {
  constructor(parent) {
    this.parent = parent
  }

  getEvent(eventName) {
    const self = this.parent
    return this[eventName].bind(self)
  }

  // 给左键绑定事件
  navArrowLeftClick() {
    const self = this

    clearTimeout(self.rightTimeHandler)
    addClass(self.frameNodes['contentNode'], 'buringSnow-wheer-content-toLeft')
    self.isEnd ? self.isTrueAnimationBegin() : addCss(self.contentNode[self.targetIndex + 1], 'display', 'block')
    self.leftTimeHandler = setTimeout(function () {
      addCss(self.contentNode[self.targetIndex], 'display', 'none')
      removeClass(self.frameNodes['contentNode'], 'buringSnow-wheer-content-toLeft')
      self.isEnd ? self.isTrueAnimationAfter() : self.targetIndex++
      self.checkTargetIndex()
      clearTimeout(self.leftTimeHandler)
    }, self.time)
  }

  // 给右键绑定事件
  navArrowRightClick() {
    const self = this

    clearTimeout(self.leftTimeHandler)
    removeClass(self.frameNodes['contentNode'], 'buringSnow-wheer-content-beginLeft')
    self.isBegin ? self.isTrueAnimationBegin() : addCss(self.contentNode[self.targetIndex - 1], 'display', 'block')
    addClass(self.frameNodes['contentNode'], 'buringSnow-wheer-content-toRight')
    self.rightTimeHandler = setTimeout(function () {
      addCss(self.contentNode[self.targetIndex], 'display', 'none')
      removeClass(self.frameNodes['contentNode'], 'buringSnow-wheer-content-toRight')
      addClass(self.frameNodes['contentNode'], 'buringSnow-wheer-content-beginLeft')
      self.isBegin ? self.isTrueAnimationAfter() : self.targetIndex--
      self.checkTargetIndex()
      clearTimeout(self.rightTimeHandler)
    }, self.time)
  }

}


/**
 * 数据对应表关系
 *
 * [...content]      <------- key: content      ---------> frameNodes.content
 * [...navArrowNode] <------- key: navArrowNode ---------> frameNodes.navArrowNode
 * [...pointNode]    <------- key: pointNode    ---------> frameNodes.pointNode
 */