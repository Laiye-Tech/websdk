import * as Nerv from 'nervjs'
import * as styles from './index.module.less'
import { connect, Dispatch } from 'nerv-redux'

// actions
import {
  closeImageModal,
  closeVideoModal,
  toggleTipsModal,
  setRtMsgs
} from '../stores/actions'

// API
import { createUserTag, createUser } from '../data/user.data'

import {
  getUserInfo,
  HEADER_AVATAR_SHAPE,
  FRAME_SHAPE,
  page as PageConfig,
  language,
  interactionConfig
} from '../utils/config'
import { getRandomString } from '../utils/index'

// components
import ChatInput from '../components/chat-input'
import RtMsgPanel from '../components/msg-panel/rt-msg-panel'
import HistoryMsgPanel from '../components/msg-panel/history-msg-panel'
import ImgModal from '../components/common/image-modal'
import VideoModal from '../components/common/video-modal'
import QuickReply from '../components/chat-input/quick-reply.component'
import ErrorHeader from '../components/common/error-header'
import TipsModal from '../components/common/tips-modal'
import Toast from '../components/common/toast'

// interfaces
import {
  IPageConfig,
  AppInfo,
  IMsgBodyInfo,
  ModalInfo,
  IAuthState,
  IToastPanel,
  ITipsModal
} from '../../interfaces'

interface IProps extends AppInfo {
  imageModal: ModalInfo
  videoModal: ModalInfo
  toastPanel: IToastPanel
  tipsModal: ITipsModal
  rtMsgList: IMsgBodyInfo[]
  closeImageModal: () => void
  closeVideoModal: () => void
  openTipsModal: (message: string) => void
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
  allArrowVisible: boolean
}

/**
 * 初始化用户的默认信息
 */
const defaultUserInfo = {
  avatar_url:
    'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534854173706-41534855030375.png',
  interaction_config: {
    auto_pop: 60,
    // 举报按钮
    enable_report: false,
    enable_wulai_ad: false,
    flow: 'SDK_ASR_TYPE_DEFAULT',
    fuzzy_sug: true,
    pop_after_close: -20,
    reply_msg: [],
    reply_type: 'SDK_USER_AUTO_REPLY_TYPE_DEFAULT',
    show_history: true,
    welcome: null,
    nickname: '58db3d73d62f94d659f46aa70b91b61f'
  },
  page_config: {
    avatar_shape: 0,
    bot_avatar:
      'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534856515077-31534856527229.png',
    bot_avatar_chose: 0,
    chat_bar: 0,
    entry_image:
      'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534856515077-31534856527229.png',
    entry_image_chose: 0,
    entry_image_size: 64,
    font_color: '#ffffff',
    frame_shape: 1,
    header_avatar:
      'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534856515077-31534856527229.png',
    header_chose: 0,
    language_code: 'zh-CN',
    qa_feedback: 'SDK_QA_FEEDBACK_ON',
    screen_ratio: 100,
    theme_chose: 1,
    theme_color: '#0e74b3',
    title: '吾来智能助理',
    user_avatar:
      'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534854173706-41534855030375.png',
    user_avatar_chose: 0
  },
  start_ts: '1600842673886',
  user_id: ''
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
  screen_ratio: 100,
  language_code: ''
}

const initImg =
  'https://aibici-test.oss-cn-beijing.aliyuncs.com/rc-upload-1534856515077-31534856527229.png'
const closeImg =
  'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/6c64b84b-c00f-4eb4-b358-6880766adaa7.png'
class App extends Nerv.Component<IProps, IState> {
  $content: HTMLDivElement | null = null
  timer = null
  autoTimer = null
  bodyEl = document.body
  top = 0
  isPhone = document.body.clientWidth <= 414

  props: IProps
  state: IState = {
    pageConfig: initialPage,
    startTs: '',
    // 默认false
    visibile: Boolean(window.sessionStorage.getItem('webSdkVisible')),
    isPhone: false,
    errHeader: {
      visibile: false,
      message: ''
    },
    isError: false,
    allArrowVisible: false
  }

  componentWillReceiveProps({ rtMsgList }: IProps) {
    const old = this.props

    if (old.rtMsgList.length !== rtMsgList.length) {
      setTimeout(() => this.scrollToBottom(), 320)
    }
  }

