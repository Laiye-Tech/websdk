import * as Nerv from 'nervjs'
import * as styles from './index.less'
import { connect, Dispatch } from 'nerv-redux'

// actions
import { closeImageModal, closeVideoModal } from '../actions'

// API
import { login, log } from '../data/app.data'
import { pushMsg } from '../data/message.data'
import { createUserTag } from '../data/user.data'

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
import QuickReply from '../components/ChatInput/QuickReply'
import ErrorHeader from '../components/Common/ErrorHeader'
import TipsModal from '../components/Common/TipsModal'

// interfaces
import { IPageConfig, AppInfo, IMsgBodyInfo, ModalInfo, IError } from '../../interfaces'

interface IProps extends AppInfo {
  imageModal: ModalInfo
  videoModal: ModalInfo
  rtMsgList: IMsgBodyInfo[]
  closeImageModal: () => void
  closeVideoModal: () => void
}
interface IState {
  pageConfig: IPageConfig
  startTs: string
  visibile: boolean
  isPhone: boolean
  errHeader: {
    visibile: boolean
    message: string
  }
  isError: boolean
  errMsg: string
}

const initialPage = {
  avatar_shape: 0,
  bot_avatar: '',
  bot_avatar_chose: 0,
  chat_bar: 0,
  frame_shape: 0,
  header_avatar: '',
  header_chose: 0,
  qa_feedback: '',
  theme_color: '',
  theme_chose: 0,
  font_color: '',
  title: '',
  user_avatar: '',
  user_avatar_chose: 0,
  entry_image: '',
  entry_image_chose: 0,
  entry_image_size: 0,
  screen_ratio: 0,
  language_code: ''
}

const initImg = 'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534856515077-31534856527229.png'
const closeImg = 'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/6c64b84b-c00f-4eb4-b358-6880766adaa7.png'
class App extends Nerv.Component<IProps, IState> {
  $content: HTMLDivElement | null = null
  timer = null
  autoTimer = null
  props: IProps
  state: IState = {
    pageConfig: initialPage,
    startTs: '',
    visibile: false,
    isPhone: false,
    errHeader: {
      visibile: false,
      message: ''
    },
    isError: false,
    errMsg: ''
  }

  componentWillReceiveProps({ rtMsgList }: IProps) {
    const old = this.props

    if (old.rtMsgList.length !== rtMsgList.length) {
      setTimeout(() => this.scrollToBottom(), 320)
    }
  }

  componentDidMount() {
    const { pubkey, userInfo, autoOpen } = this.props

    const isPhone = document.body.clientWidth <= 414
    this.setState({ isPhone, visibile: !!autoOpen })

    const localUserInfo = getUserInfo() ? getUserInfo()[pubkey] : null
    const initUserInfo = {
      userId: '',
      userAvatar: '',
      nickName: ''
    }

    // 传入的用户信息 > 端上存的信息，如果都没有新创建一个用户
    const user = userInfo || (localUserInfo ? localUserInfo : initUserInfo)
    this.startLogin(pubkey, user)

    setTimeout(() => {
      this.scrollToBottom()
    }, 1000)
  }

  componentWillUnmount() {
    window.removeEventListener('offline', this.onOfflineChange)
    window.removeEventListener('online', this.onOnlineChange)
    this.stopSillyCheck()
  }

  startLogin = async (pubkey, user) => {
    const { userInfo } = this.props
    const res = await login(pubkey, user)

    // @ts-ignore
    if (res.code) {
      // @ts-ignore
      this.setState({ isError: true, errMsg: res.message })
      return
    }
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

    // 如果默认是关闭的状态 需要读取“自动邀请会话”配置
    if (!this.props.autoOpen) {
      const autoPop = res.interaction_config.auto_pop
      if (autoPop > 0) {
        this.applySillyCheck('autoPop', autoPop)
      }
    }

    // 连接融云
    await loadRongCloud()
    await openSocket(res.rong_key, res.rong_token)

    // 发送一条进入事件消息
    const enterMsg = createEventMsg('ENTER')
    const { msg_id } = await pushMsg(enterMsg)
    log({ msg_id })

    this.setUserTag()

    // 加载阿里云OSS
    await loadAliOSS()

    window.websdk = {
      toggleSDkVisible: this.togglePanel
    }

    window.addEventListener('offline', this.onOfflineChange)
    window.addEventListener('online', this.onOnlineChange)
  }

