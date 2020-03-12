import * as Nerv from 'nervjs'

import { IMsgBodyInfo, TextMessage } from '../../../interfaces'

import TextContent from './TextContent'

interface IProps {
  message: IMsgBodyInfo
}

export default function MsgContent({ message }: IProps) {
  const { msg_body, msg_type, direction } = message

  if (msg_type === 'TEXT') {
    return <TextContent body={msg_body as TextMessage} direction={direction}/>
  }
}
