import * as Nerv from 'nervjs'
import * as styles from './ChatInput.less'
import { connect, Dispatch } from 'nerv-redux'

import { setRtMsgs, setUserSugList, toggleToastPanel } from '../../actions'
import { pushMsg } from '../../data/message.data'
import { getUserInputSugList } from '../../data/user.data'

import SugList from './SugList'

import { debounce, getOssUrl } from '../../utils'
import {
  TEXTAREA_SHAPE,
  page as PageConfig,
  language,
  interactionConfig,
  TRACK_DIRECTION,
  PVT_URL
} from '../../utils/config'
import {
  createTextMsg,
  pushRtMessage,
  createImageMsg,
  getReply
} from '../../utils/message'
import { IMsgBodyInfo, MSG_TYPE, ISugList } from '../../../interfaces'

interface IProps {
  userSugList: ISugList[]
  setRtMsgs: (msg: IMsgBodyInfo) => void
  setUserSugList: (sugList: ISugList[]) => void
  openToastPanel: (message: string) => void
  toogleAllArrowVisible: (visible: boolean) => void
}

interface IState {
  textContent: string
  showSug: boolean
  isPhone: boolean
  openVoice: boolean
}

const KEY = { DEL: 8, TAB: 9, RETURN: 13, ESC: 27, UP: 38, DOWN: 40 }
const defaultHeight = 24

class ChatInput extends Nerv.Component<IProps, IState> {
  $textarea: HTMLTextAreaElement | null
  $input: HTMLInputElement | null = null
  props: IProps
  lastLength = 0
  lastHeight = defaultHeight
  containerHeight = ''
  timer = null
  ws = null

  state: IState = {
    textContent: '',
    showSug: interactionConfig.get('fuzzy_sug') as boolean,
    isPhone: false,
    openVoice: false
  }

  componentDidMount() {
    const isPhone = document.body.clientWidth <= 414
    const clientHeight =
      document.body.clientHeight || document.documentElement.clientHeight

    this.setState({ isPhone })

    const container = document.getElementById('sdk-container')

    if (container) {
      this.containerHeight = container.style.height
    }

    const ua = window.navigator.userAgent.toLocaleLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)
    const isXiaomi = /mi\s | redmi | mix\s/.test(ua)

    if (isPhone && this.$textarea) {
      this.$textarea.addEventListener('input', () => {
        const currentLength = this.$textarea.value.length

        // 判断字数如果比之前少了，说明内容正在减少，需要清除高度样式，重新获取
        if (currentLength < this.lastLength) {
          this.$textarea.style.height = ''
        }

        const currentHeight = this.$textarea.scrollHeight

        // 如果内容高度发生了变化，再去设置高度值
        if (this.lastHeight !== currentHeight || !this.$textarea.style.height) {
          this.$textarea.style.height = currentHeight + 'px'
        }

        this.lastLength = currentLength
        this.lastHeight = currentHeight
      })

      if (isIOS && container) {
        window.addEventListener('focusin', () => {
          container.style.height = '45%'
        })

        window.addEventListener('focusout', () => {
          container.style.height = this.containerHeight
        })
      }

      // 小米上输入法会盖住输入框部分
      if (isXiaomi && container) {
        window.addEventListener('focusin', () => {
          container.style.marginBottom = '40px'
        })

        window.addEventListener('focusout', () => {
          container.style.marginBottom = '0px'
        })
      }
    }

    const wsUrl = 'ws://127.0.0.1:8089/astRecordEndpoint/22.100.10.10:4567'
    this.ws = new WebSocket(wsUrl)

