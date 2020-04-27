import { IOSSAuth, IOSSUploadResult } from '../../interfaces'

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

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      func(...args)
      timer = null
    }, timeout)

    return timer
  }
}

export function getOssUrl(stsToken: IOSSAuth, file: any) {
  if (!stsToken) {
    return console.error('Can not get STS.')
  }

  const protocol = typeof location !== 'undefined' ? location.protocol : 'http:'

  const client = new window.OSS.Wrapper({
    accessKeyId: stsToken.access_key_id,
    accessKeySecret: stsToken.access_key_secret,
    stsToken: stsToken.security_token,
    endpoint: stsToken.end_point,
    bucket: stsToken.bucket,
    secure: protocol === 'https:'
  })

  const ext = file.name.split('.').slice(-1)[0] || 'unknown'
  const storeAs = `${stsToken.access_dir}/${file.uid || file.name}${Date.now()}.${ext}`

  return client
    .multipartUpload(storeAs, file)
    .then((result: IOSSUploadResult) => {
      if (result && result.res) {
        const urls = result.res.requestUrls.map(url => url.split('?')[0])
        return urls
      }
    })
    .catch((err: Error) => {
      throw new Error(`上传文件失败 ${err.message}`)
    })
}
