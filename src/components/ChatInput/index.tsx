import * as Nerv from 'nervjs'
import * as styles from './ChatInput.style.less'
import { Dispatch } from 'redux'
import { connect } from 'nerv-redux'

import { setRtMsgs } from '../../actions'
import { pushMsg } from '../../data/message.data'
import { createTextMsg, pushRtMessage } from '../../utils/message'
import { IPageConfig, IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  pageConfig: IPageConfig
  setRtMsgs: (msg: IMsgBodyInfo) => void
}

interface IState {
  textContent: string
}

const KEY = { DEL: 8, TAB: 9, RETURN: 13, ESC: 27, UP: 38, DOWN: 40 }
class ChatInput extends Nerv.Component<IProps, IState> {
  props: IProps

  state: IState = {
    textContent: ''
  }

  inputAnswer = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value) {
      this.setState({ textContent: event.target.value })
    }
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

  onPressEnter = async (evt: any) => {
    const event = evt.nativeEvent as KeyboardEvent

    const text = this.state.textContent.replace(/(^\s*)|(\s*$)/g, '')
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

      const msg = createTextMsg(text)
      const { msg_id } = await pushMsg(msg)
      const message = pushRtMessage(msg.msg_body, msg.msg_type, msg_id)
      this.props.setRtMsgs(message)
      this.setState({ textContent: '' })
    }
  }

  render() {
    const { theme_color } = this.props.pageConfig
    const { textContent } = this.state

    return(
      <div className={styles.chatInput}>
        <textarea
          placeholder="输入文字进行回复，Shift+Enter换行"
          maxLength={2000}
          value={textContent}
          onChange={this.inputAnswer}
          onKeyDown={this.handleKeyDown}
        />

        <div className={styles.toolbar}>
          <div className={styles.pullLeft}>
            <div className={styles.picture}>
              <input type="file" accept="image/*" className={styles.uploader}/>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                  <path id="instagram" fill="#b3bdc5" d="M17.429 9.714a.857.857 0 1 1 0-1.715.857.857 0 0 1 0 1.715M12 15.428A3.432 3.432 0 0 1 8.571 12 3.432 3.432 0 0 1 12 8.571 3.432 3.432 0 0 1 15.429 12 3.432 3.432 0 0 1 12 15.428m6.286-9.714H12A1.716 1.716 0 0 0 10.286 4H9.142a1.717 1.717 0 0 0-1.714 1.714H5.714A1.717 1.717 0 0 0 4 7.43v9.142a1.717 1.717 0 0 0 1.714 1.715h12.572A1.717 1.717 0 0 0 20 16.57V7.43a1.716 1.716 0 0 0-1.714-1.715"/>
                </g>
              </svg>
            </div>
          </div>

          <div className={styles.pullRight} style={{ backgroundColor: theme_color }} onClick={this.onPressEnter}>
            <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/c90a8872-8913-43cc-943b-f496c6c8fdf5.png"/>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setRtMsgs: message => dispatch(setRtMsgs(message))
})

export default connect(null, mapDispatchToProps)(ChatInput) as any
