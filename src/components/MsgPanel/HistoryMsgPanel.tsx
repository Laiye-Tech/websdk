import Nerv from 'nervjs'
import * as styles from '../../views/index.less'

import { IMsgBodyInfo } from '../../../interfaces'

import { language } from '../../utils/config'
import { throttle } from '../../utils'
import { getMsgHistory } from '../../data/message.data'

import Msg from '../MsgContent/Msg'

interface IProps {
  scrollDom: HTMLDivElement
}
interface IState {
  messageList: IMsgBodyInfo[]
  hasMore: boolean
}

class RtMsgPanel extends Nerv.Component {
  props: IProps
  state: IState = {
    messageList: [],
    hasMore: false
  }

  componentDidMount() {
    this.fetchHistoryList()

    this.props.scrollDom.addEventListener('scroll', throttle(this.scrollTop, 200))
  }

  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    const oldProps = this.props
    const oldState = this.state

    const isMsgChange = oldState.messageList !== nextState.messageList
    if (nextProps.scrollDom != oldProps.scrollDom || !isMsgChange) {
      return false
    }
  }

  scrollTop = () => {
    const scrollTop = this.props.scrollDom.scrollTop
    const hasMore = this.state.hasMore

    if (scrollTop < 500 && hasMore) {
      const { messageList } = this.state
      const firstMsgId = messageList[0].msg_id
      const num = 20

      this.fetchHistoryList(firstMsgId, num)
    }
  }

  fetchHistoryList = async (msgId: string = '', num = 50) => {
    const res = await getMsgHistory(msgId, num)
    const msgList = res.msg.concat(this.state.messageList)

    this.setState({
      hasMore: res.has_more,
      messageList: msgList
    })
  }

  render() {
    const { messageList, hasMore } = this.state
    const noMoreText = language.get('Message').noMore

    // 进入事件消息不展示
    const filterMsg = messageList.filter(msg => {
      const isEnterMsg = msg.msg_body.event && msg.msg_body.event.event_type === 'ENTER'
      return !isEnterMsg
    })

    return(
      <div>
        {!hasMore && <div className={styles.tips}>{noMoreText}</div>}
        {filterMsg.map(msg => <Msg message={msg} key={msg.msg_id}/>)}
      </div>
    )
  }
}

export default RtMsgPanel as any
