import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'
import { connect } from 'nerv-redux'

import MsgContent from './MsgContent'

import { AVATAR_SHAPE, CHAT_BAR } from '../../utils/config'

import { IMsgBodyInfo, IPageConfig } from '../../../interfaces'

interface IProps {
  message: IMsgBodyInfo
  pageConfig: IPageConfig
}

class UserMsg extends Nerv.Component<IProps> {
  props: IProps

  render() {
    const { message, pageConfig } = this.props
    const bgColor = pageConfig.theme_color
    const avatarShape = AVATAR_SHAPE[pageConfig.avatar_shape]
    const chatBar = CHAT_BAR[pageConfig.chat_bar]

    return(
      <div className={styles.msgContent}>
        <dl className={`${styles.msgContainer} ${styles.userMsg}`}>
          <dt>
            <div className={`${styles.avatar} ${avatarShape}`} style={{ backgroundColor: bgColor }}>
              <img src={`${pageConfig.bot_avatar}?x-oss-process=image/resize,w_72,h_72/quality,q_80`}/>
            </div>
          </dt>

          <dd>
            <div className={`${styles.content} ${chatBar}`}>
              <MsgContent message={message}/>
            </div>

            <div className={styles.hiddenId}>#{message.msg_id}</div>
          </dd>
        </dl>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  pageConfig: state.todos.pageConfig
})

export default connect(mapStateToProps)(UserMsg) as any
