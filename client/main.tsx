import * as Nerv from 'nervjs'
import { Store, createStore, combineReducers } from 'redux'
import { Provider } from 'nerv-redux'

import Wulai from '../src/views/index'
import todos from '../src/stores/reducer'

const initialState = {}
const enhancer = window['devToolsExtension']
  ? window['devToolsExtension']()(createStore)
  : createStore
const rootReducer = combineReducers({
  todos
})
const store: Store<any> = enhancer(rootReducer, initialState)
window.__APP_STORE__ = store

export default function MyApp(props) {
  if (
    props.data.hasOwnProperty('autoOpen') &&
    window.sessionStorage.getItem('webSdkVisible') === null
  ) {
    window.sessionStorage.setItem(
      'webSdkVisible',
      props.data.autoOpen ? 'true' : ''
    )
  }

  Nerv.render(
    <Provider store={store}>
      <Wulai {...props.data} />
    </Provider>,
    document.getElementById('wulai-websdk')
  )
}
