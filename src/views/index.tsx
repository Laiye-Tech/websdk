import * as Nerv from 'nervjs'
import * as styles from './index.less'
import { connect, Dispatch } from 'nerv-redux'

// actions
import { setPageConfig, closeImageModal, closeVideoModal } from '../actions'

// API
import { login } from '../data/app.data'
import { pushMsg } from '../data/message.data'
import { getUserInfo, HEADER_AVATAR_SHAPE, FRAME_SHAPE, page as PageConfig } from '../utils/config'
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
  setPageConfig: (page: IPageConfig) => void
  closeImageModal: () => void
  closeVideoModal: () => void
}
interface IState {
  pageConfig: IPageConfig | null
}
class App extends Nerv.Component<IProps, IState> {
  $content: HTMLDivElement | null = null
  props: IProps
  state: IState = {
    pageConfig: null
  }

  componentWillReceiveProps({ rtMsgList }: IProps) {
    const old = this.props

    if (old.rtMsgList.length !== rtMsgList.length) {
      setTimeout(() => this.scrollToBottom(), 320)
    }
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
    PageConfig.set(res.page_config)
    this.setState({ pageConfig: res.page_config }, () => this.addStyleByJs())
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

    // 发送一条进入事件消息
    const enterMsg = createEventMsg('ENTER')
    pushMsg(enterMsg)

    setTimeout(() => {
      this.scrollToBottom()
    }, 320)

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

  render () {
    const { imageModal, videoModal, closeImageModal, closeVideoModal } = this.props
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
      <Nerv.Fragment>
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

            <main className={styles.msgContainer} ref={this.setContentRef}>
              <div className={styles.message} id="scrollArea">
                {this.$content ? <HistoryMsgPanel scrollDom={this.$content}/> : null}
                <RtMsgPanel />
              </div>
            </main>

            <footer className={styles.footer}>
              <ChatInput />
            </footer>
          </div>

          <div className={styles.entryImg} style={{ backgroundColor }}>
            <img
              src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/6c64b84b-c00f-4eb4-b358-6880766adaa7.png"
              className={styles.closeImg}
            />
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
  setPageConfig: page => dispatch(setPageConfig(page)),
  closeImageModal: () => dispatch(closeImageModal(null)),
  closeVideoModal: () => dispatch(closeVideoModal(null))
})

export default connect(mapStateToProps, mapDispatchToProps)(App) as any
