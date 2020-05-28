import { filterXSS } from 'xss'

const options = {
  whiteList: {
    a: ['href', 'title', 'target'],
    img: ['src'],
    br: []
  }
}

export function xssFilter(html: string) {
  return filterXSS(html, options)
}
