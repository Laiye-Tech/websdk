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

export function debounce(func: (...args) => any, timeout: number = 500) {
  let timer: NodeJS.Timeout = null

  return function(...args) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      func(...args)
      timer = null
    }, timeout)

    return timer
  }
}

export function throttle(func: (...args) => any, timeout: number = 300) {
  let timer: NodeJS.Timeout = null

  return function(...args) {
    if (timer) return

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

  const client = new window.OSS({
    accessKeyId: stsToken.access_key_id,
    accessKeySecret: stsToken.access_key_secret,
    stsToken: stsToken.security_token,
    endpoint: stsToken.end_point,
    bucket: stsToken.bucket,
    secure: 'https:'
  })

  const ext = file.name.split('.').slice(-1)[0] || 'unknown'
  const storeAs = `${stsToken.access_dir}/${file.uid ||
    file.name}${Date.now()}.${ext}`

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

export function query(name: string) {
  // 把'?a=1&b=2&c=3'中的?去掉
  const search = location.search.substr(1)

  // 使用正则表达式匹配
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const res = search.match(reg)

  if (!res) return null
  return res[2]
}

export const getRandomString = function(length) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
