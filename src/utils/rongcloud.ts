import { Store } from 'redux'
import { setRtMsgs, toggleTipsModal } from '../actions'
import { log } from '../data/app.data'
import { MSG_DIRECTION, TRACK_DIRECTION, language } from '../utils/config'

// 融云是一个单例对象
let _instance: null | RongIMLib.RongIMClient = null

let store: Store<any> | undefined = window.__APP_STORE__

/**
 * 重连
 */
const Monitor = {
  MAX_TIMES: 3,
  count: 0,
  isDisconnected: true,
  isConnecting: false,
  reset() {
    this.count = 0
    if (this.isConnecting) {
      this.isConnecting = false
    }
  },
  reconnect() {
    if (this.count >= this.MAX_TIMES) {
      this.reset()
      // console.error('重连了很多次，还是失败了……请刷新浏览器')
      return Promise.reject('重连了很多次，还是失败了……请刷新浏览器')
    }

    const reconnect = RongIMLib.RongIMClient.reconnect

    return new Promise((resolve, reject) => {
      const handleError = (err: string) => {
        this.count += 1
        this.isConnecting = false
        // console.error(err)
        reject(err)
      }

      const cb = {
        onSuccess: () => {
          console.log('重连成功。')
          this.reset()
          resolve()
        },
        onTokenIncorrect: () => handleError('无效的令牌'),
        onError: (error: string) => {
          // console.error(error)
          handleError(`重连异常：${error}`)
        }
      }

      const config = {
        // 默认 false, true 启用自动重连，启用则为必选参数
        auto: true,
        // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        url: 'https://cdn.ronghub.com/RongIMLib-2.4.0.min.js',
        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
        rate: [1000]
      }

      reconnect(cb, config)
    })
  }
}

function startProducer() {
  // 消息接收事件
  RongIMLib.RongIMClient.setOnReceiveMessageListener({
    onReceived: msg => {
      const content = msg.content as any
      if (typeof content.extra !== 'undefined') {
        const msgBody = JSON.parse(content.extra)
        log({ msg_id: msgBody.msg_id, direction: TRACK_DIRECTION.staff })

        if (store) {
          store.dispatch(
            setRtMsgs({ ...msgBody, direction: MSG_DIRECTION.genius })
          )
        }
      }
    }
  })
}

// ------------------------- 对外暴露的接口 --------------------------

/**
 * 初始化融云
 * @param $scope
 * @param geniusToken
 */
export const init = (
  appKey: string,
  rcToken: string
): Promise<RongIMLib.RongIMClient> => {
  store = window.__APP_STORE__
  if (_instance) {
    return new Promise(resolve => resolve(_instance))
  }

  const RongIMClient = RongIMLib.RongIMClient

  try {
    RongIMClient.init(appKey, null, { showError: true })
    RongIMLib.RongIMEmoji.init({ appKey })
  } catch (e) {
    console.error('RongIMClient.init', e.message, e.stack)
  }

  // 融云连接状态改变事件
  RongIMClient.setConnectionStatusListener({
    onChanged: (status: number) => {
      const STATUS = RongIMLib.ConnectionStatus

      switch (status) {
        case STATUS.KICKED_OFFLINE_BY_OTHER_CLIENT:
          if (store) {
            store.dispatch(
              toggleTipsModal({
                visible: true,
                message: language.get('NetWork').rongMsg,
                showBtn: true
              })
            )
          }
          break
        case STATUS.DISCONNECTED:
        case STATUS.NETWORK_UNAVAILABLE:
        case STATUS.CONNECTION_CLOSED:
          if (_instance) {
            console.error(`融云连接异常：${status} - ${STATUS[status]}`)
            if (typeof navigator !== 'undefined') {
              if (navigator.onLine) {
                Monitor.reconnect()
              }
            }
          }
          break

        case STATUS.CONNECTED:
          console.info(`融云连接成功：${status} time：${new Date().getTime()}`)
          break
        case STATUS.CONNECTING:
        default:
          // console.info(`融云 CONNECT：${status}`)
          break
      }
    }
  })

  // 缓存 instance
  _instance = RongIMClient.getInstance()

  startProducer()
  // 连接融云
  return new Promise((resolve, reject) => {
    RongIMClient.connect(rcToken, {
      // 不写会报错
      onSuccess: (id: string) => {
        console.log(id)
        resolve(_instance)
      },
      onTokenIncorrect: () => {
        const txt = '无效的通讯令牌，请联系技术维护人员。'
        console.error(txt, appKey, rcToken)
        reject(txt)
      },
      onError: (error: string) => {
        const txt = `通讯管道连接失败：${error}，请联系技术维护人员。`
        console.error(txt, appKey, rcToken)
        reject(txt)
      }
    })
  })
}

export const disconnect = () => {
  if (_instance) {
    _instance.disconnect()
    _instance = null
  }
}

export default {
  init,
  disconnect,
  Monitor
}
