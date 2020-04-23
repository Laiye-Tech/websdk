import * as Nerv from 'nervjs'
import * as styles from './style.less'

interface IProps {
  url: string
  closeImageModal: () => void
}

const ImgModal = (props: IProps) => {
  const { url, closeImageModal } = props

  return (
    <div className={styles['img-modal']}>
      {url ? (
        <img
          src={url}
          alt="大图"
          onClick={closeImageModal}
        />
        ) : (
          <span>无图片</span>
        )}
    </div>
  )
}

export default ImgModal
