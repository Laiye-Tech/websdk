export type MSG_TYPE = 'TEXT' | 'IMAGE' | 'VOICE' | 'NOTICE' | 'FILE' | 'SHARELINK'
  | 'VIDEO' | 'CUSTOM' | 'PUBLIC_EVENT' | 'NONSUPPORT' | 'EVENT' | 'CALLBACK_NOTICE'
  | 'RICH_TEXT'

/** TO_USER: 用户收到的消息 FROM_USER: 用户发出的消息 */
export type DIRECTION = 'TO_USER' | 'FROM_USER'
export interface IHistoryMsg {
  has_more: boolean
  msg: IMsgBodyInfo[]
}

export interface IBotInfo {
  qa: {
    knowledge_id: number
    standard_question: string
    question: string
    is_none_intention: boolean
  }
}

export interface IMsgBodyInfo {
  user_id: string
  msg_id: string
  msg_ts: string
  sender_info: ISenderInfo
  msg_type: MSG_TYPE
  msg_body: any
  extra: string
  source: string
  bot: IBotInfo
  enable_evaluate: boolean
  quick_reply: string[]
  similar_response: any[]
  pub_key: string
  direction: DIRECTION
}

export interface ISenderInfo {
  avatar_url: string
  nickname: string
  real_name: string
}

export interface IUserInfo {
  avatar_url: string
  nickname: string
}

export interface ISendMsgResponse {
  msg_id: string
}

export enum SATISFACTION_ENUM {
  DEFAULT_SATISFACTION = 'DEFAULT_SATISFACTION',
  /** 点赞 */
  THUMB_UP = 'THUMB_UP',
  /** 回答了我的问题，但答案不够好 */
  BAD_ANSWER = 'BAD_ANSWER',
  /** 没有回答我的问题 */
  WRONG_ANSWER = 'WRONG_ANSWER',
  /** 举报 */
  REPORT = 'REPORT'
}

export type EvaluateInfo = {
  bot_id?: {
    knowledge_id: string
  }
  msg_id: string
  satisfaction: SATISFACTION_ENUM
  user_id: string
}

export type TextMessage = {
  text: {
    content: string
  }
}

export type ImageMessage = {
  image: {
    resource_url: string
    thumbUrl: string
  }
}

export type VideoMessage = {
  video: {
    description: string
    resource_url: string
    thumb: string
    title: string
  }
}

export type FileMessage = {
  file: {
    file_name: string
    resource_url: string
  }
}

export type ShareLinkMessage = {
  share_link: {
    title: string
    destination_url: string
    cover_url: string
    description: string
  }
}

export type RichTextMessage = {
  rich_text: {
    resource_url: string
  }
}

export type VoiceMessage = {
  voice: {
    recognition: string
    resource_url: string
    type: string
  }
}
