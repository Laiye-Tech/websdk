import { createAction } from 'redux-actions'
import { USER_INFO } from './reducer'

const setUserName = createAction(
  USER_INFO,
  (name: string) => ({ name })
)

export {
  setUserName
}
