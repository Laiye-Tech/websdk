import * as Nerv from 'nervjs'
import * as styles from './index.less'
import { connect, Dispatch } from 'nerv-redux'

// actions
import { closeImageModal, closeVideoModal } from '../actions'

// API
import { login } from '../data/app.data'
import { pushMsg } from '../data/message.data'
import { getUserInfo, HEADER_AVATAR_SHAPE, FRAME_SHAPE, page as PageConfig, language, interactionConfig } from '../utils/config'
import { init as openSocket } from '../utils/rongcloud'
import { loadRongCloud, loadAliOSS } from '../utils/loadScript'
import { createEventMsg } from '../utils/message'

// components
import ChatInput from '../components/ChatInput'
import RtMsgPanel from '../components/MsgPanel/RtMsgPanel'
import HistoryMsgPanel from '../components/MsgPanel/HistoryMsgPanel'
import ImgModal from '../components/Common/ImageModal'
import VideoModal from '../components/Common/VideoModal'

// interfaces
import { IPageConfig, AppInfo, IMsgBodyInfo, ModalInfo } from '../../interfaces'

const logger = require('web-logger')
console.log('logger --->', logger)

interface IProps extends AppInfo {
  imageModal: ModalInfo
  videoModal: ModalInfo
  rtMsgList: IMsgBodyInfo[]
  closeImageModal: () => void
  closeVideoModal: () => void
}
interface IState {
  pageConfig: IPageConfig | null
  startTs: string
  visibile: boolean
}

const initImg = 'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534856515077-31534856527229.png'
const closeImg = 'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/6c64b84b-c00f-4eb4-b358-6880766adaa7.png'
class App extends Nerv.Component<IProps, IState> {
  $content: HTMLDivElement | null = null
  props: IProps
  state: IState = {
    pageConfig: null,
    startTs: '',
    visibile: true
  }

  componentWillReceiveProps({ rtMsgList }: IProps) {
    const old = this.props

    if (old.rtMsgList.length !== rtMsgList.length) {
      setTimeout(() => this.scrollToBottom(), 320)
    }
  }

  async componentDidMount() {
    const { pubkey, userInfo } = this.props

    const localUserInfo = getUserInfo() ? getUserInfo()[pubkey] : null
    const initUserInfo = {
      userId: '',
      userAvatar: '',
      nickName: ''
    }

    // 传入的用户信息 > 端上存的信息，如果都没有新创建一个用户
    const user = userInfo || (localUserInfo ? localUserInfo : initUserInfo)
    const res = await login(pubkey, user)

    // 功能设置
    interactionConfig.set(res.interaction_config)

    // 设置页面样式到全局
    PageConfig.set(res.page_config)

    // 设置语言
    language.set(res.page_config.language_code)

    this.setState({ pageConfig: res.page_config, startTs: res.start_ts }, () => this.addStyleByJs())

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

    // 发送一条进入事件消息
    const enterMsg = createEventMsg('ENTER')
    pushMsg(enterMsg)

    setTimeout(() => {
      this.scrollToBottom()
    }, 1000)

    // 加载阿里云OSS
    await loadAliOSS()
  }

  // 通过js创建style样式，因为项目主题颜色是传入的，用到:hover这种样式时，就不能写到less里了
  addStyleByJs = () => {
    const { pageConfig } = this.state

    const sheet = document.createElement('style')
    sheet.type = 'text/css'
    sheet.innerHTML = `
      .video-hover-icon-bg:hover .play-icon {
        background: ${pageConfig.theme_color} !important;
      }

      .wulai-web-sdk-upload-icon:hover svg #instagram {
        fill: ${pageConfig.theme_color};
      }
    `

    document.head.appendChild(sheet)
  }

  setContentRef = (el: any) => {
    if (this.$content instanceof HTMLDivElement) {
      return
    }

    this.$content = el as HTMLDivElement
  }

  // 对话消息流始终保持滚动条在最底部
  scrollToBottom() {
    if (!this.$content) {
      return
    }

    const { scrollHeight, clientHeight } = this.$content
    if (scrollHeight > clientHeight) {
      this.$content.scrollTop = scrollHeight - clientHeight
    }
  }

  // 控制会话框显示/隐藏
  togglePanel = () => {
    this.setState({ visibile: !this.state.visibile })
  }

  render () {
    const { imageModal, videoModal, closeImageModal, closeVideoModal } = this.props
    const { pageConfig, startTs, visibile } = this.state

    if (!pageConfig) {
      return null
    }

    // 主题颜色
    const backgroundColor = pageConfig.theme_color
    // 标题栏头像形状
    const avatarShape = HEADER_AVATAR_SHAPE[pageConfig.avatar_shape]
    // 窗口形状
    const borderShape = FRAME_SHAPE[pageConfig.frame_shape]
    // 是否展示历史消息
    const showHistory = interactionConfig.get('show_history')

    const enterImg = pageConfig.entry_image || initImg
    const enterImgStyle = visibile ? styles.closeImg : styles.enterAvatar

    return (
      <Nerv.Fragment>
        <div className={styles.app}>
          <div className={`${styles.container} ${borderShape} ${visibile ? '' : styles.hidden}`}>
            <header className={styles.header}>
              <dl>
                <dt>
                  <img className={avatarShape} src={pageConfig.header_avatar} style={{ backgroundColor }}/>
                </dt>
                <dd>{pageConfig.title}</dd>
              </dl>

              <i className={styles.closeBtn} onClick={this.togglePanel}>
                <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/9c2ad2c1-1ffb-4f2c-8a2b-460109be9408.png"/>
              </i>
            </header>

            <main className={styles.msgContainer} ref={this.setContentRef} id="msg-scroll-panel">
              <div className={styles.message}>
                {showHistory ? <HistoryMsgPanel startTs={startTs} /> : null}
                <RtMsgPanel />
              </div>
            </main>

            <footer className={styles.footer}>
              <ChatInput />
            </footer>
          </div>

          <div className={styles.entryImg} style={{ backgroundColor }} onClick={this.togglePanel}>
            <img src={visibile ? closeImg : enterImg} className={enterImgStyle} />
          </div>
        </div>

        {imageModal.visible ? (
          <ImgModal url={imageModal.src} closeImageModal={closeImageModal} />
        ) : null }

        {videoModal.visible ? (
          <VideoModal url={videoModal.src} closeVideoModal={closeVideoModal} />
        ) : null }
      </Nerv.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  rtMsgList: state.todos.rtMsgList,
  imageModal: state.todos.imageModal,
  videoModal: state.todos.videoModal
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  closeImageModal: () => dispatch(closeImageModal(null)),
  closeVideoModal: () => dispatch(closeVideoModal(null))
})

export default connect(mapStateToProps, mapDispatchToProps)(App) as any
