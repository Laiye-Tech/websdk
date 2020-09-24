import { MSG_TYPE, DIRECTION } from '../../interfaces'
import { MSG_DIRECTION } from './config'
import { getUserId } from '../utils/config'
import { getBotReply } from '../data/message.data'

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
  quick_reply = [],
  bot: any = null,
  source = MSG_DIRECTION.user,
  similarResponse: any = []
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
    bot: bot || {
      qa: {
        knowledge_id: 0,
        standard_question: '',
        question: '',
        is_none_intention: false
      }
    },
    enable_evaluate: false,
    quick_reply,
    similar_response: similarResponse,
    pub_key: '',
    direction: source
  }

  return msg
}

/**
 * 接受消息
 */
export const getReply = async (setRtMsgs, msg_body) => {
  // 发送完成后调用机器人回复接口

  const { suggested_response: replyMsg }: any = await getBotReply(msg_body)

  // 将历史数据格式化、保持和发送消息的数据格式一致
  replyMsg.map(replyMsgItem => {
    const { bot, response, quick_reply, msg_id: replayMsgId } = replyMsgItem
    if (response.length) {
      const msg = response[0]

      const message = pushRtMessage(
        msg.msg_body,
        'TEXT',
        replayMsgId,
        quick_reply,
        bot,
        'TO_USER',
        msg.similar_response
      )
      setRtMsgs(message)
    }
  })
}
