import * as Nerv from 'nervjs'
import * as styles from './ChatInput.style.less'

import { IPageConfig } from '../../../interfaces'

interface IExProps {
  pageConfig: IPageConfig
}

class ChatInput extends Nerv.Component {
  render() {
    const { theme_color } = this.props.pageConfig

    return(
      <div className={styles.chatInput}>
        <textarea placeholder="输入文字进行回复，Shift+Enter换行" />

        <div className={styles.toolbar}>
          <div className={styles.pullLeft}>
            <div className={styles.picture}>
              <input type="file" accept="image/*" className={styles.uploader}/>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                  <path id="instagram" fill="#b3bdc5" d="M17.429 9.714a.857.857 0 1 1 0-1.715.857.857 0 0 1 0 1.715M12 15.428A3.432 3.432 0 0 1 8.571 12 3.432 3.432 0 0 1 12 8.571 3.432 3.432 0 0 1 15.429 12 3.432 3.432 0 0 1 12 15.428m6.286-9.714H12A1.716 1.716 0 0 0 10.286 4H9.142a1.717 1.717 0 0 0-1.714 1.714H5.714A1.717 1.717 0 0 0 4 7.43v9.142a1.717 1.717 0 0 0 1.714 1.715h12.572A1.717 1.717 0 0 0 20 16.57V7.43a1.716 1.716 0 0 0-1.714-1.715"/>
                </g>
              </svg>
            </div>
          </div>

          <div className={styles.pullRight} style={{ backgroundColor: theme_color }}>
            <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/c90a8872-8913-43cc-943b-f496c6c8fdf5.png"/>
          </div>
        </div>
      </div>
    )
  }
}

export default ChatInput
