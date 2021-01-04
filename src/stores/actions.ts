import { createAction } from 'redux-actions'
import { IMsgBodyInfo, ISugList, IToastPanel, ITipsModal } from '../../interfaces'

import {
  RT_MSG_LIST,
  IMAGE_MODAL_OPEN,
  VIDEO_MODAL_OPEN,
  IMAGE_MODAL_CLOSE,
  VIDEO_MODAL_CLOSE,
  USER_SUG_LIST,
  TOAST_PANEL_VISIBLE,
  TIPS_MODAL_VISIBLE
} from './reducer'

const setRtMsgs = createAction(RT_MSG_LIST, (msg: IMsgBodyInfo) => msg)
const showImageModal = createAction(IMAGE_MODAL_OPEN, (url: string) => url)
const showVideoModal = createAction(VIDEO_MODAL_OPEN, (url: string) => url)
const closeImageModal = createAction(IMAGE_MODAL_CLOSE)
const closeVideoModal = createAction(VIDEO_MODAL_CLOSE)
const setUserSugList = createAction(USER_SUG_LIST, (sugList: ISugList[]) => sugList)
const toggleToastPanel = createAction(TOAST_PANEL_VISIBLE, (payload: IToastPanel) => payload)
const toggleTipsModal = createAction(TIPS_MODAL_VISIBLE, (payload: ITipsModal) => payload)

export {
  setRtMsgs,
  showImageModal,
  closeImageModal,
  closeVideoModal,
  showVideoModal,
  setUserSugList,
  toggleToastPanel,
  toggleTipsModal
}
