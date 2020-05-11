import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import MsgContent from './MsgContent'

import { satisfactionEvaluate } from '../../data/message.data'
import { AVATAR_SHAPE, CHAT_BAR, page as PageConfig, language } from '../../utils/config'

import { IMsgBodyInfo, SATISFACTION_ENUM, EvaluateInfo } from '../../../interfaces'

interface IProps {
  message: IMsgBodyInfo
}

interface IState {
  selectIcon: string
  isShowReportBtn: boolean
  isShowAnswerCard: boolean
}

const ANSWER_LIST: {
  title: string,
  icon: string,
  satisfaction: SATISFACTION_ENUM,
  type: string
}[] = [
  {
    title: '满意',
    icon: 'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/68e7fdd9-1e93-4993-b668-6dd4554093e0.png',
    satisfaction: SATISFACTION_ENUM.THUMB_UP,
    type: 'thumbUp'
  },
  {
    title: '内容不满意',
    icon: 'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/14ab3428-57ec-460b-b33e-408d399a4e94.png',
    satisfaction: SATISFACTION_ENUM.BAD_ANSWER,
    type: 'badAnswer'
  },
  {
    title: '回答不匹配',
    icon: 'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/aeeed67b-0e21-44f2-979e-787c7121705f.png',
    satisfaction: SATISFACTION_ENUM.WRONG_ANSWER,
    type: 'wrongAnswer'
  }
]

class GeniusMsg extends Nerv.Component {
  props: IProps

  state: IState = {
    selectIcon: '',
    isShowReportBtn: false,
    isShowAnswerCard: false
  }

  componentDidMount() {
    const enableEvaluate = typeof this.props.message.enable_evaluate !== 'undefined'
    this.setState({ isShowReportBtn: enableEvaluate })
  }

  // 点赞点踩
  changeAnswerStatus = (idx: number) => () => {
    const icon = ANSWER_LIST[idx].icon
    this.setState({ selectIcon: icon, isShowAnswerCard: false })

    const msg = this.props.message
    const input: EvaluateInfo = {
      bot_id: {
        knowledge_id: `${msg.bot.qa.knowledge_id}`
      },
      satisfaction: ANSWER_LIST[idx].satisfaction,
      msg_id: msg.msg_id,
      user_id: msg.user_id
    }

    satisfactionEvaluate(input)
  }

  showAnswerCard = () => {
    this.setState({ isShowAnswerCard: true })
  }

  render() {
    const { message } = this.props
    const { selectIcon, isShowReportBtn, isShowAnswerCard } = this.state

    const bgColor = PageConfig.get('theme_color') as string
    const avatarShape = AVATAR_SHAPE[PageConfig.get('avatar_shape')]
    const chatBar = CHAT_BAR[PageConfig.get('chat_bar')]
    const avatar = PageConfig.get('bot_avatar')

    const hasOwnContent =
      message.msg_type === 'IMAGE' ||
      message.msg_type === 'FILE' ||
      message.msg_type === 'SHARELINK' ||
      message.msg_type === 'VIDEO'

    const cls = !hasOwnContent ? styles.content : ''
    const Satisfaction = language.get('Satisfaction')
    const answerList = ANSWER_LIST.map(answer => {
      return {
        ...answer,
        title: Satisfaction[answer.type]
      }
    })

    return(
      <div className={`${styles.msgContent}`}>
        <dl className={`${styles.msgContainer} ${styles.geniusMsg}`}>
          <dt className={styles.userInfo}>
            <div className={`${styles.avatar} ${avatarShape}`} style={{ backgroundColor: bgColor }}>
              <img src={`${avatar}?x-oss-process=image/resize,w_72,h_72/quality,q_80`}/>
            </div>
          </dt>

          <dd className={styles.msgBody}>
            <div className={`${styles.contentBody} ${cls} ${chatBar}`}>
              <MsgContent message={message}/>

              {isShowReportBtn ? (
                <div className={styles.answer}>
                  {selectIcon ? <img src={selectIcon}/> : <span onClick={this.showAnswerCard}/>}

                  {isShowAnswerCard ? (
                    <ul className={styles.answerList}>
                      {answerList.map((answer, idx) => (
                        <li key={answer.type} onClick={this.changeAnswerStatus(idx)}>
                          <img src={answer.icon}/>
                          <p>{answer.title}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>

            <span className={styles.hiddenId}>#{message.msg_id}</span>
          </dd>
        </dl>
      </div>
    )
  }
}

export default GeniusMsg as any
