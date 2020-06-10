import * as Nerv from 'nervjs'
import * as styles from './style.less'
import { connect, Dispatch } from 'nerv-redux'

import { language } from '../../utils/config'

// actions
import { toggleTipsModal } from '../../actions'

import { ITipsModal } from '../../../interfaces'

interface IProps {
  message: string
  tipsModal: ITipsModal
  close: () => void
}

const TipsModal = (props: IProps) => {
  const { message, close, tipsModal } = props

  const title = language.get('Tips').alertTitle || '提示'
  const okText = language.get('Tips').reload

  const closeModal = () => {
    close()
    location.reload()
  }

  return(
    <div className={styles['tips-modal']}>
      <div className={styles['msg-box']}>
        <div className={styles['msg-box-header']}>{title}</div>
        <div className={styles['msg-box-content']}>
          <div className={styles['msg-box-message']}>
            {message}
          </div>
        </div>

        {tipsModal.showBtn ? (
          <div className={styles['msg-box-btns']} onClick={closeModal}>
            {okText}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const mapStateToProps = ({ todos }) => ({
  tipsModal: todos.tipsModal
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  close: () => dispatch(toggleTipsModal({ message: '', visible: false, showBtn: false }))
})

export default connect(mapStateToProps, mapDispatchToProps)(TipsModal)