  applySillyCheck = (type: 'popAfter' | 'autoPop', time: number) => {
    const id = setInterval(() => {
      this.togglePanel()
      this.stopSillyCheck()
    }, time * 1000)

    type === 'popAfter' ? this.timer = id : this.autoTimer = id
  }

  // 清除定时器
  stopSillyCheck = () => {
    if (this.timer) {
      clearInterval(this.timer)
    }

    if (this.autoTimer) {
      clearInterval(this.autoTimer)
    }
  }

  setUserTag = () => {
    const { tagValues } = this.props
    // 用户属性设置
    if (typeof tagValues !== 'undefined' && tagValues.length) {
      try {
        createUserTag(tagValues)
      } catch (err) {
        console.error(err)
      }
    }
  }

  // 断网
  onOfflineChange = () => {
    const errHeader = {
      visibile: true,
      message: language.get('NetWork').offline
    }

    this.setState({ errHeader })
  }

  onOnlineChange = () => {
    this.setState({
      errHeader: {
        visibile: false,
        message: ''
      }
    })
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
    this.setState({ visibile: !this.state.visibile }, () => {
      if (this.state.visibile) {
        this.stopSillyCheck()
      } else {
        const popAfterClose = interactionConfig.get('pop_after_close') as number
        if (popAfterClose > 0) {
          this.applySillyCheck('popAfter', popAfterClose)
        }
      }
    })
  }

  render () {
    const { imageModal, videoModal, closeImageModal, closeVideoModal, fullScreen, pos } = this.props
    const { pageConfig, startTs, visibile, isPhone, errHeader, isError, errMsg } = this.state

    // 主题颜色
    const backgroundColor = pageConfig.theme_color
    // 标题栏头像形状
    const avatarShape = HEADER_AVATAR_SHAPE[pageConfig.avatar_shape]
    // 窗口形状
    const borderShape = FRAME_SHAPE[pageConfig.frame_shape]
    // 是否展示历史消息
    const showHistory = isError ? interactionConfig.get('show_history') : false
    // header_chose 2表示禁用
    const isShowHeaderAvatar = pageConfig.header_chose !== 2 && Boolean(pageConfig.header_avatar)
    // 入口图标大小
    const enterImgSize = pageConfig.entry_image_size

    const enterImg = pageConfig.entry_image || initImg
    const enterImgStyle = visibile ? styles.closeImg : styles.enterAvatar
    const isFull = !isPhone && fullScreen
    const largePanel = isFull ? styles.fullScreen : ''

    const isRenderChatInput = !!Object.keys(language.get('Logo')).length

    let position = {}

    if (typeof pos !== 'undefined') {
      position = {
        right: pos.right,
        bottom: pos.bottom
      }
    }

    const isHiddenApp = visibile || fullScreen ? '' : styles.hidden
    const containerStyle = `${styles.container} ${borderShape} ${isHiddenApp} ${styles['full-container']}`
    const windowHeight = isPhone ? `${pageConfig.screen_ratio}%` : null

    return (
      <Nerv.Fragment>
        <div className={`${styles.app} ${largePanel}`} style={position}>
          <div className={containerStyle} style={{height: windowHeight}}>
            <header className={styles.header}>
              <dl>
                {isShowHeaderAvatar ? (
                  <dt>
                    <img className={avatarShape} src={pageConfig.header_avatar} style={{ backgroundColor }}/>
                  </dt>
                ) : null}
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
              {isRenderChatInput ? (
                <Nerv.Fragment>
                   <ChatInput />
                   <QuickReply />
                </Nerv.Fragment>
              ) : null}
            </footer>

            {isError ? <TipsModal message={errMsg} /> : null}
          </div>

          <div
            className={`${styles.entryImg} ${styles[`enterImg-${enterImgSize}`]}`}
            style={{ backgroundColor }}
            onClick={this.togglePanel}
          >
            <img src={visibile ? closeImg : enterImg} className={enterImgStyle} />
          </div>

          {errHeader.visibile ? <ErrorHeader message={errHeader.message} isFull={isFull}/> : null}
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
