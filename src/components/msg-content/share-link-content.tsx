import * as Nerv from 'nervjs'
import * as styles from './msg-content.less'

import { ShareLinkMessage } from '../../../interfaces'
import { page as PageConfig } from '../../utils/config'

interface IProps {
  body: ShareLinkMessage
}

enum EPicMode {
  unspecified = 'UNSPECIFIED',
  large = 'BIG_PIC',
  small = 'SMALL_PIC'
}

export default function VideoContent({ body }: IProps) {
  const { title, description, cover_url, destination_url } = body.share_link
  const picMode = PageConfig.get('pic_mode') || EPicMode.small

  return (
    <a
      className={styles.shareLinkContent}
      href={destination_url}
      target="_blank"
    >
      <dl>
        <dt>
          <h5 className={`${ picMode === EPicMode.large ? styles.largeTitle : null }`}>
            {title}
          </h5>
        </dt>
        <dd
          className={`${
            picMode === EPicMode.large
              ? styles.largePicContainer
              : styles.smallPicContainer
          }`}
        >
          <div className={styles.descriptionContainer}>
            <span className={styles.description}>{description}</span>
          </div>
          <div className={`${styles.coverUrl}`}>
            {cover_url ? (
              <img src={cover_url} />
            ) : (
              <img src="https://laiye-im-saas.oss-cn-beijing.aliyuncs.com/69135fc2-2a9a-47c2-8e10-248f0df9bb6c.png" />
            )}
          </div>
        </dd>
      </dl>
    </a>
  )
}
