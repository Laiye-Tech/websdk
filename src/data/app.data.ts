import postForm from '../utils/request'
import { BASE_URL, getAppInfo, getUserId } from '../utils/config'
import { IUserInput, ISDKConfigInfo, IOSSAuth } from '../../interfaces'

const logger = require('web-logger')

export function login(pubkey: string, userInfo: IUserInput): Promise<ISDKConfigInfo> {
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

export function log(log: {[key: string]: string}) {
  logger.log({...log, user_id: getUserId() })
}
