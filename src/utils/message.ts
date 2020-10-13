import { MSG_TYPE, DIRECTION } from '../../interfaces'
import { MSG_DIRECTION } from './config'
import { getUserId } from '../utils/config'

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

export function pushRtMessage(
  msgBody: any,
  msgType: MSG_TYPE,
  msgId: string,
  msg_ts: string,
  direction: DIRECTION = MSG_DIRECTION.user
) {
  const msg = {
    user_id: getUserId(),
    msg_id: msgId,
    msg_ts: '',
    sender_info: {
      avatar_url: '',
      nickname: '',
      real_name: ''
    },
    msg_type: msgType,
    msg_body: msgBody,
    extra: '',
    source: '',
    bot: {
      qa: {
        knowledge_id: 0,
        standard_question: '',
        question: '',
        is_none_intention: false
      }
    },
    enable_evaluate: false,
    quick_reply: [],
    similar_response: [],
    pub_key: '',
    direction
  }

  return msg
}
