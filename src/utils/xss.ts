import { filterXSS } from 'xss'

const options = {
  whiteList: {
    a: ['href', 'title', 'target'],
    img: ['src']
  }
}

export function xssFilter(html: string) {
  return filterXSS(html, options)
}
