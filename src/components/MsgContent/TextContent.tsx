import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { transformString, prefixUrl } from '../../utils'
import { MSG_DIRECTION } from '../../utils/config'
import { TextMessage, DIRECTION } from '../../../interfaces'

interface IProps {
  body: TextMessage
  direction: DIRECTION
}

export default function TextContent({ body, direction }: IProps) {
  let { content } = body.text

  if (typeof content === 'string' && content) {
    content = transformString(content)
  }

  // 展示emoji表情
  if (RongIMLib && RongIMLib.RongIMEmoji) {
    content = RongIMLib.RongIMEmoji.symbolToEmoji(content)
  }

  const reg = /((http[s]?\:\/\/)?([\w\-]+\.)+[A-Za-z]{2,}([\:\d]*)?([\/\?][\w\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/gi
  const reg1 = /<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/g
  const reg2 = /\n|\\n/g
  const imgReg = /<img.*?(?:>|\/>)/gi

  if (direction === MSG_DIRECTION.genius) {
    if (imgReg.test(content) || reg1.test(content)) {
      content = content
    } else {
      const res = content.replace(reg, (kw: string) => {
        return `<a href=${prefixUrl(kw)} target="_blank">${kw}</a>`
      })

      content = res
    }

    if (reg2.test(content)) {
      const test = content.replace(reg2, '<br />')
      content = test
    }
  }

  return(
    <span dangerouslySetInnerHTML={{__html: content}}/>
  )
}