    this.ws.onmessage = event => {
      this.setState({ textContent: event.data.content })
    }
  }

  componentWillMount() {
    this.ws.close()
    clearTimeout(this.timer)
  }

  changeuserSugListBottom = () => {
    const chatInput = document.getElementById('chatInput')
    const sugContainer = document.getElementById('sugContainer')

    if (sugContainer && chatInput) {
      sugContainer.style.bottom = `${chatInput.clientHeight + 8}px`
    }
  }

  // 清空用户输入联想
  clearSugList = () => {
    this.props.setUserSugList([])
  }

  // 监听输入框变化 用函数防抖 减少接口请求次数
  inputAnswer = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { userSugList } = this.props
    const { isPhone } = this.state
    // 使用$textarea是为了兼容RPA机器人
    const value = this.$textarea ? this.$textarea.value : event.target.value

    this.setState(
      { textContent: value },
      debounce(() => {
        if (userSugList.length && isPhone) {
          // 如果有sug的话、定位高度随之变化
          this.changeuserSugListBottom()
        }
        // if (this.state.showSug) {
        //   // 如果value是空 不需要调接口
        //   value ? this.getUserSugList(value) : this.clearSugList()
        // }
      }),
      500
    )
  }

  // 获取用户输入联想
  getUserSugList = async (value: string) => {
    const res = await getUserInputSugList(value)

    // 如果用户发送的比较快 sug不需要展示
    if (this.state.textContent) {
      this.props.setUserSugList(res)
    }
  }

  // 只针对pc端
  handleKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { isPhone } = this.state

    if (isPhone) {
      return
    }

    evt.stopPropagation()

    switch (evt.keyCode) {
      case KEY.RETURN:
        this.onPressEnter(evt)
        break

      default:
        break
    }
  }

  onPressEnter = (evt: any) => {
    const event = evt.nativeEvent as KeyboardEvent
    const textContent = this.$textarea
      ? this.$textarea.value
      : this.state.textContent
    const text = textContent.replace(/(^\s*)|(\s*$)/g, '')
    if (!text) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    // 13 = enter
    if (event.shiftKey && event.keyCode === 13) {
      // 换行
      console.log('换行 > ', text)
    } else {
      event.preventDefault()
      event.stopPropagation()

      this.sendMsg('TEXT', text)
    }
  }

  // 发消息
  sendMsg = async (msgType: MSG_TYPE, content: any) => {
    const { setRtMsgs } = this.props
    let msg = null

    switch (msgType) {
      case 'TEXT':
        msg = createTextMsg(content)
        break
      case 'IMAGE':
        msg = createImageMsg(content)
        break
      default:
        break
    }

    if (!msg) {
      return
    }

    try {
      // const { msg_id } = await pushMsg(msg)
      const message = pushRtMessage(msg.msg_body, msg.msg_type, '')

      setRtMsgs(message)
      // 清空输入框 & 清空用户输入联想sug
      this.setState({ textContent: '' })

      this.clearSugList()

      // 如果输入框变高的话、将其重置
      if (this.lastHeight !== defaultHeight && this.$textarea) {
        this.$textarea.style.height = defaultHeight + 'px'
        this.lastLength = 0
        this.lastHeight = defaultHeight
      }

      // 发送完成后调用机器人回复接口
      getReply(setRtMsgs, msg.msg_body)
    } catch (err) {
      console.log('err --->', err)
    }
  }

  // 上传
  upload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files.length) {
      return
    }

    const file: any = evt.target.files[0] // 获取当前选中的文件
    const imgMasSize = 1024 * 1024 * 10 // 10MB

    const uploader = language.get('Uploader')

    // 文件大小限制
    if (file.size > imgMasSize) {
      this.props.openToastPanel(uploader.imgSize)
      return
    }

    const formData = new FormData()
    formData.append('img', file)

    const xhr = new XMLHttpRequest()

    const data = xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        return
      }

      const data = JSON.parse(xhr.response)
      const { successfully, rows } = data

      if (successfully) {
        if (rows[0].url) {
          this.sendMsg('IMAGE', rows[0].url)
        }

        if (this.$input) {
          this.$input.value = ''
        }
      }
    })

    xhr.open('post', `${PVT_URL}/paas-knowledge/oss/upload`, true)
    const fd = new FormData()
    fd.append('upfiles', file)

    xhr.send(fd)
  }

  // 开始接收语音信息
  handleOpenVoice = () => {
    const { openVoice } = this.state

    this.setState({ openVoice: !this.state.openVoice }, () => {
      if (openVoice) {
        this.ws.send('start')
      } else {
        this.ws.send('stop')
      }
    })
  }

  render() {
    const { userSugList, toogleAllArrowVisible } = this.props
    const { textContent, isPhone, openVoice } = this.state

    const frameShape = PageConfig.get('frame_shape') as number
    const themeColor = PageConfig.get('theme_color') as string
    const chatShape = TEXTAREA_SHAPE[frameShape]
    const bgColor = textContent ? themeColor : '#b3bdc5'
    const pcPlaceholder = language.get('ChatInput').pcPlaceholder || ''
    const mobilePlaceholder = language.get('ChatInput').placeholder || ''
    const placeholder = isPhone ? mobilePlaceholder : pcPlaceholder
    const wulaiLogo = language.get('Logo').waterMark
    const showLogo = interactionConfig.get('enable_wulai_ad') as boolean

    const renderLeft = (
      <div className={`${styles.pullLeft} ${!isPhone ? styles.pcLeft : null}`}>
        <div className={`${styles.picture} wulai-web-sdk-upload-icon`}>
          <input
            name="img"
            accept=".jpeg, .png, .gif"
            type="file"
            className={styles.uploader}
            onChange={this.upload}
            ref={input => (this.$input = input)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g fill="none" fill-rule="evenodd">
              <path
                id="instagram"
                fill="#b3bdc5"
                d="M17.429 9.714a.857.857 0 1 1 0-1.715.857.857 0 0 1 0 1.715M12 15.428A3.432 3.432 0 0 1 8.571 12 3.432 3.432 0 0 1 12 8.571 3.432 3.432 0 0 1 15.429 12 3.432 3.432 0 0 1 12 15.428m6.286-9.714H12A1.716 1.716 0 0 0 10.286 4H9.142a1.717 1.717 0 0 0-1.714 1.714H5.714A1.717 1.717 0 0 0 4 7.43v9.142a1.717 1.717 0 0 0 1.714 1.715h12.572A1.717 1.717 0 0 0 20 16.57V7.43a1.716 1.716 0 0 0-1.714-1.715"
              />
            </g>
          </svg>
        </div>

        <div
          className={`${
            openVoice ? styles.voiceIconOpen : styles.voiceIconClose
          }`}
          onClick={this.handleOpenVoice}
        />
      </div>
    )

    return (
      <div className={`${styles.footerInput}`}>
        {isPhone ? renderLeft : null}
        <div className={`${styles.chatInput} ${chatShape}`} id="chatInput">
          {!isPhone ? renderLeft : null}
          <textarea
            id="footerTextarea"
            style={{ height: `${isPhone ? '24px' : '56px'}` }}
            placeholder={`${placeholder}`}
            maxLength={2000}
            ref={input => (this.$textarea = input)}
            value={textContent}
            onChange={this.inputAnswer}
            onKeyDown={this.handleKeyDown}
            onFocus={() => toogleAllArrowVisible(false)}
          />

          <div className={styles.toolbar}>
            <div
              className={styles.pullRight}
              style={{ backgroundColor: bgColor }}
              onClick={this.onPressEnter}
            >
              <img src="http://172.17.202.22:9000/laiye-im-saas/websdk/send.png" />
            </div>
          </div>
        </div>

        {userSugList.length ? <SugList sendMsg={this.sendMsg} /> : null}

        {/* 免费版展示水印 */}
        {showLogo ? <img src={wulaiLogo} className={styles.logo} /> : null}
      </div>

      // <div className={`${styles.chatInput} ${chatShape}`}>

      //   {userSugList.length ? <SugList sendMsg={this.sendMsg}/> : null}

      //   {/* 免费版展示水印 */}
      //   {showLogo ? <img src={wulaiLogo} className={styles.logo}/> : null}
      // </div>
    )
  }
}

const mapStateToProps = state => ({
  userSugList: state.todos.sugList
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setRtMsgs: message => dispatch(setRtMsgs(message)),
  setUserSugList: (sug: ISugList[]) => dispatch(setUserSugList(sug)),
  openToastPanel: (message: string) =>
    dispatch(toggleToastPanel({ message, visible: true }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatInput) as any
