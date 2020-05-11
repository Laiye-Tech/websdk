import { BASE_URL, getUserId } from '../utils/config'
import postForm from '../utils/request'
import { ISendMsgResponse, IHistoryMsg, EvaluateInfo } from '../../interfaces'

const baseUrl = `${BASE_URL}/msg`

/**
 * 发消息接口
 * @param {any} body
 * @return {Object<ISendMsgResponse>}
 * */
export function pushMsg(body: any): Promise<ISendMsgResponse> {
  const url = `${baseUrl}/receive`

  return postForm(url, body)
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
  return postForm(url, body)
}

/**
 * 点赞点踩接口
 * @param {Object<EvaluateInfo>} body
 * @return {}
 * */
export function satisfactionEvaluate(body: EvaluateInfo): Promise<{}> {
  const url = `${baseUrl}/evaluate`

  return postForm(url, body)
}
