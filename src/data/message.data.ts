import { getUserId, OPEN_BASE_URL } from '../utils/config'
import postForm from '../utils/request'
import { ISendMsgResponse, IHistoryMsg, EvaluateInfo } from '../../interfaces'

/**
 * 发消息接口
 * @param {any} body
 * @return {Object<ISendMsgResponse>}
 */
export function pushMsg(body: any): Promise<ISendMsgResponse> {
  const url = `${OPEN_BASE_URL}/v2/msg/receive`

  return postForm(url, body)
}

/**
 * 获取历史消息
 * @param {string} msgId
 * @param {number} num
 * @return {Object<IHistoryMsg>}
 */
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

  const url = `${OPEN_BASE_URL}/v2/msg/history`
  return postForm(url, body)
}

/**
 * 点赞点踩接口
 * @param {Object<EvaluateInfo>} body
 * @return {}
 */
export function satisfactionEvaluate(body: EvaluateInfo): Promise<{}> {
  const url = `${OPEN_BASE_URL}/qa/satisfaction/create`

  return postForm(url, body)
}

/**
 * 获取机器人回复
 * @param {string} type 消息类型
 * @param {string} content  消息内容
 */
export function getBotReply(msgBody): Promise<IHistoryMsg> {
  const body = {
    msg_body: msgBody,
    user_id: getUserId(),
    extra: ''
  }

  const url = `${OPEN_BASE_URL}/v2/msg/bot-response`
  return postForm(url, body)
}
