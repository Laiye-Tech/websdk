import { createAction } from 'redux-actions'
import { RT_MSG_LIST, APP_PAGE_CONFIG, IMAGE_MODAL_OPEN, IMAGE_MODAL_CLOSE } from './reducer'
import { IMsgBodyInfo, IPageConfig } from '../interfaces'

const setRtMsgs = createAction(RT_MSG_LIST, (msg: IMsgBodyInfo) => msg)
const setPageConfig = createAction(APP_PAGE_CONFIG, (page: IPageConfig) => page)
const showImageModal = createAction(IMAGE_MODAL_OPEN, (url: string) => url)
const closeImageModal = createAction(IMAGE_MODAL_CLOSE)

export {
  setRtMsgs,
  setPageConfig,
  showImageModal,
  closeImageModal
}