  async componentDidMount() {
    const { pubkey, userInfo, secret } = this.props

    // pubkey和用户信息存到端上
    window.localStorage.setItem('PVT_SDK_PUBKEY', pubkey)
    window.localStorage.setItem('PVT_SDK_SECRET', secret)

    const isPhone = document.body.clientWidth <= 414
    this.setState({ isPhone }, () => {
      if (this.state.visibile && isPhone) {
        this.showMask()
      }
    })

    const localUserInfo = getUserInfo() ? getUserInfo()[pubkey] : null
    const initUserInfo = {
      userId: getRandomString(16),
      userAvatar: '',
      nickName: ''
    }

    // 传入的用户信息 > 端上存的信息，如果都没有新创建一个用户
    const user = userInfo || (localUserInfo ? localUserInfo : initUserInfo)

    if (!(userInfo || localUserInfo)) {
      // 如果没有用户的话、创建一个用户

      try {
        const data = await createUser(user)
        // 返回{}\ 表明创建成功、此时user.userId就是之后调开放平台接口的userId
      } catch (err) {
        console.log('创建用户失败', err)
      }
    }

    this.startLogin(pubkey, user, secret)

    setTimeout(() => {
      this.scrollToBottom()
    }, 1000)
  }

  componentWillUnmount() {
    window.removeEventListener('offline', this.onOfflineChange)
    window.removeEventListener('online', this.onOnlineChange)
    this.stopSillyCheck()
  }

  toogleAllArrowVisible = (visible: boolean) => {
    this.setState({ allArrowVisible: visible })
  }

  /**
   * @param isFixed 是否进行固定
   */
  stopBodyScroll = isFixed => {
    if (isFixed) {
      this.top = this.bodyEl.scrollTop || document.documentElement.scrollTop
      this.bodyEl.style.cssText +=
        'position:fixed;width:100%;top:-' + this.top + 'px;'
    } else {
      this.bodyEl.style.position = ''
      const top = this.bodyEl.style.top
      this.bodyEl.scrollTop = document.documentElement.scrollTop = -parseInt(
        top,
        10
      )
      this.bodyEl.style.top = ''
    }
  }

  showMask = () => {
    const { isPhone } = this.state
    this.setState({ visibile: true }, this.handleVisible())

    if (isPhone) {
      const ele = document.getElementById('mask')
      if (ele) {
        ele.style.display = 'block'
      }
      this.stopBodyScroll(true)
    }
  }

  hiddenMask = () => {
    const { isPhone } = this.state
    this.setState({ visibile: false }, this.handleVisible())

    if (isPhone) {
      const ele = document.getElementById('mask')
      if (ele) {
        ele.style.display = 'none'
      }
      this.stopBodyScroll(false)
    }
  }

  startLogin = async (pubkey, user, secret) => {
    // @ts-ignore
    if (defaultUserInfo.code) {
      // @ts-ignore
      this.props.openTipsModal(defaultUserInfo.message)
      this.setState({ isError: true })
      return
    }
    // 功能设置
    interactionConfig.set(defaultUserInfo.interaction_config)

    // 设置页面样式到全局
    PageConfig.set(defaultUserInfo.page_config)

    // 设置语言
    language.set(defaultUserInfo.page_config.language_code)

    this.setState(
      {
        pageConfig: defaultUserInfo.page_config,
        startTs: defaultUserInfo.start_ts
      },
      () => this.addStyleByJs()
    )

    const input = {
      pubkey,
      userId: user.userId
    }

    if (!getUserInfo()) {
      const userInfo = {}
      userInfo[`${pubkey}`] = input
      window.localStorage.setItem('PVT_SDK_USER_INFO', JSON.stringify(userInfo))
    } else {
      const info = getUserInfo()
      info[pubkey] = input
      window.localStorage.setItem('PVT_SDK_USER_INFO', JSON.stringify(info))
    }

    // 如果默认是关闭的状态 需要读取“自动邀请会话”配置
    if (!this.props.autoOpen) {
      const autoPop = defaultUserInfo.interaction_config.auto_pop
      if (autoPop > 0) {
        this.applySillyCheck('autoPop', autoPop)
      }
    }

    this.setUserTag()

    window.websdk = {
      toggleSDkVisible: (visible?: boolean) => this.togglePanel(visible)
    }

    window.addEventListener('offline', this.onOfflineChange)
    window.addEventListener('online', this.onOnlineChange)
  }

