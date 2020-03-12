import { handleActions } from 'redux-actions'
import { IAuthState } from '../interfaces'

const initialState: IAuthState = {
  rtMsgList: [],
  pageConfig: null
}

export const RT_MSG_LIST = 'RT_MSG_LIST'
export const APP_PAGE_CONFIG = 'APP_PAGE_CONFIG'

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
  }
}, initialState)
