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

  if (window.__SESSION__ && options.headers) {
    options.headers['session'] = window.__SESSION__
  }

  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      console.log(res)
      throw Error('')
    }

    // 登录接口获取session
    if (url.indexOf('/user/login') !== -1) {
      window.__SESSION__ = res.headers.get('session')
    }

    return await res.json()
  } catch (err) {
    console.log('err', err)
    throw Error(err)
  }
}
