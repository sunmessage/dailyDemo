'use strict'

// 方法私有函数
function getUrlParms(data) {
  const reg = /(?<=[?&])\w+=\w+/g
  const result = data.match(reg).map(item => item.split('='))
  return result
}

const regCheck = {

  // 变量名转化为驼峰式
  toHump: function (data) {
    const result = data.replace(/[-|_][\w$]/g, item => item.slice(1).toUpperCase())
    return result
  },

  // 变量名转化为横杠式
  toCrossbar(data) {
    const result = data.replace(/([A-Z])|(_[\w$])/g, item => {
      item = item.length === 1 ? `-${item.toLowerCase()}` : item.replace('_', '-')
      return item
    })
    return result
  },

  // 变量名转化为下划线式
  toUnderline(data) {
    const result = data.replace(/([A-Z])|(-[\w$])/g, item => {
      item = item.length === 1 ? `_${item.toLowerCase()}` : item.replace('-', '_')
      return item
    })
    return result
  },

  // 电话位数为11位且开头数字不能为0
  phoneCheck(data) {
    const reg = /^[1-9]\d{10}$/g
    return reg.test(data)
  },

  // 有效邮箱格式 name@operator.xxx
  emailCheck(data) {
    const reg = /^[\w-]+@[\w-]+\.[a-zA-Z]+$/g
    return reg.test(data)
  },

  // 有效ip地址 以不同情况最大量定界 单片为[1-9]|[1-9]\d|(1\d{2}|2[0-4]\d|25[0-5])
  // 注意当精准匹配时，边界问题（使用括号捕获组）
  ipCheck(data) {
    const reg = /^((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))(\.((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))){3}$/g
    return reg.test(data)
  },

  // 获取url参数，并转化为JSON数组
  getParamsToArray(data) {
    const result = getUrlParms(data)
    return result
  },

  // 获取url参数，并转化为JSON对象
  getParamsToObject(data) {
    const result = Object.fromEntries(getUrlParms(data))
    return result
  },
}