import * as Nerv from 'nervjs'
import * as styles from './index.less'
import { Dispatch } from 'redux'
import { connect } from 'nerv-redux'

// actions
import { setPageConfig } from '../actions'

// API
import { login } from '../data/app.data'
import { pushMsg } from '../data/message.data'
import { getUserInfo, HEADER_AVATAR_SHAPE, FRAME_SHAPE } from '../utils/config'
import { init as openSocket } from '../utils/rongcloud'
import { loadRongCloud, loadAliOSS } from '../utils/loadScript'
import { createEventMsg } from '../utils/message'

// components
import ChatInput from '../components/ChatInput'
import RtMsgPanel from '../components/MsgPanel/RtMsgPanel'

// interfaces
import { IPageConfig, AppInfo } from '../../interfaces'

interface IProps extends AppInfo {
  setPageConfig: (page: IPageConfig) => void
}
interface IState {
  pageConfig: IPageConfig | null
}
class App extends Nerv.Component<IProps, IState> {
  props: IProps
  state: IState = {
    pageConfig: null
  }

  async componentDidMount() {
    const { pubkey, userInfo, setPageConfig } = this.props

    const localUserInfo = getUserInfo() ? getUserInfo()[pubkey] : null
    const initUserInfo = {
      userId: '',
      userAvatar: '',
      nickName: ''
    }

    // 传入的用户信息 > 端上存的信息，如果都没有新创建一个用户
    const user = userInfo || (localUserInfo ? localUserInfo : initUserInfo)
    const res = await login(pubkey, user)
    this.setState({ pageConfig: res.page_config })
    setPageConfig(res.page_config)

    const input = {
      pubkey,
      userId: userInfo ? userInfo.userId : res.user_id
    }

    // pubkey和用户信息存到端上
    window.localStorage.setItem('SDK_PUBKEY', pubkey)
    if (!getUserInfo()) {
      const userInfo = {}
      userInfo[`${pubkey}`] = input
      window.localStorage.setItem('SDK_USER_INFO', JSON.stringify(userInfo))
    } else {
      const info = getUserInfo()
      info[pubkey] = input
      window.localStorage.setItem('SDK_USER_INFO', JSON.stringify(info))
    }

    // 连接融云
    await loadRongCloud()
    await openSocket(res.rong_key, res.rong_token)

    setTimeout(() => {
      // 发送一条进入事件消息
      const enterMsg = createEventMsg('ENTER')
      pushMsg(enterMsg)
    }, 500)

    // 加载阿里云OSS
    await loadAliOSS()
  }

  render () {
    const { pageConfig } = this.state

    if (!pageConfig) {
      return null
    }

    // 主题颜色
    const backgroundColor = pageConfig.theme_color
    // 标题栏头像形状
    const avatarShape = HEADER_AVATAR_SHAPE[pageConfig.avatar_shape]
    // 窗口形状
    const borderShape = FRAME_SHAPE[pageConfig.frame_shape]

    return (
      <div className={styles.app}>
        <div className={`${styles.container} ${borderShape}`}>
          <header className={styles.header}>
            <dl>
              <dt>
                <img className={avatarShape} src={pageConfig.header_avatar} style={{ backgroundColor }}/>
              </dt>
              <dd>{pageConfig.title}</dd>
            </dl>

            <i className={styles.closeBtn}>
              <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/9c2ad2c1-1ffb-4f2c-8a2b-460109be9408.png"/>
            </i>
          </header>

          <main className={styles.msgContainer} id="websdk-msg-panel">
            <RtMsgPanel />
          </main>

          <footer className={styles.footer}>
            <ChatInput pageConfig={pageConfig}/>
          </footer>
        </div>

        <div className={styles.entryImg} style={{ backgroundColor }}>
          <img
            src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/6c64b84b-c00f-4eb4-b358-6880766adaa7.png"
            className={styles.closeImg}
          />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setPageConfig: page => dispatch(setPageConfig(page))
})

export default connect(null, mapDispatchToProps)(App) as any
