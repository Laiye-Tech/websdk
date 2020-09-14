import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'
import { connect, Dispatch } from 'nerv-redux'

import { setRtMsgs } from '../../actions'
import { log } from '../../data/app.data'
import { simulateMessage } from '../../data/user.data'
import { pushMsg } from '../../data/message.data'

import { transformString, prefixUrl } from '../../utils'
import {
  MSG_DIRECTION,
  page as PageConfig,
  TRACK_DIRECTION
} from '../../utils/config'
import { xssFilter } from '../../utils/xss'
import { createTextMsg, pushRtMessage } from '../../utils/message'

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
  if (window.RongIMLib && window.RongIMLib.RongIMEmoji) {
    content = window.RongIMLib.RongIMEmoji.symbolToEmoji(content)
  }

  content = xssFilter(content)

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

  const bgColor = PageConfig.get('theme_color') as string
  const decoration = bgColor === '#000000' ? 'underline' : 'initial'

  const sendMsg = async (evt: any) => {
    if (evt && evt.target && evt.target.dataset && evt.target.dataset.key) {
      const url = evt.target.dataset.key
      const value = evt.target.innerText

      const msg = createTextMsg(value)
      let msgId = ''

      if (url) {
        simulateMessage(url)
      } else {
        const { msg_id } = await pushMsg(msg)
        log({ msg_id, direction: TRACK_DIRECTION.user })
        msgId = msg_id
      }

      const message = pushRtMessage(msg.msg_body, msg.msg_type, msgId)
      setRtMsgs(message)
    }
  }

  return (
    <Nerv.Fragment>
      <span
        dangerouslySetInnerHTML={{ __html: content }}
        className={styles.textContent}
      />

      {similarList && similarList.length ? (
        <ul className={styles.similar}>
          {similarList.map(similar => (
            <li
              key={similar.url}
              data-key={similar.url}
              style={{ color: bgColor, textDecoration: decoration }}
              onClick={sendMsg}
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
