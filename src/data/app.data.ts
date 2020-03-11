import request from '../utils/request'
import { BASE_URL } from '../utils/config'
import { IUserInput, ISDKConfigInfo } from '../../interfaces'

export function login(pubkey: string, userInfo: IUserInput): Promise<ISDKConfigInfo> {
  const query = {
    version: 'v3.30.0',
    source: 'WEB_SDK',
    pub_key: pubkey
  }

  // 传入userId
  if ((userInfo && userInfo.userId)) {
    query['web'] = {
      nickname: userInfo.nickName,
      avatar_url: userInfo.userAvatar,
      user_id: userInfo.userId
    }
  } else {
    query['anonymous'] = true
  }

  const url = `${BASE_URL}/user/login`
  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset: UTF-8' },
    body: query
  })
}
