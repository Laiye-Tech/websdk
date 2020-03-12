import { createAction } from 'redux-actions'
import { RT_MSG_LIST, APP_PAGE_CONFIG } from './reducer'
import { IMsgBodyInfo, IPageConfig } from '../interfaces'

const setRtMsgs = createAction(RT_MSG_LIST, (msg: IMsgBodyInfo) => msg)
const setPageConfig = createAction(APP_PAGE_CONFIG, (page: IPageConfig) => page)

export {
  setRtMsgs,
  setPageConfig
}
