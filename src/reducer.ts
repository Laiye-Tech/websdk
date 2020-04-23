import { handleActions } from 'redux-actions'
import { IAuthState } from '../interfaces'

const initialState: IAuthState = {
  rtMsgList: [],
  pageConfig: null,
  imageModal: {
    visible: false,
    src: null
  }
}

export const RT_MSG_LIST = 'RT_MSG_LIST'
export const APP_PAGE_CONFIG = 'APP_PAGE_CONFIG'
export const IMAGE_MODAL_OPEN = 'IMAGE_MODAL_OPEN'
export const IMAGE_MODAL_CLOSE = 'IMAGE_MODAL_CLOSE'

export default handleActions<IAuthState>({
  [RT_MSG_LIST]: (state: IAuthState, { payload }: any) => {
    const msgList = [...state.rtMsgList]
    msgList.push(payload)

    return {
      ...state,
      rtMsgList: msgList
    }

  },

  [APP_PAGE_CONFIG]: (state: IAuthState, { payload }: any) => {
    return {
      ...state,
      pageConfig: payload
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
  }
}, initialState)
