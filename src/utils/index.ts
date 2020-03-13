export const isClient: boolean = typeof window !== 'undefined'

// 允许全局匹配，多行匹配,将空格变为<br/>
export function transformString(text: string) {
  return text.replace(/\n/gm, '<br/>')
}

export function prefixUrl(url: string) {
  if (url && url.indexOf('http') !== 0) {
    return `http://${url}`
  }

  return url
}

export function scrollToBottom(content, useAnim = false) {
  // IE9没有requestAnimationFrame,需要做兼容
  if (!window.requestAnimationFrame) {
    let lastTime = 0
    const vendors = ['ms', 'moz', 'webkit', 'o']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    window.requestAnimationFrame = (callback) => {
      const currTime = new Date().getTime()
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(() => {
        callback(currTime + timeToCall)
        }, timeToCall)

      lastTime = currTime + timeToCall
      return id
    }
  }

  if (!useAnim) {
    return requestAnimationFrame(() => {
      const { scrollHeight, clientHeight } = content
      content.scrollTop = scrollHeight - clientHeight
    })
  }

  const { scrollHeight, clientHeight } = content
  let dis = scrollHeight - clientHeight
  const anim = () => {
    content.scrollTop += 1
    dis--

    if (dis >= 0) {
      requestAnimationFrame(anim)
    }
  }

  requestAnimationFrame(anim)
}

