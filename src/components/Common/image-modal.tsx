import * as Nerv from 'nervjs'
import * as styles from './style.module.less'

import { language } from '../../utils/config'

interface IProps {
  url: string
  closeImageModal: () => void
}

const ImgModal = (props: IProps) => {
  const { url, closeImageModal } = props

  return (
    <div className={styles['img-modal']} onClick={closeImageModal}>
      {url ? (
        <img src={url} alt="大图" />
        ) : (
          <span>{language.get('Image').noImg}</span>
        )}
    </div>
  )
}

export default ImgModal
