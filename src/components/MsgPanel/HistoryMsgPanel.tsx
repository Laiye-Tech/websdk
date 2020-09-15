import Nerv from 'nervjs'
import * as styles from '../../views/index.less'

import { IMsgBodyInfo } from '../../../interfaces'

import { language } from '../../utils/config'
import { throttle } from '../../utils'
import { getMsgHistory } from '../../data/message.data'

import Msg from '../MsgContent/Msg'

interface IProps {
  startTs: string
}
interface IState {
  messageList: IMsgBodyInfo[]
  hasMore: boolean
}

class RtMsgPanel extends Nerv.Component {
  $container: HTMLElement
  props: IProps
  state: IState = {
    messageList: [],
    hasMore: false
  }

  componentDidMount() {
    this.fetchHistoryList()

    this.$container = document.getElementById('msg-scroll-panel')
    this.$container.addEventListener(
      'scroll',
      throttle(this.onScrollListener, 100)
    )
  }

  shouldComponentUpdate(_: IProps, nextState: IState) {
    const oldState = this.state

    const isMsgChange = oldState.messageList !== nextState.messageList
    if (!isMsgChange) {
      return false
    }
  }

  onScrollListener = () => {
    const scrollTop = this.$container.scrollTop
    const hasMore = this.state.hasMore

    if (scrollTop < 500 && hasMore) {
      const { messageList } = this.state
      const firstMsgId = messageList[0].msg_id

      this.fetchHistoryList(firstMsgId)
    }
  }

  fetchHistoryList = async (msgId: string = '') => {
    const res = await getMsgHistory(msgId)

    let messageList = []
    if (msgId) {
      // 当前传的msgid也会返回，需要过滤掉
      const msgList = res.msg.slice(0, -1)
      messageList = msgList.concat(this.state.messageList)
    } else {
      messageList = res.msg
    }

    this.setState({ messageList, hasMore: res.has_more })
  }

  render() {
    const { messageList, hasMore } = this.state
    const { startTs } = this.props
    const noMoreText = language.get('Message').noMore
    const text = language.get('Message').historyMsgTips

    const filterMsg = messageList
      // 进入事件消息不展示
      .filter(msg => {
        const isEnterMsg =
          msg.msg_body.event && msg.msg_body.event.event_type === 'ENTER'
        return !isEnterMsg
      })
      // 消息记录可能会和融云推送的欢迎语重复，需要过滤一下
      .filter(msg => {
        const isHideMsg = parseInt(msg.msg_ts, 10) > parseInt(startTs, 10)
        return !isHideMsg
      })

    return (
      <div key="history-msg">
        {!hasMore && <div className={styles.tips}>{noMoreText}</div>}
        {filterMsg.map(msg => (
          <Msg message={msg} key={msg.msg_id} isHistory />
        ))}
        {filterMsg.length ? <div className={styles.tips}>{text}</div> : null}
      </div>
    )
  }
}

export default RtMsgPanel as any
