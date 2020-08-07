import * as Nerv from 'nervjs'
import { connect, Dispatch } from 'nerv-redux'

import * as styles from './ChatInput.less'

import {
  page as PageConfig,
  TRACK_DIRECTION,
  interactionConfig
} from '../../utils/config'
import { createTextMsg, pushRtMessage } from '../../utils/message'

import { setRtMsgs } from '../../actions'
import { log } from '../../data/app.data'
import { pushMsg } from '../../data/message.data'

import { IMsgBodyInfo } from '../../../interfaces'

interface IProps {
  quickReplys: string[]
  setRtMsgs: (msg: IMsgBodyInfo) => void
}

interface IState {
  leftArrowVisible: boolean
  rightArrowVisible: boolean
}

class QuickReplyMsg extends Nerv.Component {
  props: IProps
  index: number = 0

  $ul: HTMLUListElement | null

  state: IState = {
    leftArrowVisible: false,
    rightArrowVisible: false
  }

  componentDidMount() {
    this.moveQuickReplyList()()
  }

  componentDidUpdate = prevProps => {
    if (prevProps.quickReplys !== this.props.quickReplys) {
      this.moveQuickReplyList()()
    }
  }

  moveQuickReplyList = (direction?: 'left' | 'right') => () => {
    if (!this.props.quickReplys.length || !this.$ul) return

    if (typeof direction !== 'undefined') {
      direction === 'right' ? (this.index += 1) : (this.index -= 1)
    }

    const ulWith = this.$ul.clientWidth
    const ulScrollWith = this.$ul.scrollWidth
    const children = Array.prototype.slice.call(this.$ul.children)

    // 获取翻页页数
    const pageSize = Math.ceil(ulScrollWith / ulWith)

    if (pageSize > 1) {
      this.setState({ rightArrowVisible: true })
    }

    // 计算滚动距离
    let leftWidth = 0
    for (let i = 0; i < this.index; i++) {
      leftWidth += children[i].clientWidth + 8
    }

    this.$ul.style.transform = `translateX(-${leftWidth}px)`
    this.$ul.style.transition = 'all .3s'

    if (this.index <= children.length - 2 && this.index > 0) {
      this.setState({ rightArrowVisible: true, leftArrowVisible: true })
    }

    if (this.index <= 0) {
      this.setState({ leftArrowVisible: false })
    }

    if (this.index === children.length - 1 || this.index === pageSize) {
      this.setState({ rightArrowVisible: false })
    }
  }

  // 发送消息
  sendQuickReplyMsg = (msg: string) => async () => {
    const content = createTextMsg(msg)

    const { msg_id } = await pushMsg(content)
    log({ msg_id, direction: TRACK_DIRECTION.user })

    const message = pushRtMessage(content.msg_body, content.msg_type, msg_id)
    this.props.setRtMsgs(message)
  }

  render() {
    const { quickReplys } = this.props

    if (!quickReplys.length) return null

    const { leftArrowVisible, rightArrowVisible } = this.state
    const bgColor = PageConfig.get('theme_color') as string
    const showLogo = interactionConfig.get('enable_wulai_ad') as boolean
    return (
      <div
        className={styles['quick-reply']}
        style={showLogo ? { top: '-68px' } : null}
      >
        <div
          className={styles.arrow}
          onClick={this.moveQuickReplyList('left')}
          style={{ display: leftArrowVisible ? 'block' : 'none' }}
        >
          <span />
        </div>

        <div className={styles.replyList}>
          <ul ref={el => (this.$ul = el)}>
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

        <div
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={this.moveQuickReplyList('right')}
          style={{ display: rightArrowVisible ? 'block' : 'none' }}
        >
          <span />
        </div>
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
