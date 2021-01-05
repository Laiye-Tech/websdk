import * as Nerv from 'nervjs'

import {
  IMsgBodyInfo,
  TextMessage,
  ImageMessage,
  VideoMessage,
  FileMessage,
  ShareLinkMessage,
  RichTextMessage,
  VoiceMessage
} from '../../../interfaces'
import { MSG_TYPE_CONST } from '../../utils/config'

import TextContent from './text-content'
import ImgContent from './img-content'
import VideoContent from './video-content'
import FileContent from './file-content'
import ShareLinkContent from './share-link-content'
import RichTextContent from './rich-text-content'
import VoiceContent from './voice-content'

interface IProps {
  message: IMsgBodyInfo
}

export default function MsgContent({ message }: IProps) {
  const { msg_body, msg_type, direction } = message

  if (msg_type === MSG_TYPE_CONST.text) {
    const similar = message.similar_response
    return <TextContent body={msg_body as TextMessage} direction={direction} similarList={similar}/>
  }

  if (msg_type === MSG_TYPE_CONST.image) {
    return <ImgContent body={msg_body as ImageMessage}/>
  }

  if (msg_type === MSG_TYPE_CONST.video) {
    return <VideoContent body={msg_body as VideoMessage}/>
  }

  if (msg_type === MSG_TYPE_CONST.voice) {
    return <VoiceContent body={msg_body as VoiceMessage}/>
  }

  if (msg_type === MSG_TYPE_CONST.file) {
    return <FileContent body={msg_body as FileMessage}/>
  }

  if (msg_type === MSG_TYPE_CONST.share_link) {
    return <ShareLinkContent body={msg_body as ShareLinkMessage} />
  }

  if (msg_type === MSG_TYPE_CONST.rich_text) {
    return <RichTextContent body={msg_body as RichTextMessage} />
  }

  return <span>尚未支持的的消息类型：{msg_type}</span>
}
