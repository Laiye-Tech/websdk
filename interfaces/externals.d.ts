declare module '*.less'

interface Window {
  require: any
  RongIMLib: any
  OSS: any
  __WEB_SDK_CONF__: any
  __SESSION__: string
  __APP_STORE__: any
  websdk: {
    toggleSDkVisible: (visible?: boolean) => void
  }
  websocket: any
}
