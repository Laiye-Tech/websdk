import { handleActions, Action } from 'redux-actions'

const initialState = {
  name: ''
}

export const USER_INFO = 'USER_INFO'

export default handleActions({
  [USER_INFO]: (state: any, action: Action<any>) => {
    return {
      ...state,
      name: action.payload.name
    }

  }
}, initialState)
