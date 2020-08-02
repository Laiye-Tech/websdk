import * as Nerv from 'nervjs'
import { Store, createStore, combineReducers } from 'redux'
import { Provider } from 'nerv-redux'

import Wulai from '../src/views/index'
import todos from '../src/reducer'
import { REPORT_URL } from '../src/utils/config'

const logger = require('web-logger')

const initialState = {}
const enhancer = window['devToolsExtension']
  ? window['devToolsExtension']()(createStore)
  : createStore
const rootReducer = combineReducers({
  todos
})
const store: Store<any> = enhancer(rootReducer, initialState)
window.__APP_STORE__ = store

logger.initConfig({
  reportUrl: REPORT_URL,
  projectId: 'web-sdk',
  isLog: true
})

export default function MyApp(props) {
  if (props.data.autoOpen) {
    window.localStorage.setItem('webSdkVisible', 'true')
  }

  Nerv.render(
    <Provider store={store}>
      <Wulai {...props.data} />
    </Provider>,
    document.getElementById('wulai-websdk')
  )
}
