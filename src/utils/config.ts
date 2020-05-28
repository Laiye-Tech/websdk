import * as style from '../views/index.less'
import * as msgStyle from '../components/MsgContent/MsgContent.less'
import * as chatInputStyle from '../components/ChatInput/ChatInput.less'
import { DIRECTION, IPageConfig, IInteractionConfig } from '../../interfaces'

let pageConfig: IPageConfig
let envLanguage: any
let interaction: IInteractionConfig
const pkg = require('../../package.json')
// const isProd = process.env.NODE_ENV === 'production'
// const MODE = window.__WEB_SDK_CONF__ && window.__WEB_SDK_CONF__.ENV.MODE
const BASE_URL = 'https://newtestcb2.wul.ai'

// if (MODE === 'pre') {
//   BASE_URL = 'https://precb2.wul.ai'
// } else if (MODE === 'dev' || !isProd) {
//   BASE_URL = 'https://newtestcb2.wul.ai'
// } else if (MODE === 'test') {
//   BASE_URL = 'https://newtestcb2.wul.ai'
// } else {
//   BASE_URL = 'https://cb2.wul.ai'
// }

const page = {
  set: (configOb: IPageConfig): void => {
    pageConfig = {...configOb}
  },
  get: (propertyKey: keyof IPageConfig) => {
    return typeof interaction !== 'undefined' ? pageConfig[propertyKey] : null
  }
}

const language = {
  set: (languageCode) => {
    envLanguage = require(`../../locales/${languageCode}`).default
  },
  get: propertyKey => {
    return typeof interaction !== 'undefined' ? envLanguage[propertyKey] : {}
  }
}

const interactionConfig = {
  set: (configOb: IInteractionConfig): void => {
    interaction = {...configOb}
  },
  get: (propertyKey: keyof IInteractionConfig) => {
    return typeof interaction !== 'undefined' ? interaction[propertyKey] : null
  }
}

const MSG_DIRECTION: {[key: string]: DIRECTION} = {
  /** 用户发出的消息 */
  user: 'FROM_USER',
  /** 客服发出的消息 */
  genius: 'TO_USER'
}

// 头像形状
const AVATAR_SHAPE = {
  0: msgStyle.circle,
  1: msgStyle.square
}

// 标题栏头像形状
const HEADER_AVATAR_SHAPE = {
  0: style.circle,
  1: style.square
}

// 边框弧度
const FRAME_SHAPE = {
  0: style.boderSquare,
  1: style.borderCircle
}

// 气泡形状
const CHAT_BAR = {
  0: msgStyle.bubbleDrip,
  1: msgStyle.bubbleCapsule,
  2: msgStyle.bubbleSquare
}

// 输入框形状
const TEXTAREA_SHAPE = {
  0: chatInputStyle.boderSquare,
  1: chatInputStyle.borderCircle
}

// 文件背景颜色
const EXT_COLOR = {
  default: '#b3bdc5',
  doc: '#003bcb',
  docx: '#003bcb',
  jpg: '#333',
  jpeg: '#333',
  gif: '#333',
  png: '#333',
  pdf: '#d91d06',
  ppt: '#eceef0',
  pptx: '#E05635',
  txt: '#1778ff',
  xls: '#009056',
  xlsx: '#009056',
  mp4: '#ffb500',
  amr: '#41b313',
  csv: '#7715d2'
}

const TRACK_DIRECTION = {
  user: '1',
  staff: '0'
}

// 背景颜色 对应 字体颜色是黑色
const BACKGROUND_COLOR = ['#ffd500']

function getAppInfo() {
  return {
    version: `v${pkg.version}`,
    source: 'WEB_SDK'
  }
}

function getUserInfo() {
  if (window.localStorage.getItem('SDK_USER_INFO')) {
    const result = JSON.parse(window.localStorage.getItem('SDK_USER_INFO'))
    return result
  }

  return null
}

function getUserId() {
  if (getUserInfo()) {
    const pubkey = window.localStorage.getItem('SDK_PUBKEY')
    const userId = getUserInfo()[pubkey].userId
    return userId
  }

  return ''
}

export {
  BASE_URL,
  MSG_DIRECTION,
  getAppInfo,
  getUserInfo,
  getUserId,
  AVATAR_SHAPE,
  CHAT_BAR,
  HEADER_AVATAR_SHAPE,
  FRAME_SHAPE,
  TEXTAREA_SHAPE,
  EXT_COLOR,
  page,
  language,
  interactionConfig,
  BACKGROUND_COLOR,
  TRACK_DIRECTION
}
