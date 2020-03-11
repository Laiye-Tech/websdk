export interface IDictionary<T> {
  [key: string]: T
}

export interface IUserInput {
  userId: string
  userAvatar: string
  nickName: string
}

// -----------------------------------------------------------------------------
// 项目基础配置
import {
  ISDKConfigInfo,
  IPageConfig,
  IOSSAuth
} from './app.type'

export {
  ISDKConfigInfo,
  IPageConfig,
  IOSSAuth
}
