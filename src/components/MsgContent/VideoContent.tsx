import * as Nerv from 'nervjs'
import * as styles from './MsgContent.less'

import { VideoMessage } from '../../../interfaces'

interface IProps {
  body: VideoMessage
}

export default function VideoContent({ body }: IProps) {
  const { resource_url } = body.video

  return(
    <div className={styles.videoWrapper}>
      <video preload="true" src={resource_url} className={styles.video}>
        您的浏览器不支持video标签
      </video>

      <div className={styles.model}>
        <div className={styles.playBox}>
          <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/8b03e713-d24c-406e-98d9-7e60ea2090af.png"/>
        </div>
      </div>
    </div>
  )
}
