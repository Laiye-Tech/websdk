require('whatwg-fetch')
const CryptoJS = require('crypto-js')

import { getRandomString } from './index'

type RequestMode = 'cors' | 'navigate' | 'no-cors' | 'same-origin'

export default async function postForm<T>(url: string, data: T) {
  const nonce = getRandomString(32)
  const secret = 'MwejoHNTPZYU1HwXDMGW'
  const timestamp = Math.round(new Date().getTime() / 1000)

  const sign = CryptoJS.SHA1(nonce + timestamp + secret, '').toString(
    CryptoJS.enc.Hex
  )

  const options: any = {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json; charset: UTF-8',
      'Api-Auth-pubkey': '27c09eP9PmJeZB5ARAIlmixnCHoG8RO80017ec0f1453567a4f',
      'Api-Auth-nonce': nonce,
      'Api-Auth-sign': sign,
      'Api-Auth-timestamp': timestamp
    }
  }

  if (url.split('https://newtestcb2.wul.ai')[1]) {
    options.headers = {
      'Content-Type': 'application/json; charset: UTF-8'
    }
  }

  return request(url, options)
}

export async function request(url: string, options?: any) {
  const opt = {
    method: 'GET',
    ...options
  }
  if (window.__SESSION__ && opt.headers) {
    opt.headers['session'] = window.__SESSION__
  }

  try {
    const res = await fetch(url, opt)
    if (!res.ok) {
      const type = res.headers.get('Content-Type')
      return type && type.indexOf('json') !== -1 ? res.json() : res.text()
    }

    // 登录接口获取session
    if (url.indexOf('/user/login') !== -1) {
      window.__SESSION__ = res.headers.get('session')
    }

    const type = res.headers.get('Content-Type')
    return type && type.indexOf('json') !== -1 ? res.json() : res.text()
  } catch (err) {
    console.log('err', err)
    throw Error(err)
  }
}
