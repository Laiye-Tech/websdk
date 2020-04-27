import Nerv, { Fragment } from 'nervjs'
import { connect } from 'nerv-redux'

import { IMsgBodyInfo } from '../../../interfaces'

import Msg from '../MsgContent/Msg'

interface IProps {
  messageList: IMsgBodyInfo[]
  setMsgPanelRef: (el?: any) => void
}

class RtMsgPanel extends Nerv.Component<IProps> {
  props: IProps

  render() {
    const { messageList } = this.props

    return(
      <Fragment>
        {messageList.map(msg => <Msg message={msg} key={msg.msg_id}/>)}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  messageList: state.todos.rtMsgList
})

export default connect(mapStateToProps)(RtMsgPanel) as any
