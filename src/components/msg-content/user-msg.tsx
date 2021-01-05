import * as Nerv from 'nervjs'
import * as styles from './msg-content.module.less'

import MsgContent from './msg-content'

import {
  AVATAR_SHAPE,
  CHAT_BAR,
  page as PageConfig,
  BACKGROUND_COLOR,
  MSG_TYPE_CONST
} from '../../utils/config'

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

  // user_avatar_chose 2表示禁用
  const isShowUserAvatar =
    PageConfig.get('user_avatar_chose') !== 2 && Boolean(avatar)

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
    message.msg_type === MSG_TYPE_CONST.image ||
    message.msg_type === MSG_TYPE_CONST.file ||
    message.msg_type === MSG_TYPE_CONST.share_link ||
    message.msg_type === MSG_TYPE_CONST.video

  const cls = !hasOwnContent ? styles.content : ''
  const style = !hasOwnContent
    ? {
        backgroundColor: bgColor,
        color: fontColor
      }
    : {}

  return (
    <div
      className={`${styles.msgContent} ${styles.clearfix}  ${styles.userMsg}`}
    >
      <dl className={`${styles.msgContainer} ${styles.userMsg}`}>
        <dd className={styles.msgBody}>
          <div className={`${cls} ${chatBar}`} style={style}>
            <MsgContent message={message} />
          </div>
        </dd>
        {isShowUserAvatar ? (
          <dt className={styles.userInfo}>
            <div
              className={`${styles.avatar} ${avatarShape}`}
              style={{
                backgroundColor: !PageConfig.get('user_avatar_chose')
                  ? bgColor
                  : 'initial'
              }}
            >
              <img
                src={`${avatar}?x-oss-process=image/resize,w_72,h_72/quality,q_80`}
              />
            </div>
          </dt>
        ) : null}
      </dl>
      <span className={styles.hiddenId}>#{message.msg_id}</span>
    </div>
  )
}

export default UserMsg as any
