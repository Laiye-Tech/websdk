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
