import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'
import { connect, Dispatch } from 'nerv-redux'

import { setRtMsgs } from '../../actions'
import { pushMsg } from '../../data/message.data'

import { transformString, prefixUrl } from '../../utils'
import {
  MSG_DIRECTION,
  page as PageConfig,
  TRACK_DIRECTION
} from '../../utils/config'
import { xssFilter } from '../../utils/xss'
import { createTextMsg, pushRtMessage, getReply } from '../../utils/message'

import { TextMessage, DIRECTION, IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  body: TextMessage
  direction: DIRECTION
  similarList: any[]
  setRtMsgs: (msg: IMsgBodyInfo) => void
}

const TextContent = ({ body, direction, similarList, setRtMsgs }: IProps) => {
  let { content } = body.text

  // document.addEventListener('click', event => {
  //   // 如果是a标签并且是‘点击’
  //   if (
  //     event.target.nodeName === 'A' &&
  //     event.target.getAttribute('classname') === 'serch-only'
  //   ) {
  //     const res = window.sessionStorage.getItem('test')
  //     console.log('res-----', res)
  //   }
  // })

  if (typeof content === 'string' && content) {
    content = transformString(content)
  }

  // 展示emoji表情
  if (window.RongIMLib && window.RongIMLib.RongIMEmoji) {
    content = window.RongIMLib.RongIMEmoji.symbolToEmoji(content)
  }

  content = xssFilter(content)

  // 链接
  const reg = /((http[s]?\:\/\/)?([\w\-]+\.)+[A-Za-z]{2,}([\:\d]*)?([\/\?][\w\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/gi
  // a标签
  const reg1 = /<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/g
  // 换行
  const reg2 = /\n|\\n/g
  // img标签
  const imgReg = /<img.*?(?:>|\/>)/gi

  if (direction === MSG_DIRECTION.genius) {
    // const reg = /<a\/?.+?\/?>/gi

    // if (reg.test(content)) {
    //   // 如果是a标签、判断内容是不是‘点击’

    // }

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

  const bgColor = PageConfig.get('theme_color') as string
  const decoration = bgColor === '#000000' ? 'underline' : 'initial'

  const sendMsg = async (value: string) => {
    const msg = createTextMsg(value)
    const { msg_id } = await pushMsg(msg)

    // 发送完成后调用机器人回复接口
    getReply(setRtMsgs, msg.msg_body)

    const message = pushRtMessage(msg.msg_body, msg.msg_type, msg_id)
    setRtMsgs(message)
  }

  return (
    <Nerv.Fragment key="text-content">
      <span
        dangerouslySetInnerHTML={{ __html: body.text.content }}
        // dangerouslySetInnerHTML={{ __html: content }}
        className={styles.textContent}
      />

      {similarList && similarList.length ? (
        <ul className={styles.similar}>
          {similarList.map(similar => (
            <li
              key={similar.url}
              style={{ color: bgColor, textDecoration: decoration }}
              onClick={() => sendMsg(similar.detail.qa.standard_question)}
            >
              {similar.detail.qa.standard_question}
            </li>
          ))}
        </ul>
      ) : null}
    </Nerv.Fragment>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setRtMsgs: message => dispatch(setRtMsgs(message))
})

export default connect(
  null,
  mapDispatchToProps
)(TextContent) as any
