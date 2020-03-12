export interface ISDKConfigInfo {
  page_config: IPageConfig
  rong_token: string
  rong_key: string
  token: string
  user_id: string
  start_ts: string
  interaction_config: IInteractionConfig
}

export interface IPageConfig {
  avatar_shape: number
  bot_avatar: string
  bot_avatar_chose: number
  chat_bar: number
  frame_shape: number
  header_avatar: string
  /** 0默认 1自定义 2禁用 */
  header_chose: number
  qa_feedback: string
  theme_color: string
  title: string
  user_avatar: string
  user_avatar_chose: number
  entry_image: string
  entry_image_chose: number
  entry_image_size: number
  screen_ratio: number
}

export interface IInteractionConfig {
  /** 是否展示快捷回复sug */
  fuzzy_sug: boolean
  /** 是否展示历史消息 */
  show_history: boolean
  /** 点击关闭按钮之后展开的时间 */
  pop_after_close: number
  /** 首次打开自动打开时间 */
  auto_pop: number
  /** 是否展示举报按钮 */
  enable_report: boolean
  /** 是否展示吾来logo */
  enable_wulai_ad: boolean
}

export interface IOSSAuth {
  /** access 目录 */
  access_dir: string
  /** oss accessKeyId */
  access_key_id: string
  /** oss accessKeySecret */
  access_key_secret: string
  /** oss bucket */
  bucket: string
  /** oss endpoint */
  end_point: string
  /** 失效时间戳 */
  expire_ts: number
  policy: string
  /** oss securityToken */
  security_token: string
  /** 服务器直传签名 */
  signature: string
}

export interface IOSSUploadResult {
  bucket: string
  etag: string
  name: string
  res?: {
    aborted: boolean
    data: any[]
    headers: any
    keepAliveSocket: boolean
    remoteAddress: string
    remotePort: string
    requestUrls: string[]
    rt: number
    size: number
    status: number
    statusCode: number
    timing: null | any
  }
}
