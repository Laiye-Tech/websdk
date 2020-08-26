import * as Nerv from 'nervjs'
import * as styles from './ChatInput.less'
import { connect, Dispatch } from 'nerv-redux'

import { setRtMsgs, setUserSugList, toggleToastPanel } from '../../actions'
import { getStsToken, log } from '../../data/app.data'
import { pushMsg } from '../../data/message.data'
import { getUserInputSugList } from '../../data/user.data'

import SugList from './SugList'

import { debounce, getOssUrl } from '../../utils'
import {
  TEXTAREA_SHAPE,
  page as PageConfig,
  language,
  interactionConfig,
  TRACK_DIRECTION
} from '../../utils/config'
import {
  createTextMsg,
  pushRtMessage,
  createImageMsg
} from '../../utils/message'
import { IMsgBodyInfo, MSG_TYPE, ISugList } from '../../../interfaces'

interface IProps {
  userSugList: ISugList[]
  setRtMsgs: (msg: IMsgBodyInfo) => void
  setUserSugList: (sugList: ISugList[]) => void
  openToastPanel: (message: string) => void
}

interface IState {
  textContent: string
  showSug: boolean
  isPhone: boolean
}

const KEY = { DEL: 8, TAB: 9, RETURN: 13, ESC: 27, UP: 38, DOWN: 40 }
const defaultHeight = 24
class ChatInput extends Nerv.Component<IProps, IState> {
  $textarea: HTMLTextAreaElement | null
  $input: HTMLInputElement | null = null
  props: IProps
  lastLength = 0
  lastHeight = defaultHeight

  state: IState = {
    textContent: '',
    showSug: interactionConfig.get('fuzzy_sug') as boolean,
    isPhone: false
  }

  componentDidMount() {
    const isPhone = document.body.clientWidth <= 414
    this.setState({ isPhone })

    const ua = window.navigator.userAgent.toLocaleLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(ua)
    const isAndroid = /android/.test(ua)

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

      const container = document.getElementById('sdk-container')
      const footer = document.getElementById('footer')
      const containerHeight = container.style.height

      if (isIOS && container && footer) {
        this.$textarea.addEventListener('focus', () => {
          // 让输入框保持在视图内
          footer.scrollIntoView()
          container.style.height = '45%'
        })

        this.$textarea.addEventListener('blur', () => {
          container.style.height = containerHeight
        })
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userSugList !== this.props.userSugList) {
      if (this.$textarea) {
        this.$textarea.focus()
      }
    }
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
  inputAnswer = debounce((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { userSugList } = this.props
    const { isPhone } = this.state

    if (userSugList.length && isPhone) {
      // 如果有sug的话、定位高度随之变化
      this.changeuserSugListBottom()
    }

    // 使用$textarea是为了兼容RPA机器人
    const value = this.$textarea ? this.$textarea.value : event.target.value
    this.setState({ textContent: value })

    if (this.state.showSug) {
      // 如果value是空 不需要调接口
      value ? this.getUserSugList(value) : this.clearSugList()
    }
  }, 500)

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
      const { msg_id } = await pushMsg(msg)
      log({ msg_id, direction: TRACK_DIRECTION.user })
      const message = pushRtMessage(msg.msg_body, msg.msg_type, msg_id)
      this.props.setRtMsgs(message)

      // 清空输入框 & 清空用户输入联想sug
      this.setState({ textContent: '' })
      this.clearSugList()

      // 如果输入框变高的话、将其重置
      if (this.lastHeight !== defaultHeight) {
        this.$textarea.style.height = defaultHeight + 'px'
        this.lastLength = 0
        this.lastHeight = defaultHeight
      }
    } catch (err) {
      console.log('err --->', err)
    }
  }

  // 发送图片消息
  onInputChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const urls = await this.handleUpload(evt)
    if (urls) {
      this.sendMsg('IMAGE', urls[0])
    }

    if (this.$input) {
      this.$input.value = ''
    }
  }

  // 上传
  handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files.length) {
      return
    }

    const file: any = evt.target.files[0] // 获取当前选中的文件
    const imgMasSize = 1024 * 1024 * 10 // 10MB

    const uploader = language.get('Uploader')

    // 检查文件类型
    if (['jpeg', 'png', 'gif'].indexOf(file.type.split('/')[1]) < 0) {
      this.props.openToastPanel(uploader.imgType)
      return
    }

    // 文件大小限制
    if (file.size > imgMasSize) {
      this.props.openToastPanel(uploader.imgSize)
      return
    }

    const stsToken = await getStsToken()

    try {
      const res = await getOssUrl(stsToken, file)
      return res
    } catch (err) {
      this.props.openToastPanel(err.message)
    }
  }

  render() {
    const { userSugList } = this.props
    const { textContent, isPhone } = this.state

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
            type="file"
            accept="image/*"
            className={styles.uploader}
            onChange={this.onInputChange}
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
      </div>
    )

    return (
      <div className={`${styles.footerInput}`}>
        {isPhone ? renderLeft : null}
        <div className={`${styles.chatInput} ${chatShape}`} id="chatInput">
          {!isPhone ? renderLeft : null}
          <textarea
            style={{ height: `${isPhone ? '24px' : '56px'}` }}
            placeholder={`${placeholder}`}
            maxLength={2000}
            ref={input => (this.$textarea = input)}
            value={textContent}
            onChange={this.inputAnswer}
            onKeyDown={this.handleKeyDown}
          />

          <div className={styles.toolbar}>
            <div
              className={styles.pullRight}
              style={{ backgroundColor: bgColor }}
              onClick={this.onPressEnter}
            >
              <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/c90a8872-8913-43cc-943b-f496c6c8fdf5.png" />
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
