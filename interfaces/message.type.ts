export type MSG_TYPE = 'TEXT' | 'IMAGE' | 'VOICE' | 'NOTICE' | 'FILE' | 'SHARELINK'
  | 'VIDEO' | 'CUSTOM' | 'PUBLIC_EVENT' | 'NONSUPPORT' | 'EVENT' | 'CALLBACK_NOTICE'
  | 'RICH_TEXT'

/** TO_USER: 用户收到的消息 FROM_USER: 用户发出的消息 */
export type DIRECTION = 'TO_USER' | 'FROM_USER'
export interface IHistoryMsg {
  has_more: boolean
  msg: IMsgBodyInfo[]
}

export interface IMsgBodyInfo {
  msg_type: MSG_TYPE
  msg_body: any
  direction: DIRECTION
  extra: string
  msg_id: string
  msg_ts: string
  user_info: IUserInfo
  sender_info: ISenderInfo
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
