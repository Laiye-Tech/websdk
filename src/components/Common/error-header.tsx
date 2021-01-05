import * as Nerv from 'nervjs'
import * as styles from './style.module.less'

interface IProps {
  message: string
  isFull: boolean
}


const ErrorHeader = (props: IProps) => {
  const top0 = props.isFull ? styles['error-header-top-0'] : ''

  return (
    <div className={`${styles['error-header']} ${top0}`}>
      <p>{props.message}</p>
    </div>
  )
}

export default ErrorHeader
