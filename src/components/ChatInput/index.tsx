import * as Nerv from 'nervjs'
import * as styles from './ChatInput.less'
import { connect, Dispatch } from 'nerv-redux'

import { setRtMsgs, setUserSugList } from '../../actions'
import { getStsToken } from '../../data/app.data'
import { pushMsg } from '../../data/message.data'
import { getUserInputSugList } from '../../data/user.data'

import SugList from './SugList'

import { debounce, getOssUrl } from '../../utils'
import { TEXTAREA_SHAPE, page as PageConfig, language } from '../../utils/config'
import { createTextMsg, pushRtMessage, createImageMsg } from '../../utils/message'
import { IMsgBodyInfo, MSG_TYPE, ISugList } from '../../../interfaces'

interface IProps {
  userSugList: ISugList[]
  setRtMsgs: (msg: IMsgBodyInfo) => void
  setUserSugList: (sugList: ISugList[]) => void
}

interface IState {
  textContent: string
}

const KEY = { DEL: 8, TAB: 9, RETURN: 13, ESC: 27, UP: 38, DOWN: 40 }
class ChatInput extends Nerv.Component<IProps, IState> {
  $textarea: HTMLTextAreaElement | null
  props: IProps

  state: IState = {
    textContent: ''
  }

  // 清空用户输入联想
  clearSugList = () => {
    this.props.setUserSugList([])
  }

  // 监听输入框变化 用函数防抖 减少接口请求次数
  inputAnswer = debounce((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 使用$textarea是为了兼容RPA机器人
    const value = this.$textarea ? this.$textarea.value : event.target.value
    this.setState({ textContent: value })

    // 如果value是空的话 不需要调接口
    value ? this.getUserSugList(value) : this.clearSugList()
  }, 500)

  // 获取用户输入联想
  getUserSugList = async (value: string) => {
    const res = await getUserInputSugList(value)
    this.props.setUserSugList(res)
  }

  handleKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    const textContent = this.$textarea ? this.$textarea.value : this.state.textContent
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
      const message = pushRtMessage(msg.msg_body, msg.msg_type, msg_id)
      this.props.setRtMsgs(message)

      // 清空输入框 & 清空用户输入联想sug
      this.setState({ textContent: '' })
      this.clearSugList()
    } catch (err) {
      console.log('err --->', err)
    }
  }

  // 发送图片消息
  onInputChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const urls = await this.handleUpload(evt)
    this.sendMsg('IMAGE', urls[0])
  }

  // 上传
  handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files.length) {
      return
    }

    const file: any = evt.target.files[0] // 获取当前选中的文件
    const imgMasSize = 1024 * 1024 * 10 // 10MB

    // 检查文件类型
    if (['jpeg', 'png', 'gif'].indexOf(file.type.split('/')[1]) < 0) {
      console.error('图片类型仅支持 jpeg/png/gif')
      return
    }

    // 文件大小限制
    if (file.size > imgMasSize) {
      console.error('图片大小不能超过10MB哦')
      return
    }

    const stsToken = await getStsToken()
    return getOssUrl(stsToken, file)
  }

  render() {
    const { userSugList } = this.props
    const { textContent } = this.state

    const frameShape = PageConfig.get('frame_shape') as number
    const themeColor = PageConfig.get('theme_color') as string
    const chatShape = TEXTAREA_SHAPE[frameShape]
    const bgColor = textContent ? themeColor : '#b3bdc5'
    const placeholder = language.get('ChatInput').pcPlaceholder

    return(
      <div className={`${styles.chatInput} ${chatShape}`}>
        <textarea
          placeholder={`${placeholder}`}
          maxLength={2000}
          ref={input => this.$textarea = input}
          value={textContent}
          onChange={this.inputAnswer}
          onKeyDown={this.handleKeyDown}
        />

        <div className={styles.toolbar}>
          <div className={styles.pullLeft}>
            <div className={styles.picture}>
              <input type="file" accept="image/*" className={styles.uploader} onChange={this.onInputChange}/>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                  <path id="instagram" fill="#b3bdc5" d="M17.429 9.714a.857.857 0 1 1 0-1.715.857.857 0 0 1 0 1.715M12 15.428A3.432 3.432 0 0 1 8.571 12 3.432 3.432 0 0 1 12 8.571 3.432 3.432 0 0 1 15.429 12 3.432 3.432 0 0 1 12 15.428m6.286-9.714H12A1.716 1.716 0 0 0 10.286 4H9.142a1.717 1.717 0 0 0-1.714 1.714H5.714A1.717 1.717 0 0 0 4 7.43v9.142a1.717 1.717 0 0 0 1.714 1.715h12.572A1.717 1.717 0 0 0 20 16.57V7.43a1.716 1.716 0 0 0-1.714-1.715"/>
                </g>
              </svg>
            </div>
          </div>

          <div className={styles.pullRight} style={{ backgroundColor: bgColor }} onClick={this.onPressEnter}>
            <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/c90a8872-8913-43cc-943b-f496c6c8fdf5.png"/>
          </div>
        </div>

        {userSugList.length ? (
          <SugList sendMsg={this.sendMsg}/>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userSugList: state.todos.sugList
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setRtMsgs: message => dispatch(setRtMsgs(message)),
  setUserSugList: (sug: ISugList[]) => dispatch(setUserSugList(sug))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput) as any
