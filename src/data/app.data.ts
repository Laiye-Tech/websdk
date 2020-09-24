import postForm from '../utils/request'
import { BASE_URL, getAppInfo, getUserId, PVT_URL } from '../utils/config'
import { IUserInput, ISDKConfigInfo, IOSSAuth } from '../../interfaces'

const logger = require('web-logger')

export function login(
  pubkey: string,
  userInfo: IUserInput
): Promise<ISDKConfigInfo> {
  const query = {
    version: getAppInfo().version,
    source: getAppInfo().source,
    pub_key: pubkey
  }

  // 传入userId
  if (userInfo.userId) {
    query['web'] = {
      nickname: userInfo.nickName,
      avatar_url: userInfo.userAvatar,
      user_id: userInfo.userId
    }
  } else {
    query['anonymous'] = true
  }

  const url = `${BASE_URL}/user/login`
  return postForm(url, query)
}

// STS 返回临时访问凭证
export function getStsToken(): Promise<IOSSAuth> {
  const url = `${BASE_URL}/resource/oss/auth/write`
  return postForm(url, {})
}

export function log(log: { [key: string]: string }) {
  logger.log({ ...log, user_id: getUserId() })
}

/**
 * 上传
 */
export function Upload(file: any): Promise<any> {
  const url = `${PVT_URL}/paas-knowledge/oss/upload`

  let formData = new FormData()
  formData.append('img', file)

  const body = formData
  console.log('body---', body)
  return postForm(url, body, 'multipart/form-data')
}

/**
 * 上传
 */
export const handleUpload = file => {
  let res = null
  const xhr = new XMLHttpRequest()

  // xhr.addEventListener(
  //   'error',
  //   () => {
  //     this.setState({
  //       uploading: false,
  //       fileList: [],
  //       results: []
  //     })
  //     const { uploadError } = this.props
  //     if (uploadError) {
  //       uploadError()
  //     }
  //   },
  //   false
  // )

  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState !== 4 || xhr.status !== 200) {
      return
    }

    return JSON.parse(xhr.response)
  })

  xhr.open('post', `${PVT_URL}/paas-knowledge/oss/upload`, true)
  const fd = new FormData()
  fd.append('upfiles', file)

  xhr.send(fd)

  // xhr.addEventListener(
  //   'readystatechange',
  //   () => {
  //     if (xhr.readyState !== 4 || xhr.status !== 200) {
  //       return
  //     }

  //     console.log('xhr---', xhr)

  //     const result = JSON.parse(xhr.responseText)

  //     return result
  //   },
  //   false
  // )
}
