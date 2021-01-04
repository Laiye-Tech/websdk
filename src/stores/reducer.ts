import { handleActions } from 'redux-actions'
import { IAuthState } from '../../interfaces'
import { MSG_DIRECTION } from '../utils/config'

const initialState: IAuthState = {
  rtMsgList: [],
  sugList: [],
  quickReplys: [],
  imageModal: {
    visible: false,
    src: null
  },
  videoModal: {
    visible: false,
    src: null
  },
  toastPanel: {
    visible: false,
    message: ''
  },
  tipsModal: {
    visible: false,
    message: '',
    showBtn: false
  }
}

export const RT_MSG_LIST = 'RT_MSG_LIST'
export const IMAGE_MODAL_OPEN = 'IMAGE_MODAL_OPEN'
export const IMAGE_MODAL_CLOSE = 'IMAGE_MODAL_CLOSE'
export const VIDEO_MODAL_OPEN = 'VIDEO_MODAL_OPEN'
export const VIDEO_MODAL_CLOSE = 'VIDEO_MODAL_CLOSE'
export const USER_SUG_LIST = 'USER_SUG_LIST'
export const TOAST_PANEL_VISIBLE = 'TOAST_PANEL_VISIBLE'
export const TIPS_MODAL_VISIBLE = 'TIPS_MODAL_VISIBLE'

const handleTouchstart = event => {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}

const handleGesturestart = event => {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}

const handleTouchend = event => {
  let lastTouchEnd = 0

  const now = new Date().getTime()

  if (now - lastTouchEnd <= 300) {
    event.preventDefault()
  }

  lastTouchEnd = now
}

const notAllowScale = () => {
  document.addEventListener('touchstart', event => handleTouchstart(event))
  document.addEventListener('touchend', event => handleTouchend(event), false)
  document.addEventListener('gesturestart', event => handleGesturestart(event))
}

const allowScale = () => {
  document.removeEventListener('touchstart', event => handleTouchstart(event))
  document.removeEventListener(
    'touchend',
    event => handleTouchend(event),
    false
  )
  document.removeEventListener('gesturestart', event =>
    handleGesturestart(event)
  )
}

export default handleActions<IAuthState>(
  {
    [RT_MSG_LIST]: (state: IAuthState, { payload }: any) => {
      const msgList = JSON.parse(JSON.stringify(state.rtMsgList))
      msgList.push(payload)

      let quickReplys = []
      if (payload.direction === MSG_DIRECTION.genius) {
        quickReplys = payload.quick_reply
          ? payload.quick_reply.filter(item => item)
          : []
      }

      return {
        ...state,
        quickReplys,
        rtMsgList: msgList
      }
    },

    [IMAGE_MODAL_OPEN]: (state: IAuthState, { payload }: any) => {
      // 修改mate标签、让页面可以缩放
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute(
          'content',
          'initial-scale=' +
            1 +
            ', maximum-scale=' +
            3 +
            ', minimum-scale=' +
            1 +
            ', user-scalable=yes'
        )

      allowScale()

      return {
        ...state,
        imageModal: {
          src: payload,
          visible: true
        }
      }
    },

    [IMAGE_MODAL_CLOSE]: (state: IAuthState) => {
      // 修改mate标签、让页面不可以缩放
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute(
          'content',
          'initial-scale=' +
            1 +
            ', maximum-scale=' +
            1 +
            ', minimum-scale=' +
            1 +
            ', user-scalable=no'
        )

      notAllowScale()

      return {
        ...state,
        imageModal: {
          src: '',
          visible: false
        }
      }
    },

    [VIDEO_MODAL_OPEN]: (state: IAuthState, { payload }: any) => {
      return {
        ...state,
        videoModal: {
          src: payload,
          visible: true
        }
      }
    },

    [VIDEO_MODAL_CLOSE]: (state: IAuthState) => {
      return {
        ...state,
        videoModal: {
          src: '',
          visible: false
        }
      }
    },

    [USER_SUG_LIST]: (state: IAuthState, { payload }: any) => {
      return {
        ...state,
        sugList: payload
      }
    },

    [TOAST_PANEL_VISIBLE]: (state: IAuthState, { payload }: any) => {
      return {
        ...state,
        toastPanel: {
          message: payload.message,
          visible: payload.visible
        }
      }
    },

    [TIPS_MODAL_VISIBLE]: (state: IAuthState, { payload }: any) => {
      return {
        ...state,
        tipsModal: {
          message: payload.message,
          visible: payload.visible,
          showBtn: payload.showBtn
        }
      }
    }
  },
  initialState
)
