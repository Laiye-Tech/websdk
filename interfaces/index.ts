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

export type ModalInfo = {
  visible: boolean
  src: string
}

export interface IAuthState {
  rtMsgList: IMsgBodyInfo[]
  sugList: ISugList[]
  imageModal: ModalInfo
  videoModal: ModalInfo
}

// -----------------------------------------------------------------------------
// 项目基础配置
import {
  ISDKConfigInfo,
  IPageConfig,
  IOSSAuth,
  IOSSUploadResult,
  IInteractionConfig
} from './app.type'

// 消息相关
import {
  IHistoryMsg,
  IMsgBodyInfo,
  ISendMsgResponse,
  EvaluateInfo,
  MSG_TYPE,
  DIRECTION,
  SATISFACTION_ENUM,
  TextMessage,
  ImageMessage,
  VideoMessage,
  FileMessage,
  ShareLinkMessage,
  RichTextMessage,
  VoiceMessage
} from './message.type'

// 用户相关
import { IUserSugList, ITagValuesInput, ISugList } from './user.type'

export {
  ISDKConfigInfo,
  IPageConfig,
  IOSSAuth,
  IOSSUploadResult,
  IHistoryMsg,
  IMsgBodyInfo,
  ISendMsgResponse,
  EvaluateInfo,
  MSG_TYPE,
  DIRECTION,
  SATISFACTION_ENUM,
  TextMessage,
  ImageMessage,
  VideoMessage,
  FileMessage,
  ShareLinkMessage,
  RichTextMessage,
  VoiceMessage,
  IUserSugList,
  ITagValuesInput,
  ISugList,
  IInteractionConfig
}
