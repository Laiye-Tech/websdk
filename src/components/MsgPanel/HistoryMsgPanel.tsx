import Nerv, { Fragment } from 'nervjs'
import { connect } from 'nerv-redux'

import { IMsgBodyInfo } from '../../../interfaces'

import { getMsgHistory } from '../../data/message.data'

import Msg from '../MsgContent/Msg'

interface IState {
  messageList: IMsgBodyInfo[]
}

class RtMsgPanel extends Nerv.Component {
  state: IState = {
    messageList: []
  }

  async componentDidMount() {
    const res = await getMsgHistory()
    // 进入事件消息不展示
    const filterMsg = res.msg.filter(msg => {
      const isEnterMsg = msg.msg_body.event && msg.msg_body.event.event_type === 'ENTER'
      return !isEnterMsg
    })

    this.setState({ messageList: filterMsg })
  }

  render() {
    const { messageList } = this.state

    return(
      <Fragment>
        {messageList.map(msg => <Msg message={msg} key={msg.msg_id}/>)}
      </Fragment>
    )
  }
}

export default RtMsgPanel as any
