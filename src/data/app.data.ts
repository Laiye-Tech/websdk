import postForm from '../utils/request'
import { getAppInfo, getUserId, PVT_URL } from '../utils/config'
import { IUserInput, ISDKConfigInfo, IOSSAuth } from '../../interfaces'

const logger = require('web-logger')

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
