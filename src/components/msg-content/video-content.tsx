import * as Nerv from 'nervjs'
import { connect, Dispatch } from 'nerv-redux'
import * as styles from './msg-content.module.less'

// actions
import { showVideoModal } from '../../stores/actions'

import { VideoMessage } from '../../../interfaces'

interface IProps {
  body: VideoMessage
  showVideoModal: (url: string) => void
}

const VideoContent = ({ body, showVideoModal }: IProps) => {
  const { resource_url } = body.video

  const openVideoModal = () => {
    // 打开视频的时候、阻止页面中其他音频的播放

    const audios = document.getElementsByTagName('audio')

    for (let i = 0; i < audios.length; i++) {
      if (audios[i]) {
        audios[i].pause()
      }
    }

    showVideoModal(resource_url)
  }

  return (
    <div className={styles.videoWrapper}>
      <video preload="true" src={resource_url} className={styles.video}>
        您的浏览器不支持video标签
      </video>

      <div
        className={`${styles.model} video-hover-icon-bg`}
        onClick={openVideoModal}
      >
        <div className={`${styles.playBox} play-icon`}>
          <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/8b03e713-d24c-406e-98d9-7e60ea2090af.png" />
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  showVideoModal: url => dispatch(showVideoModal(url))
})

export default connect(
  null,
  mapDispatchToProps
)(VideoContent) as any
