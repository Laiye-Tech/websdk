import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import MsgContent from './MsgContent'

import { AVATAR_SHAPE, CHAT_BAR, page as PageConfig, BACKGROUND_COLOR } from '../../utils/config'

import { IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  message: IMsgBodyInfo
}

const UserMsg = (props: IProps) => {
  const { message } = props

  const bgColor = PageConfig.get('theme_color') as string
  const avatarShape = AVATAR_SHAPE[PageConfig.get('avatar_shape')]
  const chatBar = CHAT_BAR[PageConfig.get('chat_bar')]
  const avatar = PageConfig.get('user_avatar')

  // theme_chose 1 表示自定义背景颜色
  const isCustomColor = (PageConfig.get('theme_chose') as number) === 1
  let fontColor = '#fff'

  if (isCustomColor) {
    fontColor = PageConfig.get('font_color') as string
  } else {
    // 最早只支持吾来预设的背景颜色，为了兼容之前的用户需要这个逻辑
    const color = BACKGROUND_COLOR.find(color => color === bgColor)
    fontColor = typeof color === 'undefined' ? '#fff' : '#000'
  }

  const hasOwnContent =
    message.msg_type === 'IMAGE' ||
    message.msg_type === 'FILE' ||
    message.msg_type === 'SHARELINK' ||
    message.msg_type === 'VIDEO'

  const cls = !hasOwnContent ? styles.content : ''
  const style = !hasOwnContent ? {
    backgroundColor: bgColor,
    color: fontColor
  } : {}

  return(
    <div className={`${styles.msgContent} ${styles.clearfix}`}>
      <dl className={`${styles.msgContainer} ${styles.userMsg}`}>
        <dt className={styles.userInfo}>
          <div className={`${styles.avatar} ${avatarShape}`} style={{ backgroundColor: bgColor }}>
            <img src={`${avatar}?x-oss-process=image/resize,w_72,h_72/quality,q_80`}/>
          </div>
        </dt>

        <dd className={styles.msgBody}>
          <div className={`${cls} ${chatBar}`} style={style}>
            <MsgContent message={message} />
          </div>

          <span className={styles.hiddenId}>#{message.msg_id}</span>
        </dd>
      </dl>
    </div>
  )
}

export default UserMsg as any
