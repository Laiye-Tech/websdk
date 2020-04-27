import { createAction } from 'redux-actions'
import { IMsgBodyInfo, IPageConfig, ISugList } from '../interfaces'

import {
  RT_MSG_LIST,
  APP_PAGE_CONFIG,
  IMAGE_MODAL_OPEN,
  VIDEO_MODAL_OPEN,
  IMAGE_MODAL_CLOSE,
  VIDEO_MODAL_CLOSE,
  USER_SUG_LIST
} from './reducer'

const setRtMsgs = createAction(RT_MSG_LIST, (msg: IMsgBodyInfo) => msg)
const setPageConfig = createAction(APP_PAGE_CONFIG, (page: IPageConfig) => page)
const showImageModal = createAction(IMAGE_MODAL_OPEN, (url: string) => url)
const showVideoModal = createAction(VIDEO_MODAL_OPEN, (url: string) => url)
const closeImageModal = createAction(IMAGE_MODAL_CLOSE)
const closeVideoModal = createAction(VIDEO_MODAL_CLOSE)
const setUserSugList = createAction(USER_SUG_LIST, (sugList: ISugList[]) => sugList)

export {
  setRtMsgs,
  setPageConfig,
  showImageModal,
  closeImageModal,
  closeVideoModal,
  showVideoModal,
  setUserSugList
}
