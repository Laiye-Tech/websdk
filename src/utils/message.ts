import { IMsgBodyInfo, MSG_TYPE } from '../../interfaces'
import { MSG_DIRECTION } from './config'
import { getUserId } from '../utils/config'

const message: IMsgBodyInfo[] = []

/** 文本消息 */
export function createTextMsg(text: string) {
  const body = {
    text: { content: text }
  }

  return createMsg(body, 'TEXT')
}

/** 图片消息 */
export function createImageMsg(url: string, thumbUrl: string = '') {
  const body = {
    image: {
      resource_url: url,
      thumbUrl
    }
  }

  return createMsg(body, 'IMAGE')
}

/** 事件消息 */
export function createEventMsg(eventType: string) {
  const body = {
    event: {
      event_type: eventType
    }
  }

  return createMsg(body, 'EVENT')
}

/** 通知消息 */
export function createNoticeMsg(msg: string) {
  const body = msg
  return createMsg(body, 'NOTICE')
}

export function createMsg(body: any, type: MSG_TYPE) {
  return {
    user_id: getUserId(),
    msg_body: body,
    msg_type: type
  }
}

// 重组融云推过来的消息
export function reSetRongMsgInfo(msgBody) {
  const msg = {
    msg_body: msgBody.msg_body,
    direction: MSG_DIRECTION.staff,
    extra: msgBody.msg_body.extra,
    msg_id: msgBody.msg_id,
    msg_ts: msgBody.msg_ts,
    msg_type: msgBody.msg_type,
    sender_info: msgBody.sender_info,
    user_info: {
      avatar_url: '',
      nickname: ''
    },
    quick_reply: msgBody.quick_reply,
    similar_response: msgBody.similar_response,
    user_id: msgBody.user_id,
    enable_evaluate: msgBody.enable_evaluate || false,
    bot: msgBody.bot
  }

  return msg
}
