export function hasClass (el, className) {
  return el.classList.contain(className)
}
export function addClass (el, className) {
  return el.classList.add(className)
}

export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  // 判断是否传入val,如果有，则设置当前元素属性，否则获取当前元素的属性值
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 对各大浏览器前缀进行兼容
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === 'standard') {
    return style
  }
  if (vendor === false) {
    return false
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
