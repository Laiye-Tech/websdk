import * as Nerv from 'nervjs'
import * as styles from './style.less'

import { language } from '../../utils/config'

interface IProps {
  message: string
  btnVisible?: boolean
}

const TipsModal = (props: IProps) => {
  const { message, btnVisible = true } = props

  const title = language.get('Tips').alertTitle || '提示'
  const okText = language.get('Tips').reload

  return(
    <div className={styles['tips-modal']}>
      <div className={styles['msg-box']}>
        <div className={styles['msg-box-header']}>{title}</div>
        <div className={styles['msg-box-content']}>
          <div className={styles['msg-box-message']}>
            {message}
          </div>
        </div>

        {!btnVisible ? (
          <div className={styles['msg-box-btns']}>
            {okText}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default TipsModal
