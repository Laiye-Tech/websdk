import * as Nerv from 'nervjs'
import * as styles from './index.less'
import { Dispatch } from 'redux'
import { connect } from 'nerv-redux'

// actions
import { setUserName } from '../actions'

// API
import { login } from '../data/app.data'
import { getUserInfo } from '../utils/config'

// components
import ChatInput from '../components/ChatInput'

// interfaces
import { IPageConfig, AppInfo } from '../../interfaces'

interface IProps extends AppInfo {
  userName: string
  setUserName: (name: string) => void
}
interface IState {
  pageConfig: IPageConfig | null
}
class App extends Nerv.Component<IProps, IState> {
  props: IProps
  state: IState = {
    pageConfig: null
  }

  async componentDidMount() {
    const { pubkey, userInfo } = this.props

    const localUserInfo = getUserInfo() ? getUserInfo()[pubkey] : null
    const initUserInfo = {
      userId: '',
      userAvatar: '',
      nickName: ''
    }

    // 传入的用户信息 > 端上存的信息，如果都没有新创建一个用户
    const user = userInfo || (localUserInfo ? localUserInfo : initUserInfo)
    const res = await login(pubkey, user)
    this.setState({ pageConfig: res.page_config })

    const input = {
      pubkey,
      userId: userInfo ? userInfo.userId : res.user_id
    }

    // pubkey和用户信息存到端上
    if (!getUserInfo()) {
      const userInfo = {}
      userInfo[`${pubkey}`] = input
      window.localStorage.setItem('SDK_USER_INFO', JSON.stringify(userInfo))
    } else {
      const info = getUserInfo()
      info[pubkey] = input
      window.localStorage.setItem('SDK_USER_INFO', JSON.stringify(info))
    }
  }

  test = () => {
    this.props.setUserName('test')
  }

  render () {
    const { pageConfig } = this.state

    if (!pageConfig) {
      return null
    }

    // 主题颜色
    const backgroundColor = pageConfig.theme_color

    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <header className={styles.header}>
            <dl>
              <dt>
                <img src={pageConfig.header_avatar} style={{ backgroundColor }}/>
              </dt>
              <dd>测试</dd>
            </dl>

            <i className={styles.closeBtn}>
              <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/9c2ad2c1-1ffb-4f2c-8a2b-460109be9408.png"/>
            </i>
          </header>

          <main className={styles.msgContainer}>
            消息流
          </main>

          <footer className={styles.footer}>
            <ChatInput pageConfig={pageConfig}/>
          </footer>
        </div>

        <div className={styles.entryImg} style={{ backgroundColor }} onClick={this.test}>
          <img
            src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/6c64b84b-c00f-4eb4-b358-6880766adaa7.png"
            className={styles.closeImg}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userName: state.todos.name
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setUserName: name => dispatch(setUserName(name))
})

export default connect(mapStateToProps, mapDispatchToProps)(App) as any