  applySillyCheck = (type: 'popAfter' | 'autoPop', time: number) => {
    const id = setInterval(() => {
      this.togglePanel()
      this.stopSillyCheck()
    }, time * 1000)

    type === 'popAfter' ? (this.timer = id) : (this.autoTimer = id)
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

  handleVisible = () => {
    if (this.state.visibile) {
      this.stopSillyCheck()
    } else {
      const popAfterClose = interactionConfig.get('pop_after_close') as number
      if (popAfterClose > 0) {
        this.applySillyCheck('popAfter', popAfterClose)
      }
    }
  }

  // 控制会话框显示/隐藏
  togglePanel = (visible: boolean = !this.state.visibile) => {
    this.setState({ visibile: visible }, this.handleVisible())
  }

  render() {
    const {
      imageModal,
      videoModal,
      closeImageModal,
      closeVideoModal,
      fullScreen,
      pos,
      toastPanel,
      tipsModal
    } = this.props
    const {
      pageConfig,
      startTs,
      visibile,
      isPhone,
      errHeader,
      isError,
      allArrowVisible
    } = this.state

    // 主题颜色
    const backgroundColor = pageConfig.theme_color
    // 标题栏头像形状
    const avatarShape = HEADER_AVATAR_SHAPE[pageConfig.avatar_shape]
    // 窗口形状
    const borderShape = FRAME_SHAPE[pageConfig.frame_shape]
    // 是否展示历史消息
    const showHistory = !isError ? interactionConfig.get('show_history') : false
    // header_chose 0是默认 1是自定义 2表示禁用
    const isShowHeaderAvatar =
      pageConfig.header_chose !== 2 && Boolean(pageConfig.header_avatar)
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
    window.sessionStorage.setItem('webSdkVisible', !isHiddenApp ? 'true' : '')

    const isFullScreen =
      !this.isPhone && fullScreen ? styles['full-container'] : ''
    const containerStyle = `${styles.container} ${borderShape} ${isHiddenApp} ${isFullScreen}`
    const windowHeight = this.isPhone ? `${pageConfig.screen_ratio}%` : null

    return (
      <Nerv.Fragment>
        <div className={`${styles.app} ${largePanel}`} style={position}>
          <div className={styles.mask} onClick={this.hiddenMask} id="mask" />
          <div
            className={containerStyle}
            style={{ height: windowHeight }}
            id="sdk-container"
          >
            <header className={styles.header} id="sdk-header">
              <dl>
                {isShowHeaderAvatar ? (
                  <dt>
                    <img
                      className={avatarShape}
                      src={pageConfig.header_avatar}
                      style={
                        !pageConfig.header_chose ? { backgroundColor } : null
                      }
                    />
                  </dt>
                ) : null}
                <dd>{pageConfig.title}</dd>
              </dl>

              <i
                className={styles.closeBtn}
                onClick={this.hiddenMask}
                id="sdk-close-btn"
              >
                <img
                  src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/9c2ad2c1-1ffb-4f2c-8a2b-460109be9408.png"
                  id="sdk-close-img"
                />
              </i>
            </header>

            <main
              className={styles.msgContainer}
              ref={this.setContentRef}
              id="msg-scroll-panel"
            >
              {showHistory ? <HistoryMsgPanel startTs={startTs} /> : null}
              <RtMsgPanel />
            </main>

            <footer className={styles.footer} id="footer">
              {isRenderChatInput ? (
                <Nerv.Fragment>
                  <QuickReply
                    allArrowVisible={allArrowVisible}
                    toogleAllArrowVisible={this.toogleAllArrowVisible}
                  />
                  <ChatInput
                    toogleAllArrowVisible={this.toogleAllArrowVisible}
                  />
                </Nerv.Fragment>
              ) : null}
            </footer>

            {tipsModal.visible ? (
              <TipsModal message={tipsModal.message} />
            ) : null}
            {toastPanel.visible ? <Toast message={toastPanel.message} /> : null}
          </div>

          <div
            className={`${styles.entryImg} ${
              styles[`enterImg-${enterImgSize}`]
            }`}
            style={{
              backgroundColor:
                visibile || !pageConfig.entry_image_chose
                  ? backgroundColor
                  : 'initial',
              display: `${
                (isPhone && visibile) || isFullScreen ? 'none' : 'inline-block'
              }`
            }}
            onClick={visibile ? this.hiddenMask : this.showMask}
          >
            <img
              src={visibile ? closeImg : enterImg}
              className={enterImgStyle}
            />
          </div>

          {errHeader.visibile ? (
            <ErrorHeader message={errHeader.message} isFull={isFull} />
          ) : null}
        </div>

        {imageModal.visible ? (
          <ImgModal url={imageModal.src} closeImageModal={closeImageModal} />
        ) : null}

        {videoModal.visible ? (
          <VideoModal url={videoModal.src} closeVideoModal={closeVideoModal} />
        ) : null}
      </Nerv.Fragment>
    )
  }
}

const mapStateToProps = ({ todos }: { todos: IAuthState }) => ({
  rtMsgList: todos.rtMsgList,
  imageModal: todos.imageModal,
  videoModal: todos.videoModal,
  toastPanel: todos.toastPanel,
  tipsModal: todos.tipsModal
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setRtMsgs: message => dispatch(setRtMsgs(message)),
  closeImageModal: () => dispatch(closeImageModal(null)),
  closeVideoModal: () => dispatch(closeVideoModal(null)),
  openTipsModal: (message: string) =>
    dispatch(toggleTipsModal({ visible: true, showBtn: false, message }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App) as any
