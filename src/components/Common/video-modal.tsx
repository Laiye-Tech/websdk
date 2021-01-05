import * as Nerv from 'nervjs'
import * as styles from './style.module.less'

interface IProps {
  url: string
  closeVideoModal: () => void
}

const VideoModal = (props: IProps) => {
  const { url: sourceurl, closeVideoModal } = props

  const handelClick = (evt: any) => {
    evt.stopPropagation()
  }

  return (
    <div className={styles['video-modal']} onClick={closeVideoModal}>
      {sourceurl ? (
        <video
          className="video"
          src={sourceurl}
          autoPlay
          controls
          controlsList="nofullscreen"
          onClick={handelClick}
        />
      ) : null}
    </div>
  )
}

export default VideoModal
