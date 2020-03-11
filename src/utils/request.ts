import 'whatwg-fetch'
import { IDictionary } from '../../interfaces'

const defaultOptions = {
    headers: {},
    method: 'GET',
    mode: 'cors'
}

export const HEADERS = {
  POST: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
}

export interface IRequestOptions extends RequestInit {
    url?: string
    query?: IDictionary<any> | string
    mutate?: (options: IRequestOptions) => Promise<IRequestOptions>
    body?: any
}
// -----------------------------------------------------------------------------
export default function request(
  url: string,
  options: IRequestOptions = {}
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    options.url = url

    if (window.__SESSION__ && options.headers) {
      options.headers['session'] = window.__SESSION__
    }

    const opt: any = parseOptions(
      // tslint:disable-next-line:prefer-object-spread
      Object.assign(
        {
          ...defaultOptions,
          headers: {...defaultOptions.headers }
        },
        options
      )
    )

    const res: Response = await fetch(opt.url, opt)
    if (res && res.status >= 200 && res.status < 400) {
      // 登录接口获取session
      if (opt.url.indexOf('/user/login') !== -1) {
        window.__SESSION__ = res.headers.get('session')
      }

      return getBody(res).then(resolve, reject)
    } else {
      return getBody(res).then((body: any | string) => {
        if (res.status < 500 && body.code !== 3) {
          console.log(body.message)
        }

        reject(body)
      })
    }
  })
}

export function postForm(
  url: string,
  data: IDictionary<any> = {},
  options: IRequestOptions = {}
): Promise<any> {
  options.method = 'POST'

  if (typeof options.headers === 'undefined') {
    options.headers = {}
  }
  options.headers['Content-Type'] = HEADERS.POST['Content-Type']

  options.body = JSON.stringify(data)

  return request(url, options)
}

function getBody(res: Response) {
    const type = res.headers.get('Content-Type')
    return type && type.indexOf('json') !== -1 ? res.json() : res.text()
}

function parseOptions(
    options: IRequestOptions
): Promise<IRequestOptions> | IRequestOptions {
    let { url, query } = options
    url = url || '/'

    if (query) {
      if (typeof query === 'object') {
        query = JSON.stringify(query)
      }

      if (query) {
        url += (url.indexOf('?') !== -1 ? '&' : '?') + query
      }
    }
    options.url = url

    const { method = 'GET', body, mutate } = options
    if (typeof body === 'object' && /^(POST|PUT|PATCH)$/i.test(method)) {
      options.body = JSON.stringify(body)
    }

    // mutate must be a function and could return a promise
    // useful for add authorization
    return mutate ? mutate(options) : options
}
