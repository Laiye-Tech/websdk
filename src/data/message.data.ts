import { BASE_URL } from '../utils/config'
import request from '../utils/request'
import { ISendMsgResponse } from '../../interfaces'

const baseUrl = `${BASE_URL}/msg`

/**
 * 发消息接口
 * @param {any} body
 * @return {Object<ISendMsgResponse>}
 * */
export function sendMsg(body: any): Promise<ISendMsgResponse> {
  const url = `${baseUrl}/receive`

  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset: UTF-8' },
    body
  })
}
