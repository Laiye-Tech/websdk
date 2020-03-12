import * as Nerv from 'nervjs'
import { Store, createStore, combineReducers } from 'redux'
import { Provider } from 'nerv-redux'

import Wulai from '../src/views/index'
import todos from '../src/reducer'

const initialState = {}
const enhancer = window['devToolsExtension'] ? window['devToolsExtension']()(createStore) : createStore
const rootReducer = combineReducers({
  todos
})
const store: Store<any> = enhancer(rootReducer, initialState)

export default function MyApp(props) {
  Nerv.render(
    <Provider store={store}>
      <Wulai {...props.data}/>
    </Provider>,
    document.getElementById('app')
  )
}
