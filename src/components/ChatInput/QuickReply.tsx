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
  allArrowVisible: boolean
}

class QuickReplyMsg extends Nerv.Component {
  props: IProps
  // 标志目前滚动到第几个快捷回复了
  index: number = 0
  offsetWidth: number = 0

  $ul: HTMLUListElement | null
  ele = document.getElementById('msg-scroll-panel')
  isPhone = false
  replyListEle = null

  state: IState = {
    allArrowVisible: false
  }

  componentDidMount() {
    this.moveQuickReplyList()
    this.isPhone = document.body.clientWidth <= 414

    // 监听输入框的状态 、如果是获取焦点、则allArrowVisible 为false
    const inputEle = document.getElementById('footerTextarea')

    if (this.isPhone && inputEle) {
      inputEle.addEventListener('focus', () => {
        this.handleShowAll(false)
      })
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.quickReplys !== this.props.quickReplys) {
      this.moveQuickReplyList()
    }
  }

  moveQuickReplyList = () => {
    if (!this.props.quickReplys.length || !this.$ul) return

    const ulWith = this.$ul.clientWidth
    this.offsetWidth = ulWith / 2
    const ulScrollWith = this.$ul.scrollWidth

    // 获取翻页页数
    const pageSize = Math.ceil(ulScrollWith / ulWith)
    this.setState({ rightArrowVisible: pageSize > 1 ? true : false })
  }

  // 发送消息
  sendQuickReplyMsg = (msg: string) => async () => {
    const content = createTextMsg(msg)

    const { msg_id } = await pushMsg(content)
    log({ msg_id, direction: TRACK_DIRECTION.user })

    this.handleShowAll(false)
    const message = pushRtMessage(content.msg_body, content.msg_type, msg_id)
    this.props.setRtMsgs(message)
  }

  // handleMove = (type: 'right' | 'left') => {
  //   // 每次移动最多半个ul宽度像素
  //   const _scrollLeft = this.$ul.scrollLeft || 0

  //   this.$ul.scrollLeft =
  //     type === 'left'
  //       ? _scrollLeft - this.offsetWidth
  //       : this.offsetWidth + _scrollLeft
  //   this.$ul.style.transition = 'all .3s'

  //   this.handleUlScroll()
  // }

  /**
   * 展开全部
   */
  handleShowAll = (visible: boolean) => {
    this.setState({ allArrowVisible: visible }, () => {
      // 展开的时候不让内容区域滚动
      if (this.ele) {
        this.ele.style.overflowY = this.state.allArrowVisible
          ? 'hidden'
          : 'auto'
      }

      // 手机端的时候、点击展开的时候让键盘收起
      if (this.isPhone && visible) {
        // 获取到输入框、让其失焦
        const inputEle = document.getElementById('footerTextarea')
        if (inputEle) {
          inputEle.blur()
        }
      }
    })
  }

  handleUlScroll = () => {
    // 如果到最右边、显示左边箭头、隐藏右边、反之亦然
    const ulScrollLeft = this.$ul.scrollLeft
    const ulScrollWith = this.$ul.scrollWidth

    // 到达最右边
    this.setState({
      rightArrowVisible:
        ulScrollLeft + this.$ul.clientWidth < ulScrollWith ? true : false
    })

    this.setState({
      leftArrowVisible: ulScrollLeft ? true : false
    })
  }

  render() {
    const { quickReplys } = this.props
    const maxHeight = this.ele ? this.ele.clientHeight * 0.6 + 'px' : '60vh'
    if (!quickReplys.length) return null

    const { allArrowVisible } = this.state
    const bgColor = PageConfig.get('theme_color') as string
    const showLogo = interactionConfig.get('enable_wulai_ad') as boolean

    let showAllVisible = false
    // 如果快捷回复一屏幕可以展示、则不展示‘展开按钮’
    if (this.$ul) {
      showAllVisible = this.$ul.scrollWidth > this.$ul.clientWidth
    }

    return (
      <div>
        <div id="container-mask" />
        <div
          className={`${styles['quick-reply']} ${
            allArrowVisible ? styles['all-reply'] : null
          }`}
          id="replay"
          style={showLogo ? { top: '-68px' } : null}
        >
          <div
            className={styles.replyList}
            id="replyList"
            ref={ele => (this.replyListEle = ele)}
          >
            <ul
              ref={el => (this.$ul = el)}
              onScroll={this.handleUlScroll}
              style={{ maxHeight }}
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
