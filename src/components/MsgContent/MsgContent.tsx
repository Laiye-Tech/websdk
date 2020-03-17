import * as Nerv from 'nervjs'

import {
  IMsgBodyInfo,
  IPageConfig,
  TextMessage,
  ImageMessage,
  VideoMessage,
  FileMessage,
  ShareLinkMessage,
  RichTextMessage
} from '../../../interfaces'

import TextContent from './TextContent'
import ImgContent from './ImgContent'
import VideoContent from './VideoContent'
import FileContent from './FileContent'
import ShareLinkContent from './ShareLinkContent'
import RichTextContent from './RichTextContent'

interface IProps {
  message: IMsgBodyInfo
  pageConfig: IPageConfig
}

export default function MsgContent({ message, pageConfig }: IProps) {
  const { msg_body, msg_type, direction } = message

  if (msg_type === 'TEXT') {
    return <TextContent body={msg_body as TextMessage} direction={direction}/>
  }

  if (msg_type === 'IMAGE') {
    return <ImgContent body={msg_body as ImageMessage}/>
  }

  if (msg_type === 'VIDEO') {
    return <VideoContent body={msg_body as VideoMessage}/>
  }

  if (msg_type === 'FILE') {
    return <FileContent body={msg_body as FileMessage} pageConfig={pageConfig}/>
  }

  if (msg_type === 'SHARELINK') {
    return <ShareLinkContent body={msg_body as ShareLinkMessage} />
  }

  if (msg_type === 'RICH_TEXT') {
    return <RichTextContent body={msg_body as RichTextMessage} />
  }

  return <span>尚未支持的的消息类型：{msg_type}</span>
}
