require('whatwg-fetch')
const CryptoJS = require('crypto-js')

import { getRandomString } from './index'

type RequestMode = 'cors' | 'navigate' | 'no-cors' | 'same-origin'

export default async function postForm<T>(
  url: string,
  data: T,
  ContentType = 'application/json; charset: UTF-8'
) {
  const nonce = getRandomString(32)
  const secret = 'SpHLWVaLJ53KSExIgkjV'
  const timestamp = Math.round(new Date().getTime() / 1000)

  const sign = CryptoJS.SHA1(nonce + timestamp + secret, '').toString(
    CryptoJS.enc.Hex
  )

  const options: any = {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': ContentType,
      'Api-Auth-pubkey': 'gRR54KImBfOLGWGtke4Msre7vO7RfZbf00775d15babf068950',
      'Api-Auth-nonce': nonce,
      'Api-Auth-sign': sign,
      'Api-Auth-timestamp': timestamp
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

    const type = res.headers.get('Content-Type')
    return type && type.indexOf('json') !== -1 ? res.json() : res.text()
  } catch (err) {
    console.log('err', err)
    throw Error(err)
  }
}
