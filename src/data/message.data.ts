import { BASE_URL, getUserId } from '../utils/config'
import request from '../utils/request'
import { ISendMsgResponse, IHistoryMsg } from '../../interfaces'

const baseUrl = `${BASE_URL}/msg`

/**
 * 发消息接口
 * @param {any} body
 * @return {Object<ISendMsgResponse>}
 * */
export function pushMsg(body: any): Promise<ISendMsgResponse> {
  const url = `${baseUrl}/receive`

  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset: UTF-8' },
    body
  })
}

/**
 * 获取历史消息
 * @param {string} msgId
 * @param {number} num
 * @return {Object<IHistoryMsg>}
 * */
export function getMsgHistory(
  msgId: string = '',
  num: number = 50
): Promise<IHistoryMsg> {
  const body = {
    direction: 'BACKWARD',
    msg_id: msgId,
    num,
    user_id: getUserId()
  }

  const url = `${baseUrl}/history`
  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset: UTF-8' },
    body
  })
}