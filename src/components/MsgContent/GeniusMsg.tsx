import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import MsgContent from './MsgContent'

import { satisfactionEvaluate } from '../../data/message.data'
import {
  AVATAR_SHAPE,
  CHAT_BAR,
  page as PageConfig,
  language,
  interactionConfig
} from '../../utils/config'

import {
  IMsgBodyInfo,
  SATISFACTION_ENUM,
  EvaluateInfo
} from '../../../interfaces'

interface IProps {
  message: IMsgBodyInfo
  isHistory: boolean
}

interface IState {
  selectIcon: string
  isShowReportBtn: boolean
  isShowAnswerCard: boolean
  posRight: boolean
  posTop: boolean
}

const ANSWER_LIST: {
  title: string
  icon: string
  satisfaction: SATISFACTION_ENUM
  type: string
}[] = [
  {
    title: '满意',
    icon:
      'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/68e7fdd9-1e93-4993-b668-6dd4554093e0.png',
    satisfaction: SATISFACTION_ENUM.THUMB_UP,
    type: 'thumbUp'
  },
  {
    title: '内容不满意',
    icon:
      'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/14ab3428-57ec-460b-b33e-408d399a4e94.png',
    satisfaction: SATISFACTION_ENUM.BAD_ANSWER,
    type: 'badAnswer'
  },
  {
    title: '回答不匹配',
    icon:
      'https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/aeeed67b-0e21-44f2-979e-787c7121705f.png',
    satisfaction: SATISFACTION_ENUM.WRONG_ANSWER,
    type: 'wrongAnswer'
  }
]

class GeniusMsg extends Nerv.Component {
  props: IProps

  state: IState = {
    selectIcon: '',
    isShowReportBtn: false,
    isShowAnswerCard: false,
    posRight: false,
    posTop: false
  }

  componentDidMount() {
    const enableEvaluate =
      typeof this.props.message.enable_evaluate !== 'undefined'
    if (enableEvaluate) {
      this.setState({ isShowReportBtn: this.props.message.enable_evaluate })
    }
  }

  // 点赞点踩 & 举报
  changeAnswerStatus = (idx?: number) => () => {
    const isReport = typeof idx === 'undefined'
    const icon = !isReport
      ? ANSWER_LIST[idx].icon
      : 'https://cdn.wul.ai/weapp/invalid-name%403x.png'
    this.setState({ selectIcon: icon, isShowAnswerCard: false })

    const msg = this.props.message
    const input: EvaluateInfo = {
      bot_id: {
        knowledge_id: `${msg.bot.qa.knowledge_id}`
      },
      satisfaction: !isReport
        ? ANSWER_LIST[idx].satisfaction
        : SATISFACTION_ENUM.REPORT,
      msg_id: msg.msg_id,
      user_id: msg.user_id
    }

    satisfactionEvaluate(input)
  }

  showAnswerCard = (evt: any) => {
    this.setState({ isShowAnswerCard: !this.state.isShowAnswerCard })

    const msgPanel = document.getElementById('msg-scroll-panel')
    const left = msgPanel.getBoundingClientRect().left
    const top = msgPanel.getBoundingClientRect().top

    // TODO：这个250和310高度是调试出来的
    const posRight = evt.pageX - left >= 250
    const posTop = evt.pageY - top >= 310

    this.setState({ posRight, posTop })
  }

  render() {
    const { message, isHistory } = this.props
    const {
      selectIcon,
      isShowReportBtn,
      isShowAnswerCard,
      posRight,
      posTop
    } = this.state

    const bgColor = PageConfig.get('theme_color') as string
    const avatarShape = AVATAR_SHAPE[PageConfig.get('avatar_shape')]
    const chatBar = CHAT_BAR[PageConfig.get('chat_bar')]
    const avatar = PageConfig.get('bot_avatar')
    // bot_avatar_chose 2表示禁用
    const isShowBotAvatat =
      PageConfig.get('bot_avatar_chose') !== 2 && Boolean(avatar)
    const Satisfaction = language.get('Satisfaction')

    // 举报
    const reportBtnVisible = interactionConfig.get('enable_report')
    const reportTxt = Satisfaction.report

    const hasOwnContent =
      message.msg_type === 'IMAGE' ||
      message.msg_type === 'FILE' ||
      message.msg_type === 'SHARELINK' ||
      message.msg_type === 'VIDEO'

    const alRight = posRight ? styles['answer-pos-right'] : ''
    const alTop = posTop ? styles['answer-pos-top'] : ''
    const cls = !hasOwnContent ? styles.content : ''
    const answerList = ANSWER_LIST.map(answer => {
      return {
        ...answer,
        title: Satisfaction[answer.type]
      }
    })

    return (
      <div className={`${styles.msgContent}`}>
        <dl className={`${styles.msgContainer} ${styles.geniusMsg}`}>
          {isShowBotAvatat ? (
            <dt className={styles.userInfo}>
              <div
                className={`${styles.avatar} ${avatarShape}`}
                style={{ backgroundColor: bgColor }}
              >
                <img
                  src={`${avatar}?x-oss-process=image/resize,w_72,h_72/quality,q_80`}
                />
              </div>
            </dt>
          ) : null}

          <dd className={styles.msgBody}>
            <div className={`${styles.contentBody} ${cls} ${chatBar}`}>
              <MsgContent message={message} />

              {!isHistory && (isShowReportBtn || reportBtnVisible) ? (
                <div className={styles.answer}>
                  {selectIcon ? (
                    <img src={selectIcon} />
                  ) : (
                    <span onClick={this.showAnswerCard} />
                  )}

                  {isShowAnswerCard ? (
                    <ul className={`${styles.answerList} ${alRight} ${alTop}`}>
                      {isShowReportBtn &&
                        answerList.map((answer, idx) => (
                          <li
                            key={answer.type}
                            onClick={this.changeAnswerStatus(idx)}
                          >
                            <img src={answer.icon} />
                            <p>{answer.title}</p>
                          </li>
                        ))}

                      {reportBtnVisible ? (
                        <li key="report" onClick={this.changeAnswerStatus()}>
                          <img src="https://cdn.wul.ai/weapp/invalid-name%403x.png" />
                          <p>{reportTxt}</p>
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          </dd>
        </dl>

        <span className={styles.hiddenId}>#{message.msg_id}</span>
      </div>
    )
  }
}

export default GeniusMsg as any
