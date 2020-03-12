import * as Nerv from 'nervjs'

import { IMsgBodyInfo, TextMessage, ImageMessage } from '../../../interfaces'

import TextContent from './TextContent'
import ImgContent from './ImgContent'

interface IProps {
  message: IMsgBodyInfo
}

export default function MsgContent({ message }: IProps) {
  const { msg_body, msg_type, direction } = message

  if (msg_type === 'TEXT') {
    return <TextContent body={msg_body as TextMessage} direction={direction}/>
  }

  if (msg_type === 'IMAGE') {
    return <ImgContent body={msg_body as ImageMessage}/>
  }

  return <span>尚未支持的的消息类型：{msg_type}</span>
}
