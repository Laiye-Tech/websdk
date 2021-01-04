import * as Nerv from 'nervjs'
import * as styles from './style.less'
import { connect, Dispatch } from 'nerv-redux'

// actions
import { toggleToastPanel } from '../../stores/actions'

interface IProps {
  message: string
  closeToastPanel: () => void
}

const Toast = (props: IProps) => {
  if (props.message) {
    setTimeout(() => props.closeToastPanel(), 3000)
  }

  return (
    <div className={styles.toast}>
      <p>{props.message}</p>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  closeToastPanel: () => dispatch(toggleToastPanel({ message: '', visible: false }))
})

export default connect(null, mapDispatchToProps)(Toast)
