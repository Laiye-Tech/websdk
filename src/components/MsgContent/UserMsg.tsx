import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import MsgContent from './MsgContent'

import { AVATAR_SHAPE, CHAT_BAR, page as PageConfig } from '../../utils/config'

import { IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  message: IMsgBodyInfo
}

class UserMsg extends Nerv.Component<IProps> {
  props: IProps

  render() {
    const { message } = this.props
    const bgColor = PageConfig.get('theme_color') as string
    const avatarShape = AVATAR_SHAPE[PageConfig.get('avatar_shape')]
    const chatBar = CHAT_BAR[PageConfig.get('chat_bar')]
    const avatar = PageConfig.get('user_avatar')

    const hasOwnContent =
      message.msg_type === 'IMAGE' ||
      message.msg_type === 'FILE' ||
      message.msg_type === 'SHARELINK' ||
      message.msg_type === 'VIDEO'

    const cls = !hasOwnContent ? styles.content : ''

    return(
      <div className={`${styles.msgContent} ${styles.clearfix}`}>
        <dl className={`${styles.msgContainer} ${styles.userMsg}`}>
          <dt className={styles.userInfo}>
            <div className={`${styles.avatar} ${avatarShape}`} style={{ backgroundColor: bgColor }}>
              <img src={`${avatar}?x-oss-process=image/resize,w_72,h_72/quality,q_80`}/>
            </div>
          </dt>

          <dd className={styles.msgBody}>
            <div className={`${cls} ${chatBar}`}>
              <MsgContent message={message} />
            </div>

            <span className={styles.hiddenId}>#{message.msg_id}</span>
          </dd>
        </dl>
      </div>
    )
  }
}

export default UserMsg as any
