import Nerv, { Fragment } from 'nervjs'

import { MSG_DIRECTION } from '../../utils/config'
import UserMsg from './user-msg'
import GeniusMsg from './genius-msg'
import { IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  message: IMsgBodyInfo
  isHistory?: boolean
}

function Msg(props: IProps) {
  const { message, isHistory = false } = props

  return(
    <Fragment>
      {message.direction === MSG_DIRECTION.genius ? (
        <GeniusMsg message={message} isHistory={isHistory}/>
      ) : (
        <UserMsg message={message}/>
      )}
    </Fragment>
  )
}

export default Msg as any
