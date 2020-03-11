import * as Nerv from 'nervjs'
import * as styles from './index.less'

// API
import { login } from '../data/app.data'

// components
import ChatInput from '../components/ChatInput'

import { IUserInput, IPageConfig } from '../../interfaces'


interface IState {
  pageConfig: IPageConfig | null
}

class App extends Nerv.Component {
  state: IState = {
    pageConfig: null
  }

  async componentDidMount() {
    const pubkey = 'FuLcN3rXprCb9vbDyHrUrTGtq7zi5faA0089175d1938a21c81'
    const userInfo: IUserInput = {
      userId: 'malei123',
      userAvatar: 'https://aibici-test.oss-cn-beijing.aliyuncs.com/fOoqAYR2n8BQ1kciauBcnC9ibMic34gicMM6EZ1ickMPBVHMEByzNicur5cFM21kOOIB49MOndMfwnv9k1IXa7nly6siceNqI1mIvaib.jpeg',
      nickName: '马蕾'
    }

    const res = await login(pubkey, userInfo)
    this.setState({ pageConfig: res.page_config })
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

        <div className={styles.entryImg} style={{ backgroundColor }}>
          <img
            src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/6c64b84b-c00f-4eb4-b358-6880766adaa7.png"
            className={styles.closeImg}
          />
        </div>
      </div>
    )
  }
}

export default App
