import * as Nerv from 'nervjs'
import { connect } from 'nerv-redux'
import * as styles from './ChatInput.less'

import { ISugList, MSG_TYPE } from '../../../interfaces'

interface IProps {
  userSugList: ISugList[]
  sendMsg: (msgType: MSG_TYPE, content: string) => Promise<void>
}

const SugList = (props: IProps) => {
  // 点击某一条sug 发送一条文本消息
  const onSugClick = (content: string) => () => {
    props.sendMsg('TEXT', content)
  }

  return (
    <div
      className={styles.sugContainer}
      id="sugContainer"
      style={{ bottom: '56px' }}
    >
      <ul>
        {props.userSugList.map((sug, index) => (
          <li key={`${index}`} onClick={onSugClick(sug.suggestion)}>
            {sug.suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  userSugList: state.todos.sugList
})

export default connect(
  mapStateToProps,
  null
)(SugList)
