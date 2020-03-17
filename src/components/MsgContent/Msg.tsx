import Nerv, { Fragment } from 'nervjs'

import { MSG_DIRECTION } from '../../utils/config'
import UserMsg from './UserMsg'
import GeniusMsg from './GeniusMsg'
import { IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  message: IMsgBodyInfo
}

function Msg(props: IProps) {
  const { message } = props

  return(
    <Fragment>
      {message.direction === MSG_DIRECTION.genius ? (
        <GeniusMsg message={message} />
      ) : (
        <UserMsg message={message}/>
      )}
    </Fragment>
  )
}

export default Msg as any
