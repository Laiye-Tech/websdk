require('whatwg-fetch')

type RequestMode = 'cors' | 'navigate' | 'no-cors' | 'same-origin'

export default async function postForm<T>(
  url: string,
  data: T
) {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors' as RequestMode,
    headers: { 'Content-Type': 'application/json; charset: UTF-8' }
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
      console.log(res)
      throw Error('')
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
