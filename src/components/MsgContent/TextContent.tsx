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
  if (typeof content === 'string' && content) {
    content = transformString(content)
  }

  // 展示emoji表情
  // if (window.RongIMLib && window.RongIMLib.RongIMEmoji) {
  //   content = window.RongIMLib.RongIMEmoji.symbolToEmoji(content)
  // }

  // 如果是 任务机器人 中中配置的 去搜索 答案、则不进行 XSS
  const regAlinkXss = /<a[^>]*href="\#"[^>]*>(.*?)<\/a>/g
  if (!regAlinkXss.test(content)) {
    content = xssFilter(content)
  }

  // 链接
  const regLink = /((http[s]?\:\/\/)?([\w\-]+\.)+[A-Za-z]{2,}([\:\d]*)?([\/\?][\w\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/gi
  // a标签
  const regALink = /<a[^>]*href=((['"]([^"]*)['"])|("\#"))[^>]*>(.*?)<\/a>/g
  // 换行
  const regBr = /\n|\\n/g
  // img标签
  const imgReg = /<img.*?(?:>|\/>)/gi

  if (direction === MSG_DIRECTION.genius) {
    if (imgReg.test(content) || regALink.test(content)) {
      content = content
    } else {
      const res = content.replace(regLink, (kw: string) => {
        return `<a href=${prefixUrl(kw)} target="_blank">${kw}</a>`
      })

      content = res
    }

    if (regBr.test(content)) {
      const test = content.replace(regBr, '<br />')
      content = test
    }
  }

  const bgColor = PageConfig.get('theme_color') as string
  const decoration = bgColor === '#000000' ? 'underline' : 'initial'

  const sendMsg = async (value: string) => {
    const msg = createTextMsg(value)
    // const { msg_id } = await pushMsg(msg)

    // 发送完成后调用机器人回复接口
    getReply(setRtMsgs, msg.msg_body)

    const message = pushRtMessage(msg.msg_body, msg.msg_type, '')
    setRtMsgs(message)
  }

  return (
    <Nerv.Fragment key="text-content">
      <span
        dangerouslySetInnerHTML={{ __html: content }}
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
