import * as Nerv from 'nervjs'
import { connect, Dispatch } from 'nerv-redux'

import * as styles from './ChatInput.less'

import {
  page as PageConfig,
  TRACK_DIRECTION,
  interactionConfig
} from '../../utils/config'
import { createTextMsg, pushRtMessage, getReply } from '../../utils/message'

import { setRtMsgs } from '../../actions'
import { log } from '../../data/app.data'
import { pushMsg } from '../../data/message.data'

import { IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  allArrowVisible: boolean
  quickReplys: string[]
  setRtMsgs: (msg: IMsgBodyInfo) => void
  toogleAllArrowVisible: (visible: boolean) => void
}

interface IState {
  showAllVisible: boolean
}

class QuickReplyMsg extends Nerv.Component {
  props: IProps
  // 标志目前滚动到第几个快捷回复了
  index: number = 0
  offsetWidth: number = 0

  $ul: HTMLUListElement | null
  ele = null
  isPhone = false
  ulScrollLeft: number = 0
  maxHeight: string = '70vh'
  timer: any = null

  state: IState = {
    showAllVisible: true
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.ele = document.getElementById('msg-scroll-panel')
      this.maxHeight = this.ele ? this.ele.clientHeight * 0.7 + 'px' : '70vh'
    }, 200)

    this.moveQuickReplyList()
    this.isPhone = document.body.clientWidth <= 414
  }

  componentDidUpdate = prevProps => {
    if (prevProps.quickReplys !== this.props.quickReplys) {
      this.moveQuickReplyList()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  moveQuickReplyList = () => {
    if (!this.$ul) {
      return false
    }

    this.setState({
      showAllVisible: this.$ul.scrollWidth > this.$ul.clientWidth
    })
  }

  // 发送消息
  sendQuickReplyMsg = (msg: string) => async () => {
    const { setRtMsgs } = this.props
    const content = createTextMsg(msg)

    const { msg_id } = await pushMsg(content)
    log({ msg_id, direction: TRACK_DIRECTION.user })

    // 发送完成后调用机器人回复接口
    getReply(setRtMsgs, content)

    this.handleShowAll(false)
    const message = pushRtMessage(content.msg_body, content.msg_type, msg_id)
    setRtMsgs(message)
  }

  /**
   * 展开全部
   */
  handleShowAll = (visible: boolean) => {
    const { toogleAllArrowVisible } = this.props

    // 展开的时候不让内容区域滚动
    if (this.ele) {
      this.ele.style.overflowY = visible ? 'hidden' : 'auto'
    }

    if (this.$ul) {
      this.$ul.scrollLeft = visible ? 0 : this.ulScrollLeft
    }

    // 手机端的时候、点击展开的时候让键盘收起
    if (this.isPhone && visible) {
      // 获取到输入框、让其失焦
      const inputEle = document.getElementById('footerTextarea')
      if (inputEle && this.$ul) {
        inputEle.blur()
        this.$ul.style.maxHeight = this.maxHeight
      }
    }

    toogleAllArrowVisible(visible)
  }

  handleUlScroll = () => {
    const { allArrowVisible } = this.props

    if (!allArrowVisible) {
      this.ulScrollLeft = this.$ul.scrollLeft
    }
  }

  render() {
    const { quickReplys, allArrowVisible } = this.props
    const { showAllVisible } = this.state

    if (!quickReplys || !quickReplys.length) return null

    const bgColor = PageConfig.get('theme_color') as string
    const showLogo = interactionConfig.get('enable_wulai_ad') as boolean

    return (
      <div
        className={`${styles['quick-reply']} ${
          allArrowVisible ? styles['all-reply'] : ''
        }`}
        id="replay"
        key="replay-panel"
        style={showLogo ? { top: '-68px' } : null}
      >
        <div className={styles.replyList} id="replyList">
          <ul
            ref={el => (this.$ul = el)}
            onScroll={this.handleUlScroll}
            style={{ maxHeight: this.maxHeight }}
          >
            {quickReplys.map((item, index) => (
              <li
                key={`${index}-${item}`}
                style={{ backgroundColor: bgColor }}
                onClick={this.sendQuickReplyMsg(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {showAllVisible ? (
          <div
            onClick={() => this.handleShowAll(!allArrowVisible)}
            className={`${styles.arrowContainer}`}
          >
            <span>{allArrowVisible ? '收起' : '展开'}</span>
            <span
              className={`${styles.arrow} ${
                allArrowVisible ? styles.bottomArrow : null
              }`}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  quickReplys: state.todos.quickReplys
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setRtMsgs: message => dispatch(setRtMsgs(message))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickReplyMsg)
