import { handleActions } from 'redux-actions'
import { IAuthState } from '../interfaces'

const initialState: IAuthState = {
  rtMsgList: [],
  sugList: [],
  imageModal: {
    visible: false,
    src: null
  },
  videoModal: {
    visible: false,
    src: null
  }
}

export const RT_MSG_LIST = 'RT_MSG_LIST'
export const IMAGE_MODAL_OPEN = 'IMAGE_MODAL_OPEN'
export const IMAGE_MODAL_CLOSE = 'IMAGE_MODAL_CLOSE'
export const VIDEO_MODAL_OPEN = 'VIDEO_MODAL_OPEN'
export const VIDEO_MODAL_CLOSE = 'VIDEO_MODAL_CLOSE'
export const USER_SUG_LIST = 'USER_SUG_LIST'

export default handleActions<IAuthState>({
  [RT_MSG_LIST]: (state: IAuthState, { payload }: any) => {
    const msgList = [...state.rtMsgList]
    msgList.push(payload)

    return {
      ...state,
      rtMsgList: msgList
    }

  },

  [IMAGE_MODAL_OPEN]: (state: IAuthState, { payload }: any) => {
    return {
      ...state,
      imageModal: {
        src: payload,
        visible: true
      }
    }
  },

  [IMAGE_MODAL_CLOSE]: (state: IAuthState) => {
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
  }
}, initialState)
