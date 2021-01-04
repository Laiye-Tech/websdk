import { MSG_TYPE, DIRECTION } from '../../interfaces'
import { MSG_DIRECTION, MSG_TYPE_CONST } from './config'
import { getUserId } from '../utils/config'
import { getBotReply, pushMsg } from '../data/message.data'

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
      resource_url: url
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
  enable_evaluate: boolean = false,
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
    enable_evaluate,
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
  // 发送完成后调用机器人回复接口、取is_send为true 的回复

  const body = {
    msg_body,
    user_id: getUserId(),
    extra: ''
  }

  const {
    suggested_response: replyMsg,
    msg_id: replayMsgId
  }: any = await getBotReply(body)

  const replyMsgList = replyMsg.filter(item => item.is_send)

  // 将历史数据格式化、保持和发送消息的数据格式一致
  replyMsgList.map(replyMsgItem => {
    const { bot, response, quick_reply } = replyMsgItem
    if (response.length) {
      response.forEach(item => {
        const msg = item
        const type = Object.keys(msg.msg_body)[0]

        const message = pushRtMessage(
          msg.msg_body,
          MSG_TYPE_CONST[type],
          replayMsgId,
          quick_reply,
          bot,
          msg.enable_evaluate,
          'TO_USER',
          msg.similar_response
        )
        const body = {
          msg_body: msg.msg_body,
          user_id: getUserId(),
          msg_ts: msg.msg_ts,
          bot,
          answer_id: msg.answer_id
        }

        pushMsg(body)

        setRtMsgs(message)
      })
    }
  })
}
