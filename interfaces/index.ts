export interface IDictionary<T> {
  [key: string]: T
}

export interface IUserInput {
  userId: string
  userAvatar: string
  nickName: string
}

export interface ITagValues {
  user_attribute: {
    id: string
  }
  user_attribute_value: {
    name: string
  }
}

export interface IPositionInput {
  right: string
  bottom: string
}

export type AppInfo = {
  pubkey: string
  autoOpen?: boolean
  fullScreen?: boolean
  userInfo?: IUserInput
  tagValues?: ITagValues[]
  pos?: IPositionInput
}

// -----------------------------------------------------------------------------
// 项目基础配置
import {
  ISDKConfigInfo,
  IPageConfig,
  IOSSAuth
} from './app.type'

// 消息相关
import {
  IHistoryMsg,
  IMsgBodyInfo,
  ISendMsgResponse,
  EvaluateInfo,
  MSG_TYPE,
  DIRECTION,
  SATISFACTION_ENUM
} from './message.type'

export {
  ISDKConfigInfo,
  IPageConfig,
  IOSSAuth,
  IHistoryMsg,
  IMsgBodyInfo,
  ISendMsgResponse,
  EvaluateInfo,
  MSG_TYPE,
  DIRECTION,
  SATISFACTION_ENUM
}
